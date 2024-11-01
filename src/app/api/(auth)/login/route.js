import { cookies } from "next/headers";
import { baseURl } from "../../../../../baseUrl";


export const POST = async (request) => {
  const { email, password} = await request.json();

  try {
    const response = await fetch(`${baseURl}/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

console.log(response)
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


    if (response.status===200) {
      cookies().set('token', data.token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true,
        secure: true,
      });

      return new Response(JSON.stringify(data), {
        status: 200,
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
