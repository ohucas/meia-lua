import { Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#a9001c] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-lg mb-4">
            Sistema Meia Lua desenvolvido pela{' '}
            <a 
              href="https://instagram.com/bripes.oficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold hover:text-red-200 transition-colors duration-200 inline-flex items-center gap-2"
            >
              Bripes
              <Instagram className="w-5 h-5" />
            </a>
          </p>
          <div className="border-t border-white/20 pt-4 mt-4">
            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} Sistema Meia Lua. Todos os direitos reservados.
            </p>
            <p className="text-xs text-white/60 mt-2">
              Plataforma de informações sobre anemia falciforme
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

