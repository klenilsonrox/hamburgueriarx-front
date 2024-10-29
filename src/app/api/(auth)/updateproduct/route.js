import { cookies } from "next/headers";
import { baseURl } from "../../../../../baseUrl";

export const POST = async (req, { params }) => {
 const requisicao= await req.json();
  const token = await cookies().get('token')?.value;
  const { id } = params; // Obtém o ID do produto a partir dos parâmetros da URL
console.log(requisicao)
  try {
    const response = await fetch(`${baseURl}/products/${id}`, {
      method: 'PUT',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData  // Envia o formData diretamente no corpo
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
