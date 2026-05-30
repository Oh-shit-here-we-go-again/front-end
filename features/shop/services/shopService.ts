import { ShopItem } from "../types/shop.types";

export const shopItemsList: ShopItem[] = [
  {
    id: 1,
    name: "Laxante Turbo sabor Morango",
    emoji: "🍓",
    cost: 150,
    description: "Aumente sua produtividade de ida ao banheiro em 50%. Aprovado pela diretoria (em segredo).",
    type: "Consumível"
  },
  {
    id: 2,
    name: "Incensinho Anti-Odor da Firma",
    emoji: "🕯️",
    cost: 80,
    description: "Esconda o rastro do faturamento. Garante 100% de neutralização de odores na cabine.",
    type: "Utilidade"
  },
  {
    id: 3,
    name: "Papel Higiênico Folha Tripla",
    emoji: "🧻",
    cost: 50,
    description: "O toque suave e confortável da riqueza que você merece depois de faturar no trono.",
    type: "Consumível"
  },
  {
    id: 4,
    name: "Privada Inteligente Pro 9000",
    emoji: "🚽",
    cost: 9999,
    description: "Assento térmico, som de cascata acoplado, descarga eco-friendly e IA de feedback nutricional.",
    type: "Colecionável"
  }
];

export const shopService = {
  getShopItems(): ShopItem[] {
    return shopItemsList;
  },

  async buyItem(itemId: number, userCoins: number): Promise<{ success: boolean; message: string; newCoins: number }> {
    const item = shopItemsList.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: "Item não encontrado.", newCoins: userCoins };
    }

    if (userCoins < item.cost) {
      return {
        success: false,
        message: `ShitCoins insuficientes! Você precisa de mais ${item.cost - userCoins} moedas.`,
        newCoins: userCoins
      };
    }

    return {
      success: true,
      message: `Sucesso! Você comprou: ${item.name}. O item foi enviado para seu e-mail CLT.`,
      newCoins: userCoins - item.cost
    };
  }
};
