const CATEGORIAS = [
  { id: "patinetes", nome: "Patinetes elétricos", tipo: "veiculo", descricao: "Leves, dobráveis e ideais para trajetos curtos." },
  { id: "skates", nome: "Skates e hoverboards", tipo: "veiculo", descricao: "Diversão e agilidade nos deslocamentos diários." },
  { id: "monociclos", nome: "Monociclos elétricos", tipo: "veiculo", descricao: "Autoequilibrados, compactos e potentes." },
  { id: "bicicletas", nome: "Bicicletas elétricas", tipo: "veiculo", descricao: "Pedal assistido, sem acelerador." },
  { id: "scooters", nome: "Scooters de pequeno e médio porte", tipo: "veiculo", descricao: "Conforto e autonomia para o trânsito urbano." },
  { id: "capacetes", nome: "Capacetes e proteção", tipo: "acessorio", descricao: "Segurança recomendada para todos os trajetos." },
  { id: "energia", nome: "Carregadores e baterias", tipo: "acessorio", descricao: "Energia reserva e reposição original." },
  { id: "iluminacao", nome: "Iluminação", tipo: "acessorio", descricao: "Visibilidade noturna dianteira, traseira e lateral." }
];

const PRODUTOS = [
  { id: 1, categoria: "patinetes", nome: "Patinete Urban 350", descricao: "Dobrável em segundos, com display de velocidade e freio eletrônico. Perfeito para o último quilômetro até o trabalho ou a faculdade.", preco: 2490, estoque: 12, imagem: "patinete", specs: { "Potência": "350 W", "Velocidade máxima": "25 km/h", "Autonomia": "25 km", "Peso": "14 kg", "Largura": "46 cm" } },
  { id: 2, categoria: "patinetes", nome: "Patinete Cruise 500", descricao: "Pneus maiores e suspensão dianteira para absorver irregularidades do asfalto de Curitiba, com sinalização noturna integrada.", preco: 3890, estoque: 8, imagem: "patinete", specs: { "Potência": "500 W", "Velocidade máxima": "32 km/h", "Autonomia": "40 km", "Peso": "18 kg", "Largura": "52 cm" } },
  { id: 3, categoria: "skates", nome: "Skate Motorizado Flow", descricao: "Controle remoto sem fio, deck flexível e aceleração progressiva para quem busca leveza e estilo.", preco: 1990, estoque: 6, imagem: "skate", specs: { "Potência": "600 W", "Velocidade máxima": "25 km/h", "Autonomia": "18 km", "Peso": "7 kg", "Largura": "24 cm" } },
  { id: 4, categoria: "skates", nome: "Hoverboard Spin 10", descricao: "Rodas de 10 polegadas, luzes de LED e modo de aprendizado para iniciantes adultos.", preco: 1590, estoque: 9, imagem: "skate", specs: { "Potência": "700 W", "Velocidade máxima": "15 km/h", "Autonomia": "15 km", "Peso": "11 kg", "Largura": "58 cm" } },
  { id: 5, categoria: "monociclos", nome: "Monociclo Orbit 1600", descricao: "Autoequilibrado com alças laterais retráteis, bateria de longa duração e aplicativo de monitoramento.", preco: 4990, estoque: 5, imagem: "monociclo", specs: { "Potência": "1.600 W", "Velocidade máxima": "32 km/h", "Autonomia": "55 km", "Peso": "13 kg", "Largura": "20 cm" } },
  { id: 6, categoria: "bicicletas", nome: "E-bike Dobrável Fold 350", descricao: "Quadro dobrável em alumínio, pedal assistido e bateria removível para carregar dentro de casa.", preco: 5490, estoque: 7, imagem: "bicicleta", specs: { "Potência": "350 W", "Velocidade máxima": "25 km/h", "Autonomia": "50 km", "Peso": "19 kg", "Largura": "60 cm" } },
  { id: 7, categoria: "bicicletas", nome: "E-bike City Pro", descricao: "Câmbio de 7 marchas, para-lamas, bagageiro e farol integrado. Funciona somente com pedal assistido.", preco: 6790, estoque: 4, imagem: "bicicleta", specs: { "Potência": "500 W", "Velocidade máxima": "32 km/h", "Autonomia": "70 km", "Peso": "23 kg", "Largura": "66 cm" } },
  { id: 8, categoria: "scooters", nome: "Scooter Mini 800", descricao: "Compacta e silenciosa, com assento confortável, baú traseiro e limitador eletrônico de velocidade.", preco: 7990, estoque: 3, imagem: "scooter", specs: { "Potência": "800 W", "Velocidade máxima": "32 km/h", "Autonomia": "60 km", "Peso": "48 kg", "Largura": "62 cm" } },
  { id: 9, categoria: "scooters", nome: "Scooter Médio 1000", descricao: "Motor de 1.000 W dentro do limite legal, freios a disco e iluminação completa para uso noturno.", preco: 9890, estoque: 0, imagem: "scooter", specs: { "Potência": "1.000 W", "Velocidade máxima": "32 km/h", "Autonomia": "80 km", "Peso": "62 kg", "Largura": "68 cm" } },
  { id: 10, categoria: "capacetes", nome: "Capacete Urban Pro", descricao: "Casco leve com ventilação, regulagem traseira e refletivos na traseira.", preco: 189, estoque: 30, imagem: "capacete", specs: { "Tamanhos": "M / G", "Peso": "280 g", "Certificação": "Inmetro", "Cor": "Preto e lima" } },
  { id: 11, categoria: "capacetes", nome: "Kit Joelheiras e Cotoveleiras", descricao: "Proteção articulada com fecho de velcro, indicada para iniciantes e uso diário.", preco: 129, estoque: 25, imagem: "capacete", specs: { "Tamanhos": "P / M / G", "Peças": "4", "Material": "Poliéster e EVA", "Cor": "Preto" } },
  { id: 12, categoria: "energia", nome: "Carregador Rápido 48 V", descricao: "Carregador original com proteção contra sobrecarga e indicador de carga por LED.", preco: 349, estoque: 15, imagem: "carregador", specs: { "Tensão": "48 V", "Corrente": "3 A", "Compatibilidade": "Scooters e e-bikes", "Garantia": "6 meses" } },
  { id: 13, categoria: "energia", nome: "Bateria 48 V 13 Ah", descricao: "Bateria de íons de lítio de reposição, com BMS integrado e vedação contra respingos.", preco: 1890, estoque: 6, imagem: "bateria", specs: { "Tensão": "48 V", "Capacidade": "13 Ah", "Peso": "3,2 kg", "Garantia": "12 meses" } },
  { id: 14, categoria: "iluminacao", nome: "Farol LED Recarregável", descricao: "600 lúmens, fixação universal no guidão e carga por USB-C.", preco: 99, estoque: 40, imagem: "luz", specs: { "Brilho": "600 lm", "Carga": "USB-C", "Autonomia": "6 h", "Resistência": "IPX5" } },
  { id: 15, categoria: "iluminacao", nome: "Lanterna Traseira com Freio", descricao: "Acende mais forte ao frear e possui piscas laterais para sinalização noturna.", preco: 79, estoque: 35, imagem: "luz", specs: { "Modos": "4", "Carga": "USB-C", "Autonomia": "10 h", "Resistência": "IPX5" } }
];

const NOVIDADES = [
  { data: "Out/2026", titulo: "Retirada na loja de Curitiba com status em tempo real", texto: "Acompanhe pelo site quando o seu pedido estiver disponível para retirada." },
  { data: "Out/2026", titulo: "Novos patinetes dentro da Resolução CONTRAN 996/2023", texto: "Modelos de até 1.000 W e 32 km/h, sem necessidade de CNH ou emplacamento." },
  { data: "Set/2026", titulo: "Acessórios de segurança agora no mesmo pedido", texto: "Adicione capacete, luzes e carregador ao veículo e retire tudo de uma vez." }
];

const STATUS_PEDIDO = ["Pagamento pendente", "Pagamento aprovado", "Em preparação", "Aguardando retirada", "Retirado"];
