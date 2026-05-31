// lib/errors.ts
import { ApiError } from "./api";

export function getDramaticErrorMessage(error: any): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400: {
        // Validation errors
        const fields = error.data;
        if (fields && typeof fields === "object" && !Array.isArray(fields)) {
          const firstFieldKey = Object.keys(fields)[0];
          const firstFieldMsg = fields[firstFieldKey];
          const friendlyFieldName = firstFieldKey === "username" ? "Nome do Cagão" : firstFieldKey;
          const msgStr = Array.isArray(firstFieldMsg) ? firstFieldMsg[0] : String(firstFieldMsg);

          if (msgStr.toLowerCase().includes("já existe") || msgStr.toLowerCase().includes("already exists")) {
            return "TEM GENTE!! Bateu na porta sem avisar? Alguém já tá sentado no trono com esse username/e-mail, amigo. Dois CPFs não cagam no mesmo vaso. Inventa outro nome, tipo 'ReiDoBarroso69', e me deixa em paz.";
          }

          return `Me ajuda a te ajudar! Tem erro no campo "${friendlyFieldName}": ${msgStr}.`;
        }
        return "Me ajuda a te ajudar! Você mandou o formulário pela metade. Isso é o equivalente a soltar um peido e perceber que veio com 'brinde'. Um desastre anunciado. Preenche todos os campos antes que essa requisição suje a minha tela!";
      }
      case 401:
        return "Preencheu errado, chefe! Tentar entrar aqui com a senha incorreta é igual tentar segurar diarreia com a força do pensamento: não rola, e o final é sempre humilhante. Concentra aí e digita direito antes que vaze!";
      case 404:
        return "A clássica cagada fantasma! Eu juro que ouvi o barulho da água batendo, senti o clima no ar, mas quando olhei pro banco de dados... cadê o seu username? Sumiu na curva d'água! Você não existe aqui. Vá para a tela de Cadastro e tome forma física!";
      case 409:
        return "TEM GENTE!! Bateu na porta sem avisar? Alguém já tá sentado no trono com esse username/e-mail, amigo. Dois CPFs não cagam no mesmo vaso. Inventa outro nome, tipo 'ReiDoBarroso69', e me deixa em paz.";
      case 500:
        return "DEU MERDA! Literalmente. O encanamento do meu servidor estourou e o backend tá nadando no esgoto. Uma diarreia de dados incontrolável. A culpa é minha, o vaso transbordou e eu não sei nadar.";
      default:
        return error.message || "Tivemos um piriri inexplicável na API. Tente de novo em alguns minutos.";
    }
  }

  return error?.message || "Algo deu muito errado. O papel higiênico acabou e o sistema travou.";
}
