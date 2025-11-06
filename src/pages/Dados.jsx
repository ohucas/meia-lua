import { BarChart3, PieChart, LineChart, Database } from 'lucide-react';

const Dados = () => {
  const statistics = [
    {
      title: "Prevalência no Brasil",
      value: "1 em 1.000",
      description: "nascimentos são afetados pela doença falciforme"
    },
    {
      title: "Região Nordeste",
      value: "6-10%",
      description: "da população possui o traço falciforme"
    },
    {
      title: "Expectativa de Vida",
      value: "40-60 anos",
      description: "com tratamento adequado"
    },
    {
      title: "Crises de Dor",
      value: "2-6x/ano",
      description: "em média por paciente"
    }
  ]

  const facts = [
    {
      title: "Origem Genética",
      description: "A doença falciforme é causada por uma mutação no gene da beta-globina, resultando na produção de hemoglobina S (HbS)."
    },
    {
      title: "Herança",
      description: "É uma doença autossômica recessiva, ou seja, ambos os pais devem ser portadores do gene para que o filho tenha a doença."
    },
    {
      title: "Diagnóstico",
      description: "O teste do pezinho (triagem neonatal) pode detectar a doença nos primeiros dias de vida."
    },
    {
      title: "Tratamento Moderno",
      description: "Novos medicamentos como voxelotor e crizanlizumabe oferecem melhores opções de tratamento."
    }
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 bg-gradient-to-br from-[#C8102E] to-[#E63946] text-white text-center">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Dados e Estatísticas
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            Informações importantes sobre a anemia falciforme no Brasil e no mundo. 
            Dados epidemiológicos, estatísticas de prevalência e informações científicas 
            atualizadas sobre a doença.
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#C8102E] mb-12">
            Estatísticas Importantes
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {stat.title}
                </h3>
                <div className="text-3xl font-bold text-[#C8102E] mb-3">
                  {stat.value}
                </div>
                <p className="text-gray-600 text-sm">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facts Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#C8102E] mb-12">
            Fatos Científicos
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {facts.map((fact, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#C8102E]">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {fact.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research and Development */}
      <section className="py-16 px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#C8102E] mb-8">
            Pesquisa e Desenvolvimento
          </h2>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Avanços Recentes
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-[#C8102E] mb-2">Terapia Gênica</h4>
                <p className="text-gray-700 text-sm">
                  Pesquisas promissoras em terapia gênica oferecem esperança de cura definitiva.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-[#C8102E] mb-2">Novos Medicamentos</h4>
                <p className="text-gray-700 text-sm">
                  Desenvolvimento de medicamentos mais eficazes com menos efeitos colaterais.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-[#C8102E] mb-2">Transplante</h4>
                <p className="text-gray-700 text-sm">
                  Melhorias nas técnicas de transplante de medula óssea aumentam as taxas de sucesso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#C8102E] mb-8">
            Fontes e Referências
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="space-y-4 text-gray-700">
              <li>
                <strong>Ministério da Saúde - </strong>
                <a href="https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-doenca-falciforme" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] hover:underline">
                  Diretrizes para Atenção à Pessoa com Doença Falciforme
                </a>
              </li>
              <li>
                <strong>ANVISA - </strong>
                <a href="https://www.gov.br/saude/pt-br/assuntos/noticias/2025/abril/ministerio-da-saude-amplia-acesso-a-medicamentos-para-pacientes-com-doenca-falciforme" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] hover:underline">
                  Regulamentação de Medicamentos para Anemia Falciforme
                </a>
              </li>
              <li>
                <strong>Associação Brasileira de Hematologia - </strong>
                <a href="https://hcfmb.unesp.br/wp-content/uploads/2023/09/PRC-SP-008-%E2%80%93-Protocolo-de-Manejo-das-Crises-de-Falcizacao-Aguda-Falciforme-na-Crianca.pdf" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] hover:underline">
                  Protocolos de Tratamento
                </a>
              </li>
              <li>
                <strong>Organização Mundial da Saúde - </strong>
                <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] hover:underline">
                  Global Health Observatory Data
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dados

