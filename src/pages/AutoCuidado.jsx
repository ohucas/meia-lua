import { Heart, Droplets, Thermometer, Activity, Moon, Stethoscope, AlertTriangle, Phone } from 'lucide-react';

const AutoCuidado = () => {
  const cuidados = [
    {
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      titulo: "Hidratação Adequada",
      descricao: "Beba pelo menos 2-3 litros de água por dia. A desidratação pode desencadear crises de dor.",
      dicas: [
        "Mantenha sempre uma garrafa de água por perto",
        "Evite bebidas alcoólicas e com cafeína em excesso",
        "Aumente a ingestão de líquidos em dias quentes",
        "Inclua sucos naturais e água de coco na sua rotina"
      ]
    },
    {
      icon: <Thermometer className="w-8 h-8 text-red-500" />,
      titulo: "Controle de Temperatura",
      descricao: "Evite mudanças bruscas de temperatura que podem desencadear crises vaso-oclusivas.",
      dicas: [
        "Evite banhos muito quentes ou muito frios",
        "Use roupas adequadas para o clima",
        "Mantenha-se em ambientes com temperatura amena",
        "Evite ar-condicionado muito forte"
      ]
    },
    {
      icon: <Activity className="w-8 h-8 text-green-500" />,
      titulo: "Atividade Física",
      descricao: "Mantenha-se ativo, mas evite excessos e cansaço extremo.",
      dicas: [
        "Pratique exercícios leves a moderados regularmente",
        "Evite esportes de contato intenso",
        "Hidrate-se bem durante as atividades",
        "Respeite seus limites e descanse quando necessário"
      ]
    },
    {
      icon: <Moon className="w-8 h-8 text-purple-500" />,
      titulo: "Sono de Qualidade",
      descricao: "Durma bem para ajudar no controle da dor e na recuperação.",
      dicas: [
        "Mantenha um horário regular de sono",
        "Crie um ambiente tranquilo e confortável para dormir",
        "Evite cafeína e telas antes de dormir",
        "Tire cochilos durante o dia se necessário"
      ]
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-yellow-500" />,
      titulo: "Acompanhamento Médico",
      descricao: "Mantenha suas consultas e exames em dia.",
      dicas: [
        "Siga corretamente as orientações médicas",
        "Não interrompa os medicamentos sem orientação",
        "Mantenha um registro de suas crises e sintomas",
        "Esteja em dia com as vacinas"
      ]
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      titulo: "Sinais de Alerta",
      descricao: "Fique atento aos sinais que indicam a necessidade de procurar ajuda médica.",
      dicas: [
        "Febre acima de 38°C",
        "Dor intensa que não melhora com os medicamentos habituais",
        "Dificuldade para respirar",
        "Fraqueza ou formigamento em um lado do corpo"
      ]
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      titulo: "Saúde Emocional",
      descricao: "Cuide da sua saúde mental e emocional.",
      dicas: [
        "Procure grupos de apoio",
        "Converse sobre seus sentimentos com pessoas de confiança",
        "Pratique técnicas de relaxamento",
        "Não hesite em buscar ajuda psicológica se necessário"
      ]
    },
    {
      icon: <Phone className="w-8 h-8 text-teal-500" />,
      titulo: "Emergências",
      descricao: "Saiba quando e como procurar ajuda médica de emergência.",
      dicas: [
        "Tenha sempre à mão os contatos de emergência",
        "Saiba o hospital de referência mais próximo",
        "Tenha uma cópia do seu prontuário médico",
        "Informe aos familiares sobre sua condição e necessidades"
      ]
    }
  ];

  const sinaisAlerta = [
    "Dor intensa que não melhora com analgésicos",
    "Febre alta (acima de 38°C)",
    "Dificuldade para respirar",
    "Dor no peito",
    "Palidez extrema ou icterícia",
    "Vômitos persistentes",
    "Dor abdominal intensa",
    "Alterações na visão"
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C8102E] to-[#E63946] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Autocuidado e Bem-Estar
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto">
              Orientações e dicas essenciais para o seu dia a dia com anemia falciforme
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Guia de Autocuidado
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Conheça as melhores práticas para manter sua saúde e qualidade de vida
            </p>
          </div>

          <div className="space-y-12">
            {cuidados.map((cuidado, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-red-100 p-3 rounded-lg">
                      {cuidado.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-900">{cuidado.titulo}</h3>
                      <p className="mt-2 text-gray-600">{cuidado.descricao}</p>
                      
                      {cuidado.dicas && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">Dicas importantes:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {cuidado.dicas.map((dica, i) => (
                              <li key={i} className="text-gray-700">{dica}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sinais de Alerta */}
          <div className="mt-16">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                <h2 className="text-2xl font-bold text-red-700">
                  Sinais de Alerta - Procure Ajuda Médica Imediatamente
                </h2>
              </div>
              <p className="text-red-700 mb-4">
                Se você apresentar qualquer um dos sintomas abaixo, procure atendimento médico de emergência:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sinaisAlerta.map((sinal, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                    <span className="text-red-700 font-medium">{sinal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AutoCuidado;
