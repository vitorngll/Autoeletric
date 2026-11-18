const CATEGORIAS = [
  { id: "patinetes", nome: "Patinetes elétricos", tipo: "veiculo" },
  { id: "skates", nome: "Skates e hoverboards", tipo: "veiculo" },
  { id: "monociclos", nome: "Monociclos elétricos", tipo: "veiculo" },
  { id: "bicicletas", nome: "Bicicletas elétricas", tipo: "veiculo" },
  { id: "scooters", nome: "Scooters", tipo: "veiculo" },
  { id: "capacetes", nome: "Capacetes e proteção", tipo: "acessorio" },
  { id: "energia", nome: "Carregadores e baterias", tipo: "acessorio" },
  { id: "iluminacao", nome: "Iluminação", tipo: "acessorio" }
];

const PRODUTOS = [
  { id: 1, categoria: "patinetes", nome: "Patinete Urban 350", descricao: "Dobrável e ideal para trajetos curtos.", preco: 2490, estoque: 12, imagem: "img/patinete-urban-350.jpg", potencia: "350 W", velocidade: "25 km/h" },
  { id: 2, categoria: "patinetes", nome: "Patinete Cruise 500", descricao: "Pneus maiores e suspensão dianteira.", preco: 3890, estoque: 8, imagem: "img/patinete-cruise-500.jpg", potencia: "500 W", velocidade: "32 km/h" },
  { id: 3, categoria: "skates", nome: "Skate Motorizado Flow", descricao: "Controle sem fio e deck flexível.", preco: 1990, estoque: 6, imagem: "img/skate-flow.jpg", potencia: "600 W", velocidade: "25 km/h" },
  { id: 4, categoria: "skates", nome: "Hoverboard Spin 10", descricao: "Rodas de 10 polegadas e luzes de LED.", preco: 1590, estoque: 9, imagem: "img/hoverboard-spin-10.jpg", potencia: "700 W", velocidade: "15 km/h" },
  { id: 5, categoria: "monociclos", nome: "Monociclo Orbit 1600", descricao: "Autoequilibrado com bateria de longa duração.", preco: 4990, estoque: 5, imagem: "img/monociclo-orbit-1600.jpg", potencia: "1.600 W", velocidade: "32 km/h" },
  { id: 6, categoria: "bicicletas", nome: "E-bike Dobrável Fold 350", descricao: "Quadro em alumínio e pedal assistido.", preco: 5490, estoque: 7, imagem: "img/ebike-fold-350.jpg", potencia: "350 W", velocidade: "25 km/h" },
  { id: 7, categoria: "bicicletas", nome: "E-bike City Pro", descricao: "Câmbio de 7 marchas e farol integrado.", preco: 6790, estoque: 4, imagem: "img/ebike-city-pro.jpg", potencia: "500 W", velocidade: "32 km/h" },
  { id: 8, categoria: "scooters", nome: "Scooter Mini 800", descricao: "Compacta, silenciosa e com baú traseiro.", preco: 7990, estoque: 3, imagem: "img/scooter-mini-800.jpg", potencia: "800 W", velocidade: "32 km/h" },
  { id: 9, categoria: "scooters", nome: "Scooter Médio 1000", descricao: "Freios a disco e iluminação completa.", preco: 9890, estoque: 0, imagem: "img/scooter-medio-1000.jpg", potencia: "1.000 W", velocidade: "32 km/h" },
  { id: 10, categoria: "capacetes", nome: "Capacete Urban Pro", descricao: "Casco leve com ventilação e refletivos.", preco: 189, estoque: 30, imagem: "img/capacete.svg", potencia: "-", velocidade: "-" },
  { id: 11, categoria: "capacetes", nome: "Kit Joelheiras e Cotoveleiras", descricao: "Proteção articulada para uso diário.", preco: 129, estoque: 25, imagem: "img/capacete.svg", potencia: "-", velocidade: "-" },
  { id: 12, categoria: "energia", nome: "Carregador Rápido 48 V", descricao: "Proteção contra sobrecarga com LED.", preco: 349, estoque: 15, imagem: "img/carregador.svg", potencia: "48 V", velocidade: "-" },
  { id: 13, categoria: "energia", nome: "Bateria 48 V 13 Ah", descricao: "Íons de lítio de reposição.", preco: 1890, estoque: 6, imagem: "img/bateria.svg", potencia: "48 V", velocidade: "-" },
  { id: 14, categoria: "iluminacao", nome: "Farol LED Recarregável", descricao: "600 lúmens com carga via USB-C.", preco: 99, estoque: 40, imagem: "img/luz.svg", potencia: "-", velocidade: "-" },
  { id: 15, categoria: "iluminacao", nome: "Lanterna Traseira com Freio", descricao: "Piscas laterais para sinalização noturna.", preco: 79, estoque: 35, imagem: "img/luz.svg", potencia: "-", velocidade: "-" }
];