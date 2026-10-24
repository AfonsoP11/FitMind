/* Dados de catálogo. Hoje são fixos e fictícios; quando houver backend,
   FM.store.getPsychologists() passa a buscar daqui de uma API. */

FM.topics = [
  { id: 'ansiedade',       label: 'Ansiedade' },
  { id: 'depressao',       label: 'Tristeza e depressão' },
  { id: 'burnout',         label: 'Estresse e burnout' },
  { id: 'relacionamentos', label: 'Relacionamentos' },
  { id: 'autoestima',      label: 'Autoestima' },
  { id: 'luto',            label: 'Luto e perdas' },
  { id: 'familia',         label: 'Família e parentalidade' },
  { id: 'tdah',            label: 'TDAH e foco' },
  { id: 'trauma',          label: 'Trauma' },
  { id: 'lgbt',            label: 'Questões LGBTQIA+' },
  { id: 'carreira',        label: 'Carreira e propósito' },
  { id: 'sono',            label: 'Sono' }
];

FM.approaches = [
  { id: 'tcc',        label: 'TCC',               full: 'Terapia cognitivo-comportamental' },
  { id: 'psicanalise',label: 'Psicanálise',       full: 'Psicanálise' },
  { id: 'act',        label: 'ACT',               full: 'Terapia de aceitação e compromisso' },
  { id: 'humanista',  label: 'Humanista',         full: 'Abordagem centrada na pessoa' },
  { id: 'gestalt',    label: 'Gestalt',           full: 'Gestalt-terapia' },
  { id: 'sistemica',  label: 'Sistêmica',         full: 'Terapia sistêmica (casal e família)' },
  { id: 'junguiana',  label: 'Junguiana',         full: 'Psicologia analítica junguiana' }
];

FM.psychologists = [
  {
    id: 'helena-prado',
    name: 'Helena Prado',
    gender: 'f',
    crp: '06/148392',
    city: 'São Paulo, SP',
    color: '#3D7A5E',
    approaches: ['tcc', 'act'],
    topics: ['ansiedade', 'burnout', 'sono', 'carreira'],
    audiences: ['Adultos'],
    modalities: ['online', 'presencial'],
    price: 190, duration: 50,
    rating: 4.9, reviewCount: 214, years: 11,
    languages: ['Português', 'Inglês'],
    weekdays: [1, 2, 3, 4, 5],
    hours: ['07:00', '08:00', '12:00', '18:00', '19:00', '20:00'],
    headline: 'Ansiedade e esgotamento no trabalho, com técnicas práticas entre as sessões.',
    bio: 'Trabalho com adultos que sentem que a cabeça não desliga: ansiedade, insônia, cobrança excessiva e esgotamento. Na TCC a gente entende juntos os padrões que mantêm o sofrimento e testa, aos poucos, outras formas de reagir. Você sai das sessões com algo concreto para experimentar na semana.',
    education: ['Psicologia, USP', 'Especialização em TCC, Instituto Beck Brasil', 'Formação em ACT, ACBS'],
    reviews: [
      { name: 'Marina S.', stars: 5, when: 'há 2 semanas', text: 'Em poucas sessões consegui voltar a dormir sem remédio. Ela é direta e muito acolhedora ao mesmo tempo.' },
      { name: 'Rafael T.', stars: 5, when: 'há 1 mês', text: 'Primeira vez fazendo terapia e me senti à vontade desde o começo. As tarefas entre as sessões ajudam muito.' },
      { name: 'Júlia M.', stars: 4, when: 'há 2 meses', text: 'Profissional excelente. Às vezes a agenda fica bem cheia, vale reservar com antecedência.' }
    ]
  },
  {
    id: 'thiago-albuquerque',
    name: 'Thiago Albuquerque',
    gender: 'm',
    crp: '05/61207',
    city: 'Rio de Janeiro, RJ',
    color: '#2F6F86',
    approaches: ['psicanalise'],
    topics: ['depressao', 'relacionamentos', 'luto', 'autoestima'],
    audiences: ['Adultos', 'Idosos'],
    modalities: ['online'],
    price: 160, duration: 50,
    rating: 4.8, reviewCount: 131, years: 9,
    languages: ['Português', 'Espanhol'],
    weekdays: [1, 2, 3, 4, 5, 6],
    hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    headline: 'Um espaço sem pressa para falar do que dói e entender de onde vem.',
    bio: 'Atendo pessoas atravessando perdas, términos, tristeza persistente ou aquela sensação de repetir sempre a mesma história. Na psicanálise, você fala livremente e a gente vai percebendo juntos o que se repete. É um processo que respeita o seu tempo.',
    education: ['Psicologia, UFRJ', 'Formação em psicanálise, Escola Brasileira de Psicanálise'],
    reviews: [
      { name: 'Carla F.', stars: 5, when: 'há 3 semanas', text: 'Me ajudou a atravessar o luto da minha mãe. Escuta atenta e sem julgamentos.' },
      { name: 'Pedro A.', stars: 5, when: 'há 2 meses', text: 'Faço há quase um ano. Mudou a forma como me relaciono com as pessoas.' }
    ]
  },
  {
    id: 'aline-moura',
    name: 'Aline Moura',
    gender: 'f',
    crp: '04/52918',
    city: 'Belo Horizonte, MG',
    color: '#8A5A3C',
    approaches: ['sistemica'],
    topics: ['relacionamentos', 'familia'],
    audiences: ['Casais', 'Famílias', 'Adultos'],
    modalities: ['online', 'presencial'],
    price: 230, duration: 80,
    rating: 4.9, reviewCount: 96, years: 14,
    languages: ['Português'],
    weekdays: [2, 3, 4, 6],
    hours: ['09:00', '10:30', '17:00', '18:30', '20:00'],
    headline: 'Terapia de casal e família para voltar a conversar sem virar briga.',
    bio: 'Recebo casais e famílias que querem melhorar a comunicação, atravessar uma crise ou se adaptar a uma fase nova, como a chegada de um filho ou uma separação. As sessões de casal têm 80 minutos para dar tempo de cada um ser ouvido.',
    education: ['Psicologia, PUC Minas', 'Especialização em terapia familiar sistêmica, Instituto Noos'],
    reviews: [
      { name: 'Luana e Diego', stars: 5, when: 'há 1 mês', text: 'A gente estava a um passo de separar. Hoje conseguimos discutir sem gritar.' },
      { name: 'Sérgio P.', stars: 5, when: 'há 3 meses', text: 'Ajudou muito na relação com meu filho adolescente.' }
    ]
  },
  {
    id: 'rafaela-nunes',
    name: 'Rafaela Nunes',
    gender: 'f',
    crp: '08/31044',
    city: 'Curitiba, PR',
    color: '#6B5B95',
    approaches: ['tcc'],
    topics: ['tdah', 'ansiedade', 'carreira'],
    audiences: ['Adolescentes', 'Adultos'],
    modalities: ['online'],
    price: 150, duration: 50,
    rating: 4.7, reviewCount: 78, years: 6,
    languages: ['Português'],
    weekdays: [1, 2, 3, 4, 5],
    hours: ['13:00', '14:00', '15:00', '16:00', '19:00', '20:00', '21:00'],
    headline: 'TDAH em adultos e adolescentes: organização, foco e menos culpa.',
    bio: 'Muita gente chega até mim depois de anos ouvindo que é preguiçosa. Trabalho com estratégias de organização, rotina e regulação emocional para quem tem TDAH ou suspeita ter. Atendo também adolescentes, com encontros periódicos com os responsáveis.',
    education: ['Psicologia, UFPR', 'Especialização em neuropsicologia, Hospital Pequeno Príncipe'],
    reviews: [
      { name: 'Bruno L.', stars: 5, when: 'há 1 semana', text: 'Primeira profissional que entendeu meu jeito de funcionar. Já tenho uma rotina que se sustenta.' },
      { name: 'Fernanda R.', stars: 4, when: 'há 1 mês', text: 'Ótima com meu filho de 15 anos. Ele gosta das sessões, o que já é muita coisa.' }
    ]
  },
  {
    id: 'marcos-vieira',
    name: 'Marcos Vieira',
    gender: 'm',
    crp: '06/172655',
    city: 'Campinas, SP',
    color: '#3E6B48',
    approaches: ['humanista', 'gestalt'],
    topics: ['autoestima', 'lgbt', 'relacionamentos', 'depressao'],
    audiences: ['Adultos', 'Adolescentes'],
    modalities: ['online', 'presencial'],
    price: 140, duration: 50,
    rating: 4.9, reviewCount: 152, years: 8,
    languages: ['Português', 'Libras'],
    weekdays: [1, 3, 5, 6],
    hours: ['08:00', '09:00', '10:00', '17:00', '18:00', '19:00'],
    headline: 'Atendimento afirmativo para pessoas LGBTQIA+ e quem busca se aceitar.',
    bio: 'Sou psicólogo humanista e gestalt-terapeuta. Acredito que você é quem melhor conhece a própria vida, e meu papel é ajudar a enxergar com mais clareza o que você sente e quer. Atendo em português e em Libras.',
    education: ['Psicologia, Unicamp', 'Formação em Gestalt-terapia, Instituto Sedes Sapientiae'],
    reviews: [
      { name: 'Gabriel O.', stars: 5, when: 'há 2 semanas', text: 'Pela primeira vez não precisei explicar quem eu sou antes de falar do que importa.' },
      { name: 'Renata C.', stars: 5, when: 'há 2 meses', text: 'Acolhedor, atento e muito respeitoso.' }
    ]
  },
  {
    id: 'beatriz-coelho',
    name: 'Beatriz Coelho',
    gender: 'f',
    crp: '03/24581',
    city: 'Salvador, BA',
    color: '#A0573F',
    approaches: ['act', 'tcc'],
    topics: ['trauma', 'ansiedade', 'depressao'],
    audiences: ['Adultos'],
    modalities: ['online'],
    price: 180, duration: 50,
    rating: 4.8, reviewCount: 64, years: 10,
    languages: ['Português'],
    weekdays: [1, 2, 4, 5],
    hours: ['08:00', '09:00', '10:00', '11:00', '14:00'],
    headline: 'Trauma e ansiedade, com um ritmo que você consegue acompanhar.',
    bio: 'Atendo pessoas que viveram situações difíceis — violência, acidentes, perdas bruscas — e seguem sentindo o corpo em alerta. Uso ACT e TCC focada em trauma, sempre combinando com você o que vamos abordar e quando.',
    education: ['Psicologia, UFBA', 'Mestrado em psicologia clínica, UFBA', 'Formação em TCC para trauma'],
    reviews: [
      { name: 'Tatiane B.', stars: 5, when: 'há 1 mês', text: 'Respeitou meu tempo em tudo. Hoje consigo falar do que aconteceu sem travar.' }
    ]
  },
  {
    id: 'joao-pedro-lima',
    name: 'João Pedro Lima',
    gender: 'm',
    crp: '09/18836',
    city: 'Goiânia, GO',
    color: '#4B6584',
    approaches: ['tcc'],
    topics: ['burnout', 'carreira', 'ansiedade', 'sono'],
    audiences: ['Adultos'],
    modalities: ['online'],
    price: 120, duration: 50,
    rating: 4.6, reviewCount: 41, years: 4,
    languages: ['Português', 'Inglês'],
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    hours: ['06:30', '07:30', '20:00', '21:00', '22:00'],
    headline: 'Horários bem cedo e à noite, para quem não consegue sair do trabalho.',
    bio: 'Atendo principalmente profissionais com rotina puxada, incluindo fins de semana. Trabalho com TCC para lidar com estresse, perfeccionismo e decisões de carreira.',
    education: ['Psicologia, PUC Goiás', 'Especialização em TCC, CETCC'],
    reviews: [
      { name: 'Larissa V.', stars: 5, when: 'há 3 semanas', text: 'O horário das 6h30 salvou minha vida. Atendimento objetivo e humano.' },
      { name: 'Henrique D.', stars: 4, when: 'há 2 meses', text: 'Bom profissional, me ajudou a sair de um emprego que estava me adoecendo.' }
    ]
  },
  {
    id: 'claudia-reis',
    name: 'Cláudia Reis',
    gender: 'f',
    crp: '06/098214',
    city: 'São Paulo, SP',
    color: '#7A6A3A',
    approaches: ['junguiana', 'psicanalise'],
    topics: ['luto', 'depressao', 'autoestima', 'carreira'],
    audiences: ['Adultos', 'Idosos'],
    modalities: ['presencial', 'online'],
    price: 260, duration: 50,
    rating: 5.0, reviewCount: 57, years: 22,
    languages: ['Português', 'Francês'],
    weekdays: [2, 3, 4],
    hours: ['10:00', '11:00', '15:00', '16:00', '17:00'],
    headline: 'Momentos de virada, meia-idade e perguntas sobre sentido.',
    bio: 'Há mais de vinte anos acompanho pessoas em transições: aposentadoria, filhos saindo de casa, perdas, mudanças de rumo. Trabalho com sonhos, imagens e a história de cada um, num processo profundo e cuidadoso.',
    education: ['Psicologia, PUC-SP', 'Formação analista junguiana, SBPA'],
    reviews: [
      { name: 'Vera L.', stars: 5, when: 'há 1 mês', text: 'Uma escuta rara. Saio de cada sessão entendendo um pouco mais de mim.' }
    ]
  },
  {
    id: 'lucas-ferraz',
    name: 'Lucas Ferraz',
    gender: 'm',
    crp: '07/40127',
    city: 'Porto Alegre, RS',
    color: '#2E5E4E',
    approaches: ['sistemica', 'tcc'],
    topics: ['familia', 'tdah', 'ansiedade'],
    audiences: ['Crianças', 'Adolescentes', 'Famílias'],
    modalities: ['presencial', 'online'],
    price: 170, duration: 50,
    rating: 4.8, reviewCount: 88, years: 12,
    languages: ['Português'],
    weekdays: [1, 2, 3, 4, 5],
    hours: ['08:00', '09:00', '14:00', '15:00', '16:00', '17:00'],
    headline: 'Crianças e adolescentes, com os pais junto no processo.',
    bio: 'Atendo crianças a partir de 6 anos e adolescentes, com orientação regular para os responsáveis. Uso brincadeiras, desenhos e conversas para entender o que a criança ainda não consegue dizer em palavras.',
    education: ['Psicologia, UFRGS', 'Especialização em psicologia infantil, Contemporâneo'],
    reviews: [
      { name: 'Aline G.', stars: 5, when: 'há 2 semanas', text: 'Meu filho pede para ir na terapia. A escola já percebeu a diferença.' },
      { name: 'Roberto N.', stars: 5, when: 'há 1 mês', text: 'As orientações para nós, pais, fazem toda a diferença.' }
    ]
  },
  {
    id: 'priscila-santos',
    name: 'Priscila Santos',
    gender: 'f',
    crp: '02/27760',
    city: 'Recife, PE',
    color: '#5C7A3A',
    approaches: ['humanista', 'act'],
    topics: ['autoestima', 'ansiedade', 'relacionamentos', 'lgbt'],
    audiences: ['Adultos', 'Adolescentes'],
    modalities: ['online'],
    price: 110, duration: 50,
    rating: 4.7, reviewCount: 39, years: 3,
    languages: ['Português'],
    weekdays: [1, 2, 3, 4, 5, 6],
    hours: ['10:00', '11:00', '15:00', '18:00', '19:00', '20:00'],
    headline: 'Primeira terapia? A gente começa pelo que você conseguir contar.',
    bio: 'Muitas das pessoas que atendo nunca fizeram terapia antes. Meu trabalho é criar um espaço seguro para você falar de autoestima, ansiedade e relações, sem pressa e sem fórmula pronta.',
    education: ['Psicologia, UFPE', 'Formação em ACT, Instituto Par'],
    reviews: [
      { name: 'Camila E.', stars: 5, when: 'há 1 semana', text: 'Eu tinha muito medo de começar. Ela deixou tudo leve.' }
    ]
  }
];

FM.faq = [
  {
    q: 'Como sei se o psicólogo é registrado?',
    a: 'Todo profissional da FitMind tem o registro no Conselho Regional de Psicologia (CRP) conferido antes de aparecer na busca. O número fica visível no perfil e você pode consultá-lo no Cadastro Nacional do CFP.'
  },
  {
    q: 'Terapia online funciona tão bem quanto presencial?',
    a: 'Para a maioria das demandas, sim. O Conselho Federal de Psicologia regulamenta o atendimento online, e muitos pacientes preferem pela praticidade. Você só precisa de um lugar reservado e conexão estável.'
  },
  {
    q: 'E se eu não gostar do primeiro psicólogo?',
    a: 'Acontece, e está tudo bem. A relação com o terapeuta é parte do tratamento. Você pode agendar com outro profissional quando quiser, sem multa e sem precisar se justificar.'
  },
  {
    q: 'Posso cancelar ou remarcar?',
    a: 'Sim. Até 24 horas antes do horário, o cancelamento e a remarcação são gratuitos e feitos direto em Minhas consultas.'
  },
  {
    q: 'O que eu falo na sessão fica entre mim e o psicólogo?',
    a: 'Sim. O sigilo é um dever ético previsto no Código de Ética do psicólogo. A FitMind não grava as sessões e não tem acesso ao conteúdo das conversas.'
  }
];
