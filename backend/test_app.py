import pytest
from backend.app import create_app
from backend.extensions import db, bcrypt
from backend.models.user import User
from backend.config import Config

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def register_user(client, email, cpf, password, role, full_name="Test User"):
    return client.post(
        "/auth/register",
        json={
            "email": email,
            "cpf": cpf,
            "password": password,
            "role": role,
            "full_name": full_name
        }
    )

def login_user(client, email_cpf, password, role):
    return client.post(
        "/auth/login",
        json={
            "email_cpf": email_cpf,
            "password": password,
            "role": role
        }
    )

def test_register_patient(client):
    response = register_user(client, "patient@example.com", "11122233344", "password123", "paciente")
    assert response.status_code == 201
    assert "msg" in response.json
    assert response.json["msg"] == "Usuário registrado com sucesso"

def test_register_pharmacist(client):
    response = client.post(
        "/users/farmaceuticos",
        json={
            "email": "pharmacist@example.com",
            "cpf": "55566677788",
            "password": "password123",
            "full_name": "Farmaceutico Teste",
            "crf": "12345"
        }
    )
    assert response.status_code == 401 # Requires admin token

def test_register_admin(client):
    response = client.post(
        "/users/administradores",
        json={
            "email": "admin@example.com",
            "cpf": "99988877766",
            "password": "password123",
            "full_name": "Admin Teste"
        }
    )
    assert response.status_code == 401 # Requires admin token

def test_login_patient(client):
    register_user(client, "patient@example.com", "11122233344", "password123", "paciente")
    response = login_user(client, "patient@example.com", "password123", "paciente")
    assert response.status_code == 200
    assert "access_token" in response.json
    assert response.json["user"]["role"] == "paciente"

def test_login_invalid_credentials(client):
    response = login_user(client, "nonexistent@example.com", "wrongpassword", "paciente")
    assert response.status_code == 401
    assert response.json["msg"] == "Credenciais inválidas"

def test_get_users_unauthorized(client):
    response = client.get("/users/")
    assert response.status_code == 401

def test_create_pharmacist_as_admin(client):
    # Register and login as admin
    register_user(client, "farma@example.com", "12345678900", "adminpass", "administrador", full_name="Admin User")
    admin_login_response = login_user(client, "admin@example.com", "adminpass", "administrador")
    admin_token = admin_login_response.json["access_token"]

    response = client.post(
        "/users/farmaceuticos",
        json={
            "email": "farmaceutico@example.com",
            "cpf": "55566677788",
            "password": "senha123",
            "full_name": "Farmaceutico Teste",
            "crf": "12345"
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )
    assert response.status_code == 201
    assert response.json["msg"] == "Farmacêutico registrado com sucesso"

def test_get_users_as_admin(client):
    # Register and login as admin
    register_user(client, "admin@example.com", "12345678900", "adminpass", "administrador", full_name="Admin User")
    admin_login_response = login_user(client, "admin@example.com", "adminpass", "administrador")
    admin_token = admin_login_response.json["access_token"]

    # Create a patient
    register_user(client, "patient@example.com", "11122233344", "password123", "paciente")

    # Create a pharmacist as admin
    client.post(
        "/users/farmaceuticos",
        json={
            "email": "pharmacist@example.com",
            "cpf": "55566677788",
            "password": "password123",
            "full_name": "Farmaceutico Teste",
            "crf": "12345"
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    response = client.get(
        "/users/",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )
    assert response.status_code == 200
    assert len(response.json) == 3 # Admin, Patient, Pharmacist
    assert any(u["role"] == "paciente" for u in response.json)
    assert any(u["role"] == "farmaceutico" for u in response.json)
    assert any(u["role"] == "administrador" for u in response.json)


# Add more tests for other endpoints (appointments, inventory, metrics, audit) as needed


