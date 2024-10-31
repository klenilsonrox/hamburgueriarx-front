import { cookies } from "next/headers";
import { baseURl } from "../../../../baseUrl";
import { revalidatePath } from "next/cache";


export const POST = async (request) => {
  const { name,whatsapp,cep,rua,numero,bairro,cidade,complemento,referencia } = await request.json();
  const token = cookies().get('token')?.value;


  try {
    const response = await fetch(`${baseURl}/users`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({name,whatsapp,cep,rua,numero,bairro,cidade,complemento,referencia  }),
    });



    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data), {
        status: 403,
      });
    }

    if(response.status===403) {
      return new Response(JSON.stringify(data), {
        status: 403,
      });
    }

    if (response.status===200) {
      cookies().set('token', data.token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true,
        secure: true,
      });
    }

    return new Response(JSON.stringify(data), {  // Corrigido para JSON.stringify
      status: 200,
    });

  
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), {
      status: 500,  // Retornando código de erro adequado
    });
  }
};
