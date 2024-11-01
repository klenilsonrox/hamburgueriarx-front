import { cookies } from "next/headers";
import { baseURl } from "../../../../baseUrl";


export const POST = async (request) => {
  const { produtos, tipoServico, metodoEntrega } = await request.json();

  try {
    const token = await cookies().get('token')?.value;
    const response = await fetch(`${baseURl}/orders`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({produtos, tipoServico, metodoEntrega }),
    });

    const data = await response.json();
    if (data.error) {
      return new Response(JSON.stringify(data), {
        status: 400,
      });
    }

    if(response.status===400) {
      return new Response(JSON.stringify(data), {
        status: 400,
      });
    }


    return new Response(JSON.stringify(data), {  // Corrigido para JSON.stringify
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), {
      status: 500,  // Retornando código de erro adequado
    });
  }
};
