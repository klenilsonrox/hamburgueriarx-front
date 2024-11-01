import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const protectedRoutes = ['/conta', '/pedidos', '/dados-cadastrais', '/admin'];
const authRoutes = ['/auth/entrar', '/auth/cadastrar', '/auth/esqueci-senha', '/auth/resetar-senha'];

export async function middleware(req) {
  const { nextUrl } = req;
  const token = cookies().get('token')?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const payload = await jwtVerify(token, secret);

      // Redireciona para /admin se o usuário for admin
      if (payload.payload.isAdmin && !nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }

      // Redireciona para /cardapio se o usuário tentar acessar uma rota de autenticação
      if (authRoutes.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/cardapio', req.url));
      }

      // Adiciona o payload aos headers de resposta para reutilização
      const response = NextResponse.next();
      response.headers.set('x-auth-payload', Buffer.from(JSON.stringify(payload)).toString('base64'));
      return response;

    } catch (error) {
      console.error("Token inválido ou expirado:", error.message);
      return NextResponse.redirect(new URL('/auth/entrar', req.url));
    }
  }

  // Redireciona para /auth/entrar se a rota for protegida e o token não estiver presente
  if (protectedRoutes.some(route => nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/auth/entrar', req.url));
  }

  return NextResponse.next();
}

// Configuração do matcher para rotas específicas
export const config = {
  matcher: [
    '/conta/:path*', 
    '/pedidos/:path*', 
    '/dados-cadastrais/:path*', 
    '/admin/:path*', 
    '/auth/entrar', 
    '/auth/cadastrar', 
    '/auth/esqueci-senha', 
    '/auth/resetar-senha'
  ],
};
