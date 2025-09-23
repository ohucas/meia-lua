import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import AnemiaFalciforme from './pages/AnemiaFalciforme'
import AutoCuidado from './pages/AutoCuidado'
import Dados from './pages/Dados'
import UnidadesComMapa from './pages/UnidadesComMapa'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="pt-20 flex-1">
          <Routes>
          {/* Páginas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sobre/anemia-falciforme" element={<AnemiaFalciforme />} />
          <Route path="/sobre/auto-cuidado" element={<AutoCuidado />} />
          <Route path="/sobre/dados" element={<Dados />} />
          <Route path="/centros/unidades" element={<UnidadesComMapa />} />
          
          {/* Compatibilidade com rotas antigas */}
          <Route path="/Home" element={<Home />} />
          <Route path="/anemia-falciforme" element={<AnemiaFalciforme />} />
          <Route path="/auto-cuidado" element={<AutoCuidado />} />
          <Route path="/dados" element={<Dados />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

