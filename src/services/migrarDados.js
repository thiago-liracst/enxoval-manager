// Importando o Firebase (assumindo que você já configurou o Firebase no seu projeto)
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLf1odLX8b9fQEHYKQRT2E7d9B5yIauhk",
  authDomain: "enxoval-manager.firebaseapp.com",
  projectId: "enxoval-manager",
  storageBucket: "enxoval-manager.firebasestorage.app",
  messagingSenderId: "116142058711",
  appId: "1:116142058711:web:59a1dfa387fab29c055492",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dados originais do JSON (já estruturados)
const dadosOriginais = {
  banheiro: [
    {
      nome: "Porta escova",
      descricao: "Suporte para escovas de dente",
      quantidade: 1,
    },
    {
      nome: "Porta papel higiênico",
      descricao: "Suporte para rolo de papel higiênico",
      quantidade: 1,
    },
    {
      nome: "Porta shampoo",
      descricao: "Organizador para produtos de banho",
      quantidade: 1,
    },
    {
      nome: "Lixeira",
      descricao: "Lixeira para banheiro",
      quantidade: 1,
    },
    {
      nome: "Porta sabonete",
      descricao: "Saboneteira para banheiro",
      quantidade: 1,
    },
    {
      nome: "Toalhas de banho",
      descricao: "Toalhas para uso após o banho",
      quantidade: 1,
    },
    {
      nome: "Tapetes",
      descricao: "Tapetes para banheiro",
      quantidade: 1,
    },
    {
      nome: "Espelho",
      descricao: "Espelho para banheiro",
      quantidade: 1,
    },
    {
      nome: "Toalha de piso",
      descricao: "Toalha para secar o piso",
      quantidade: 1,
    },
    {
      nome: "Cesto de roupa",
      descricao: "Cesto para roupas sujas",
      quantidade: 1,
    },
    {
      nome: "Escova sanitária",
      descricao: "Escova para limpeza do vaso sanitário",
      quantidade: 1,
    },
  ],
  lavanderia: [
    {
      nome: "Varal",
      descricao: "Suporte para secagem de roupas",
      quantidade: 1,
    },
    {
      nome: "Rodo",
      descricao: "Utensílio para limpeza de piso",
      quantidade: 1,
    },
    {
      nome: "Vassoura",
      descricao: "Utensílio para varrer",
      quantidade: 1,
    },
    {
      nome: "Pá",
      descricao: "Pá para recolher sujeira",
      quantidade: 1,
    },
    {
      nome: "Baldes",
      descricao: "Recipientes para água",
      quantidade: 1,
    },
    {
      nome: "Bacias",
      descricao: "Recipientes para lavagem",
      quantidade: 1,
    },
    {
      nome: "Pano de chão",
      descricao: "Pano para limpeza de piso",
      quantidade: 1,
    },
    {
      nome: "Prendedores",
      descricao: "Prendedores para roupas no varal",
      quantidade: 1,
    },
    {
      nome: "Flanelas",
      descricao: "Panos para limpeza",
      quantidade: 1,
    },
    {
      nome: "Ferro de passar",
      descricao: "Aparelho para passar roupas",
      quantidade: 1,
    },
    {
      nome: "Mop limpa casa",
      descricao: "Utensílio para limpeza de piso",
      quantidade: 1,
    },
  ],
  cozinha: [
    {
      nome: "Jogo de panelas",
      descricao: "Conjunto de panelas",
      quantidade: 1,
    },
    {
      nome: "Jogo de xícaras",
      descricao: "Conjunto de xícaras",
      quantidade: 1,
    },
    {
      nome: "Jogo de sobremesa",
      descricao: "Conjunto de pratos para sobremesa",
      quantidade: 1,
    },
    {
      nome: "Jogo de copos",
      descricao: "Conjunto de copos",
      quantidade: 1,
    },
    {
      nome: "Jogo de taças",
      descricao: "Conjunto de taças",
      quantidade: 1,
    },
    {
      nome: "Jogo de talheres",
      descricao: "Conjunto de talheres",
      quantidade: 1,
    },
    {
      nome: "Jogo de pratos",
      descricao: "Conjunto de pratos",
      quantidade: 1,
    },
    {
      nome: "Kit faqueiro",
      descricao: "Conjunto de facas",
      quantidade: 1,
    },
    {
      nome: "Kit churrasco",
      descricao: "Utensílios para churrasco",
      quantidade: 1,
    },
    {
      nome: "Kit utilidades",
      descricao: "Conjunto de utensílios diversos",
      quantidade: 1,
    },
    {
      nome: "Kit silicone",
      descricao: "Utensílios de silicone para cozinha",
      quantidade: 1,
    },
    {
      nome: "Colher de pau",
      descricao: "Colher para cozinhar",
      quantidade: 1,
    },
    {
      nome: "Saladeira",
      descricao: "Recipiente para saladas",
      quantidade: 1,
    },
    {
      nome: "Travessas de vidro",
      descricao: "Recipientes de vidro para servir",
      quantidade: 1,
    },
    {
      nome: "Formas de bolo",
      descricao: "Formas para assar bolos",
      quantidade: 1,
    },
    {
      nome: "Pirex",
      descricao: "Recipientes de vidro refratário",
      quantidade: 1,
    },
    {
      nome: "Bandejas de inox",
      descricao: "Bandejas para servir",
      quantidade: 1,
    },
    {
      nome: "Jarras",
      descricao: "Recipientes para líquidos",
      quantidade: 1,
    },
    {
      nome: "Tábua de cortes",
      descricao: "Superfície para cortar alimentos",
      quantidade: 1,
    },
    {
      nome: "Frigideiras",
      descricao: "Panelas rasas para fritar",
      quantidade: 1,
    },
    {
      nome: "Sanduicheira",
      descricao: "Aparelho para preparar sanduíches",
      quantidade: 1,
    },
    {
      nome: "Porta detergente",
      descricao: "Suporte para detergente",
      quantidade: 1,
    },
    {
      nome: "Porta tempero",
      descricao: "Suporte para temperos",
      quantidade: 1,
    },
    {
      nome: "Escorredor louças",
      descricao: "Suporte para secagem de louças",
      quantidade: 1,
    },
    {
      nome: "Vasilhas",
      descricao: "Recipientes para armazenamento",
      quantidade: 1,
    },
    {
      nome: "Liquidificador",
      descricao: "Aparelho para triturar alimentos",
      quantidade: 1,
    },
    {
      nome: "Cafeteira",
      descricao: "Aparelho para preparar café",
      quantidade: 1,
    },
    {
      nome: "Batedeira",
      descricao: "Aparelho para bater massas",
      quantidade: 1,
    },
    {
      nome: "Panela de pressão",
      descricao: "Panela para cozimento rápido",
      quantidade: 1,
    },
    {
      nome: "Espremedor de frutas",
      descricao: "Utensílio para extrair suco",
      quantidade: 1,
    },
    {
      nome: "Bule de café",
      descricao: "Recipiente para servir café",
      quantidade: 1,
    },
    {
      nome: "Garrafa de café",
      descricao: "Garrafa térmica para café",
      quantidade: 1,
    },
    {
      nome: "Saleiro",
      descricao: "Recipiente para sal",
      quantidade: 1,
    },
    {
      nome: "Fruteira de mesa",
      descricao: "Recipiente para frutas",
      quantidade: 1,
    },
    {
      nome: "Toalha de mesa",
      descricao: "Cobertura para mesa",
      quantidade: 1,
    },
    {
      nome: "Suporte papel toalha",
      descricao: "Suporte para papel toalha",
      quantidade: 1,
    },
    {
      nome: "Porta copos",
      descricao: "Suporte para copos",
      quantidade: 1,
    },
    {
      nome: "Porta guardanapos",
      descricao: "Suporte para guardanapos",
      quantidade: 1,
    },
    {
      nome: "Lixeira cozinha",
      descricao: "Lixeira para cozinha",
      quantidade: 1,
    },
    {
      nome: "Kit tesouras",
      descricao: "Conjunto de tesouras",
      quantidade: 1,
    },
    {
      nome: "Rola para massas",
      descricao: "Utensílio para abrir massas",
      quantidade: 1,
    },
    {
      nome: "Kit pano de pratos",
      descricao: "Conjunto de panos para secar louça",
      quantidade: 1,
    },
    {
      nome: "Abridor de latas",
      descricao: "Utensílio para abrir latas",
      quantidade: 1,
    },
    {
      nome: "Mixer triturador",
      descricao: "Aparelho para triturar alimentos",
      quantidade: 1,
    },
    {
      nome: "Processador de alimentos",
      descricao: "Aparelho para processar alimentos",
      quantidade: 1,
    },
    {
      nome: "Kit ralador",
      descricao: "Conjunto de raladores",
      quantidade: 1,
    },
    {
      nome: "Potes herméticos",
      descricao: "Recipientes com vedação",
      quantidade: 1,
    },
    {
      nome: "Copo medidor",
      descricao: "Recipiente para medidas culinárias",
      quantidade: 1,
    },
    {
      nome: "Porta frios",
      descricao: "Recipiente para armazenar frios",
      quantidade: 1,
    },
    {
      nome: "Amassador de batatas",
      descricao: "Utensílio para amassar batatas",
      quantidade: 1,
    },
  ],
  sala: [
    {
      nome: "Manta para sofá",
      descricao: "Cobertura para sofá",
      quantidade: 1,
    },
    {
      nome: "Capa neutra",
      descricao: "Capa protetora neutra",
      quantidade: 1,
    },
    {
      nome: "Almofadas",
      descricao: "Almofadas decorativas",
      quantidade: 1,
    },
    {
      nome: "Capa almofadas",
      descricao: "Capas para almofadas",
      quantidade: 1,
    },
    {
      nome: "Cortina blackout",
      descricao: "Cortina que bloqueia luz",
      quantidade: 1,
    },
    {
      nome: "Cortina lisa",
      descricao: "Cortina de tecido liso",
      quantidade: 1,
    },
    {
      nome: "Quadro decoração",
      descricao: "Quadro para decorar parede",
      quantidade: 1,
    },
    {
      nome: "Planta canto",
      descricao: "Planta para decoração",
      quantidade: 1,
    },
    {
      nome: "Prateleiras",
      descricao: "Suportes para objetos na parede",
      quantidade: 1,
    },
    {
      nome: "Puff",
      descricao: "Assento almofadado",
      quantidade: 1,
    },
    {
      nome: "Frase decoração",
      descricao: "Decoração de parede com frases",
      quantidade: 1,
    },
    {
      nome: "Mesa de centro",
      descricao: "Mesa para centro da sala",
      quantidade: 1,
    },
    {
      nome: "Mesa de canto",
      descricao: "Mesa para canto da sala",
      quantidade: 1,
    },
    {
      nome: "Tapetes",
      descricao: "Tapetes para sala",
      quantidade: 1,
    },
  ],
  quarto: [
    {
      nome: "Jogo de lençóis",
      descricao: "Conjunto de lençóis para cama",
      quantidade: 1,
    },
    {
      nome: "Cobertor de casal",
      descricao: "Cobertor para cama de casal",
      quantidade: 1,
    },
    {
      nome: "Manta casal",
      descricao: "Manta para cama de casal",
      quantidade: 1,
    },
    {
      nome: "Cabides",
      descricao: "Suportes para pendurar roupas",
      quantidade: 1,
    },
    {
      nome: "Organizadores",
      descricao: "Sistemas para organização",
      quantidade: 1,
    },
    {
      nome: "Travesseiros",
      descricao: "Travesseiros para dormir",
      quantidade: 1,
    },
    {
      nome: "Espelho grande",
      descricao: "Espelho de corpo inteiro",
      quantidade: 1,
    },
    {
      nome: "Quadros",
      descricao: "Quadros decorativos",
      quantidade: 1,
    },
    {
      nome: "Abajur",
      descricao: "Luminária para mesa de cabeceira",
      quantidade: 1,
    },
    {
      nome: "Decoração",
      descricao: "Itens decorativos diversos",
      quantidade: 1,
    },
    {
      nome: "Cortina",
      descricao: "Cortina para janela",
      quantidade: 1,
    },
  ],
};

// Função para migrar os dados para o Firebase
async function migrarParaFirebase() {
  try {
    // Mapeamento para armazenar os IDs das áreas criadas
    const areasIds = {};

    // 1. Criar áreas no Firebase
    const areasCollection = collection(db, "areas");

    for (const areaKey of Object.keys(dadosOriginais)) {
      // Criar documento com a estrutura correta
      const areaData = {
        nome: areaKey.charAt(0).toUpperCase() + areaKey.slice(1), // Capitalize o nome da área
        dataCriacao: new Date(),
      };

      // Adicionar área e obter referência
      const areaRef = await addDoc(areasCollection, areaData);
      areasIds[areaKey] = areaRef.id;

      console.log(`Área criada: ${areaKey} com ID: ${areaRef.id}`);
    }

    // 2. Adicionar itens para cada área
    const itemsCollection = collection(db, "items");

    for (const [areaKey, itens] of Object.entries(dadosOriginais)) {
      for (const item of itens) {
        const itemData = {
          area: areasIds[areaKey], // ID da área correspondente
          dataCriacao: new Date(),
          descricao: item.descricao,
          nome: item.nome,
          opcoesCount: 0, // Inicialmente sem opções
          quantidade: item.quantidade,
        };

        // Adicionar item e obter referência
        const itemRef = await addDoc(itemsCollection, itemData);
        console.log(`Item criado: ${item.nome} com ID: ${itemRef.id}`);

        // 3. Criar uma opção padrão para o item
        const opcoesCollection = collection(db, "opcoes");
        const opcaoData = {
          dataAtualizacao: new Date(),
          dataCadastro: new Date(),
          descricao: `Opção padrão para ${item.nome}`,
          itemId: itemRef.id,
          link: "", // Link vazio como padrão
          opcoesCount: 0,
          preco: 0, // Preço zero como padrão
          status: "ativo", // Assumindo que status seja uma string
        };

        await addDoc(opcoesCollection, opcaoData);

        // 4. Atualizar o opcoesCount do item após adicionar a opção
        await setDoc(itemRef, { opcoesCount: 1 }, { merge: true });

        console.log(`Opção criada para: ${item.nome}`);
      }
    }

    console.log("Migração concluída com sucesso!");
  } catch (error) {
    console.error("Erro durante a migração:", error);
  }
}

// Executar a migração
migrarParaFirebase();
