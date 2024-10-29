import { baseURl } from "../../../../../baseUrl";




export const POST = async (request) => {
  const { email} = await request.json();

  try {
    const response = await fetch(`${baseURl}/forgot-password`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email}),
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
