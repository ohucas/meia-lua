import heroImage from '../assets/img/ator-2.png'
import logoImage from '../assets/img/logo2.png'

const AnemiaFalciforme = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C8102E] to-[#E63946] text-white py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
               Doença Falciforme
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8">
                Saiba mais sobre a doença falciforme, uma condição genética que afeta milhares de pessoas. 
                Entenda seus sintomas, formas de diagnóstico e as melhores maneiras de conviver com a doença.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="aspect-square w-full bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl transform rotate-1">
                  <div className="relative w-full h-full border-2 border-white/20 rounded-2xl overflow-hidden">
                    <img 
                      src={heroImage} 
                      alt="Imagem Médicos" 
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex-1 min-w-[300px]">
              <h2 className="text-3xl font-bold text-[#C8102E] mb-6">
                O que é Anemia Falciforme?
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                A doença falciforme é uma <b>doença genética e hereditária</b> que afeta a produção de hemoglobina, 
                a proteína responsável pelo transporte de oxigênio no sangue. É caracterizada pela alteração na forma dos glóbulos vermelhos, que se tornam rígidos e em formato de foice (ou meia-lua) em vez de serem redondos e flexíveis. 
              </p>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Esta condição é mais comum em pessoas de ascendência africana, mas também afeta populações do Mediterrâneo, Oriente Médio e partes da Índia. No Brasil, é considerada a doença genética mais prevalente, com cerca de 25 a 30 mil pessoas diagnosticadas, segundo o Ministério da Saúde.
              </p>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                A alteração na forma dos glóbulos vermelhos dificulta sua passagem pelos vasos sanguíneos, causando obstruções que podem levar a dores intensas, danos aos órgãos e outras complicações sérias de saúde. A expectativa de vida de pessoas com anemia falciforme aumentou significativamente nas últimas décadas, graças aos avanços no tratamento e acompanhamento médico.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={logoImage} 
                alt="Logo Meia Lua" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <section className="py-16 px-8 bg-[#C8102E] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Causas</h2>
          <p className="text-lg leading-relaxed mb-6">
            A doença falciforme é causada por uma <b>mutação genética</b> no gene da globina beta da hemoglobina (HbA). Essa mutação leva à produção de uma hemoglobina anormal, conhecida como <b>hemoglobina S (HbS)</b>. A doença é <b>hereditária</b>, o que significa que é transmitida de pais para filhos. Para que uma pessoa desenvolva a doença, ela precisa herdar o gene mutado de ambos os pais (<b>condição homozigótica SS</b>). Se herdar apenas um gene mutado (<b>condição heterozigótica AS</b>), a pessoa é portadora do <b>traço falciforme</b> e geralmente não apresenta sintomas da doença, mas pode transmiti-lo aos seus descendentes.
          </p>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#C8102E] mb-6">Sintomas</h2>
          <ul className="space-y-4 text-lg text-gray-700">
            <li><b>Crises de Dor (Crises Vaso-Oclusivas):</b> São o sintoma mais característico e ocorrem quando os glóbulos vermelhos em forma de foice bloqueiam o fluxo sanguíneo em pequenos vasos, causando dor intensa em ossos, articulações, abdômen e tórax.</li>
            <li><b>Anemia Crônica:</b> A vida útil dos glóbulos vermelhos falciformes é muito menor, resultando em anemia constante, fadiga, fraqueza, palidez e falta de ar.</li>
            <li><b>Icterícia:</b> Amarelamento da pele e dos olhos devido à destruição acelerada dos glóbulos vermelhos.</li>
            <li><b>Infecções Frequentes:</b> Maior suscetibilidade a infecções bacterianas graves devido a danos no baço.</li>
            <li><b>Síndrome Torácica Aguda:</b> Complicação grave com dor no peito, febre e dificuldade respiratória.</li>
            <li><b>Acidente Vascular Cerebral (AVC):</b> Bloqueio de vasos sanguíneos no cérebro, podendo causar danos neurológicos.</li>
          </ul>
        </div>
      </section>

      {/* Diagnosis Section */}
      <section className="py-16 px-8 bg-[#C8102E] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Diagnóstico</h2>
          <p className="text-lg leading-relaxed mb-6">
            O diagnóstico da doença falciforme é feito principalmente através de <b>exames de sangue</b>:
          </p>
          <ul className="space-y-4 text-lg">
            <li><b>Teste do Pezinho:</b> Principal método de triagem neonatal no Brasil.</li>
            <li><b>Eletroforese de Hemoglobina:</b> Confirma o diagnóstico, identificando os tipos de hemoglobina no sangue.</li>
            <li><b>Hemograma Completo:</b> Pode indicar anemia e outras alterações relacionadas à doença.</li>
          </ul>
        </div>
      </section>

      {/* Treatment Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#C8102E] mb-6">Tratamento e Cuidados</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            O tratamento da doença falciforme é multidisciplinar e visa aliviar os sintomas, prevenir complicações e melhorar a qualidade de vida. Inclui:
          </p>
          <ul className="space-y-4 text-lg text-gray-700 mb-8">
            <li><b>Hidroxiureia:</b> Medicamento que estimula a produção de hemoglobina fetal, reduzindo a frequência das crises de dor e a necessidade de transfusões.</li>
            <li><b>Transfusões de Sangue:</b> Indicadas para casos de anemia grave, síndrome torácica aguda ou risco de AVC. Podem ser eventuais ou regulares, dependendo da gravidade.</li>
            <li><b>Transplante de Medula Óssea:</b> Atualmente a única cura disponível, mas com limitações como necessidade de doador compatível e riscos associados ao procedimento.</li>
            <li><b>Terapias Gênicas:</b> Novas abordagens como a terapia CRISPR-Cas9 mostram resultados promissores para a cura da doença, com pesquisas em andamento.</li>
          </ul>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            <b>Cuidados diários importantes:</b>
          </p>
          <ul className="space-y-3 text-lg text-gray-700 mb-6 list-disc pl-6">
            <li>Manter-se bem hidratado para evitar a desidratação, que pode desencadear crises</li>
            <li>Evitar temperaturas extremas, tanto frio quanto calor excessivo</li>
            <li>Manter o calendário vacinal em dia, incluindo vacinas especiais para pessoas com doença falciforme</li>
            <li>Praticar atividade física moderada, com orientação médica</li>
            <li>Ter acompanhamento médico regular com hematologista e outros especialistas conforme necessário</li>
          </ul>
        </div>
      </section>

      {/* Data Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#C8102E] mb-6">Dados e Estatísticas</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#C8102E] mb-4">No Brasil</h3>
              <ul className="space-y-3">
                <li><b>Prevalência:</b> Entre 60 a 100 mil pessoas vivem com a doença no país</li>
                <li><b>Incidência:</b> Cerca de 3.500 novos casos diagnosticados anualmente</li>
                <li><b>Triagem Neonatal:</b> O Teste do Pezinho, obrigatório desde 2001, identifica precocemente a doença</li>
                <li><b>Internações:</b> Aumento de 47% nas internações entre 2012 e 2023 (DATASUS)</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#C8102E] mb-4">No Mundo</h3>
              <ul className="space-y-3">
                <li><b>Prevalência Global:</b> Cerca de 20-25 milhões de pessoas afetadas</li>
                <li><b>Países mais afetados:</b> Países da África Subsaariana, Índia e Oriente Médio</li>
                <li><b>Expectativa de Vida:</b> Pode ultrapassar 50 anos em países com bom acesso à saúde</li>
                <li><b>Dia Mundial:</b> 19 de junho é o Dia Mundial de Conscientização sobre a Doença Falciforme</li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#C8102E] mb-4">Avanços Recentes</h3>
            <p className="mb-4">Nos últimos anos, houve avanços significativos no tratamento e compreensão da doença falciforme:</p>
            <ul className="space-y-3 list-disc pl-6">
              <li>Aprovação de novas terapias medicamentosas específicas para a doença</li>
              <li>Melhorias nas técnicas de transplante de medula óssea, com maior taxa de sucesso</li>
              <li>Desenvolvimento de terapias gênicas promissoras que podem levar à cura</li>
              <li>Maior conscientização e diagnóstico precoce através de políticas públicas de saúde</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AnemiaFalciforme


