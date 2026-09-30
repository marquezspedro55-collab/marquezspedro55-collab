/*
 * DADOS DO ESCRITÓRIO — edite só este arquivo para atualizar o site inteiro.
 * Campo vazio ('') = a informação some do site (nada de "[PENDENTE]" no ar).
 */
window.SITE = {
  nome: 'TMS Advogados Associados',

  // Contato
  whatsapp: '5511991537423',              // só números, com DDI 55 + DDD
  whatsappExibicao: '(11) 99153-7423',
  email: 'advdanilomarques@gmail.com',     // recomendado: e-mail no domínio próprio (contato@seudominio.com.br)
  horario: 'Segunda a sexta, das 9h às 18h',

  // Endereço
  endereco: 'Alameda Itapecuru, 645',
  complemento: 'Edifício Metrópolis, Alphaville Industrial',
  cidadeUF: 'Barueri/SP',
  cep: '06454-080',

  // Registros (Provimento 205/2021 do CFOAB: identificar advogados e sociedade)
  cnpj: '',                                // ex.: '00.000.000/0001-00'
  registroSociedadeOAB: '',                // ex.: 'OAB/SP nº 00.000'
  socios: [
    { nome: 'Danilo Barbosa Marques', titulo: 'Dr.', oab: 'OAB/SP 467.790', cargo: 'Sócio', foto: 'assets/img/equipe/danilo.jpg', iniciais: 'DM' },
    { nome: 'Edmar Tomazzeli', titulo: 'Dr.', oab: '', cargo: 'Sócio · Pós-graduado em Direito Internacional (USP)', foto: 'assets/img/equipe/edmar.jpg', iniciais: 'ET' }
  ],

  // Frase de tempo de mercado. Deixe '' se não puder ser comprovada.
  experiencia: 'Mais de 20 anos',

  // EUA: nome do escritório/advogado parceiro licenciado nos EUA ('' = texto genérico)
  parceiroEUA: '',

  // Formulário: por padrão envia pelo WhatsApp. Para receber também por e-mail,
  // crie um formulário gratuito em https://formspree.io e cole a URL aqui.
  formEndpoint: ''
};
