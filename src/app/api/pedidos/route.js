import { cookies } from "next/headers";
import { baseURl } from "../../../../baseUrl";



export const GET = async () => {
const token = await cookies().get('token')?.value;

  try {
    const response = await fetch(`${baseURl}/myorders`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`	
      },
    });

    const data = await response.json();


    if (data.error) {
      return new Response(JSON.stringify(data), {
        status: 400,
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
