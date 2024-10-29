import { cookies } from "next/headers";
import { baseURl } from "../../../../baseUrl";

export const GET = async (req) => {
  // Pegar parâmetros de consulta da URL (query parameters)
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 1;  // Página atual (default 1)
  const limit = searchParams.get('limit') || 10;  // Limite de produtos por página (default 10)

  try {
    // Inclui os parâmetros de paginação na URL da requisição
    const response = await fetch(`${baseURl}/products?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data.products), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(data), { // Certifique-se de que a resposta está em JSON
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), {
      status: 500,
    });
  }
};
