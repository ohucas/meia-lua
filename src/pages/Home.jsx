import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '../assets/img/atores-1.png';

const Home = () => {
  return (
    <main className="min-h-screen">
      <section className="bg-[#C8102E] text-white min-h-screen flex items-center m-0 p-0">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Meia Lua: Acesso Fácil à Informação e ao Tratamento da Doença Falciforme!
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-8 leading-relaxed">
                Um portal de acessibilidade dedicado ao entendimento da doença falciforme, 
                oferecendo suporte informativo e ferramentas para localizar unidades de 
                acompanhamento e centros de referência.
              </p>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <img 
                src={heroImage} 
                alt="Imagem relacionada à saúde" 
                className="w-full h-auto max-w-lg mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home


