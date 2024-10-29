
import { baseURl } from "../../../../baseUrl";

export const GET = async (req) => {
  // Pegando os parâmetros de paginação (page e limit) da requisição (se não tiver, usa os valores padrão)
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;

  try {
    const response = await fetch(`${baseURl}/categories?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), {
      status: 500,
    });
  }
};
