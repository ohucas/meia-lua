🩸 Meia Lua: Acesso Fácil à Informação e ao Tratamento da Anemia Falciforme

🌟 Visão Geral do Projeto

O Meia Lua é um projeto de Trabalho de Conclusão de Curso (TCC) que visa criar um portal de acessibilidade e informação dedicado à Doença Falciforme. O objetivo principal é facilitar o acesso a informações confiáveis sobre a doença e, crucialmente, auxiliar os usuários a localizar unidades de acompanhamento e centros de referência para tratamento, utilizando recursos de geolocalização.

Este projeto é uma solução full-stack desenvolvida para ser uma ferramenta de suporte informativo e prático para pacientes, familiares e profissionais de saúde.

https://meia-lua.vercel.app/

🎯 Funcionalidades Principais

•
Mapeamento de Unidades de Tratamento: Utilização de Leaflet e react-leaflet para exibir um mapa interativo com a localização de centros de referência e hospitais especializados.

•
Conteúdo Informativo: Seções dedicadas a explicar a doença, sintomas, tratamentos e cuidados essenciais.

•
Autenticação Segura: Sistema de login e registro para usuários e administradores, gerenciado pelo Flask-JWT-Extended e Flask-Bcrypt.

•
Painel Administrativo: Interface para gerenciamento de dados, como a inclusão e atualização das unidades de tratamento.

•
Design Responsivo: Interface moderna e acessível, construída com React, Tailwind CSS e componentes Radix UI.

🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: Frontend (Cliente) e Backend (Servidor).

Frontend (Cliente)

Tecnologia
Descrição
React
Biblioteca JavaScript para construção da interface de usuário.
Vite
Ferramenta de build rápido para o desenvolvimento frontend.
Tailwind CSS
Framework CSS utility-first para estilização rápida e responsiva.
Radix UI
Biblioteca de componentes acessíveis e não estilizados.
React Router DOM
Gerenciamento de rotas e navegação na aplicação.
Leaflet / React-Leaflet
Biblioteca para mapas interativos e visualização de geolocalização.
Recharts
Biblioteca para visualização de dados (gráficos).


Backend (Servidor)

Tecnologia
Descrição
Python
Linguagem de programação principal.
Flask
Micro-framework web para a construção da API RESTful.
SQLAlchemy
ORM (Mapeador Objeto-Relacional) para interação com o banco de dados.
Flask-Migrate
Extensão para gerenciar migrações de banco de dados (Alembic).
Flask-JWT-Extended
Implementação de autenticação baseada em JSON Web Tokens (JWT).
Flask-Bcrypt
Hashing seguro de senhas.
Gunicorn
Servidor WSGI para implantação em produção.
psycopg
Adaptador para banco de dados PostgreSQL.


