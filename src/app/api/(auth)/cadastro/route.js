import { cookies } from "next/headers"
import { baseURl } from "../../../../../baseUrl";




export const POST = async (request) => {
  const { email, name, password, whatsapp,cep,rua,numero,bairro,cidade,complemento,referencia } = await request.json();

  try {
    const response = await fetch(`${baseURl}/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password, whatsapp,cep,rua,numero,bairro,cidade,complemento,referencia }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data), {
        status: 400,
      });
    }

    console.log(response)


    if (data.sucess) {
      cookies().set('token', data.dados.token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true,
        secure: true,
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
