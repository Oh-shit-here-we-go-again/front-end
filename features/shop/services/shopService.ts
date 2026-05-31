import { apiFetch } from "@/lib/api";
import { ShopItem, Order } from "../types/shop.types";


// Local fallbacks in case the backend DB has no products populated yet
export const localFallbackItems: ShopItem[] = [
  {
    id: 1, // Will be mapped to a standard number/string in component
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

// Helper to assign a fun emoji based on product name if not provided
function getEmojiForProduct(name: string): string {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("laxante") || lowercaseName.includes("morango")) return "🍓";
  if (lowercaseName.includes("incenso") || lowercaseName.includes("odor")) return "🕯️";
  if (lowercaseName.includes("papel") || lowercaseName.includes("higiênico")) return "🧻";
  if (lowercaseName.includes("privada") || lowercaseName.includes("vaso")) return "🚽";
  return "🎁"; // Default emoji
}

export const shopService = {
  async fetchShopItems(): Promise<ShopItem[]> {
    try {
      const data = await apiFetch("/api/store/products/") as any;
      const items = Array.isArray(data) ? data : data?.results || [];
      
      if (items.length === 0) {
        return localFallbackItems;
      }

      return items.map((prod: any) => {
        const name = prod.name || prod.avatar_name || "Mimo Especial";
        return {
          id: prod.id,
          name: name,
          emoji: getEmojiForProduct(name),
          image_url: prod.image_url || prod.avatar_image,
          cost: prod.price_points,
          description: prod.description || "Nenhuma descrição informada pelo fabricante para este avatar especial.",
          type: prod.stock !== undefined ? (prod.stock > 0 ? "Disponível" : "Sem Estoque") : "Disponível",
        };
      });
    } catch (err) {
      console.warn("Falha ao buscar produtos da API. Usando catálogo local:", err);
      return localFallbackItems;
    }
  },

  async buyItem(itemId: string | number, userCoins: number): Promise<{ success: boolean; message: string; newCoins: number }> {
    try {
      // If the itemId is a fallback mock (number), handle locally
      if (typeof itemId === "number" && itemId <= 4) {
        const item = localFallbackItems.find(i => i.id === itemId);
        if (!item) {
          return { success: false, message: "Item não encontrado.", newCoins: userCoins };
        }
        if (userCoins < item.cost) {
          return {
            success: false,
            message: `Cocoins insuficientes! Você precisa de mais ${item.cost - userCoins} moedas.`,
            newCoins: userCoins
          };
        }
        return {
          success: true,
          message: `Sucesso! Você comprou: ${item.name}. O item foi enviado para seu e-mail CLT.`,
          newCoins: userCoins - item.cost
        };
      }

      // Real API purchase
      const response = await apiFetch("/api/store/orders/checkout/", {
        method: "POST",
        body: JSON.stringify({
          items: [
            {
              product_id: itemId,
              quantity: 1
            }
          ]
        })
      }) as any;

      return {
        success: true,
        message: "Sucesso! Sua compra foi confirmada no trono e faturada na API.",
        newCoins: userCoins - (response?.total_points || 0)
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Algo deu errado ao finalizar a compra na API.",
        newCoins: userCoins
      };
    }
  },

  async fetchOrders(): Promise<Order[]> {
    try {
      const data = await apiFetch("/api/store/orders/") as any;
      return Array.isArray(data) ? data : data?.results || [];
    } catch (err) {
      console.error("Falha ao buscar pedidos da API:", err);
      return [];
    }
  }
};

