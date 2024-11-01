import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const protectedRoutes = ['/conta', '/pedidos', '/dados-cadastrais', '/admin'];
const loginRoute = '/auth/entrar';

export async function middleware(req) {
  const { nextUrl } = req;
  const token = cookies().get('token')?.value;

  // Tentar verificar o token antes de redirecionar
  let isValidToken = false;
  let payload;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      isValidToken = true;
      payload = verifiedPayload;
    } catch (error) {
      console.log("Erro ao verificar o token:", error.message);
    }
  }

  // Redirecionar usuário autenticado tentando acessar a página de login
  if (nextUrl.pathname === loginRoute && isValidToken) {
    return NextResponse.redirect(new URL('/cardapio', req.url));
  }

  // Redirecionar usuário não autenticado tentando acessar uma rota protegida
  if (protectedRoutes.some(route => nextUrl.pathname.startsWith(route)) && !isValidToken) {
    return NextResponse.redirect(new URL('/auth/entrar', req.url));
  }

  // Verificação de rota admin com usuário sem permissão
  if (nextUrl.pathname.startsWith('/admin') && isValidToken && !payload.isAdmin) {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // Redirecionar usuário autenticado tentando acessar rotas de autenticação
  if (isValidToken && nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/cardapio', req.url));
  }

  return NextResponse.next();
}

// Configurar o matcher
export const config = {
  matcher: [
    '/conta', 
    '/pedidos', 
    '/dados-cadastrais', 
    '/admin', 
    '/auth/entrar', 
    '/auth/esqueci-senha', 
    '/auth/cadastrar'
  ],
};
