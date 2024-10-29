import { cookies } from "next/headers";
import { baseURl } from "../../../../../baseUrl";


export const POST = async (request) => {
  const { newPassword,token} = await request.json();

  try {
    const response = await fetch(`${baseURl}/reset-password`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword,token}),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data), {
        status: 400,
      });
    }

    console.log(data)

    cookies().set('token', data.tokenGerado, {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      httpOnly: true,
      secure: true,  
    })

    return new Response(JSON.stringify(data), {  // Corrigido para JSON.stringify
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), {
      status: 500,  // Retornando código de erro adequado
    });
  }
};
