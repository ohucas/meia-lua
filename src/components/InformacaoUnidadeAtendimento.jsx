import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const InformacaoUnidadeAtendimento = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-red-600" />
        Unidade de Atendimento
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="font-medium text-gray-900">Endereço</p>
          <p className="text-gray-600">Av. Centenário, 801 – Garcia, Salvador – BA</p>
        </div>
        
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-red-600" />
            Telefones
          </p>
          <p className="text-gray-600"><span className="font-medium">Informações gerais:</span> (71) 3339-6000</p>
          <p className="text-gray-600 text-sm italic">Atendimento: 8h-19h, segunda a sexta</p>
        </div>
        
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-red-600" />
            E-mails
          </p>
          <p className="text-gray-600"><span className="font-medium">Triagem:</span> ambulatorio.triagem@hemoba.ba.gov.br</p>
          <p className="text-gray-600"><span className="font-medium">Contato geral:</span> contato@hemoba.ba.gov.br</p>
        </div>
        
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-red-600" />
            Horário de Atendimento
          </p>
          <p className="text-gray-600">Segunda a sexta-feira, das 7h às 19h</p>
        </div>
      </div>
    </div>
  );
};

export default InformacaoUnidadeAtendimento;

