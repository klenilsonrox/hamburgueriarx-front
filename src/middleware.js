import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Defina as rotas protegidas
const protectedRoutes = ['/conta', '/pedidos', '/dados-cadastrais', '/admin'];
const loginRoute = '/auth/entrar';

export async function middleware(req) {
  const { nextUrl } = req;
  const token = cookies().get('token')?.value;

  // Se o usuário tentar acessar a página de login e já estiver autenticado
  if (nextUrl.pathname === loginRoute) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/cardapio', req.url));
      } catch (error) {
        console.log("Token inválido ou expirado, permitindo acesso à página de login.");
      }
    }
  }

  console.log(token)

  // Verifique se o token existe e o usuário está tentando acessar uma página protegida
  if (protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/entrar', req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const { payload } = await jwtVerify(token, secret);

      // Verifique se o usuário está tentando acessar uma rota de admin e se ele não é admin
      if (nextUrl.pathname.startsWith('/admin') && !payload.isAdmin) {
        return NextResponse.redirect(new URL('/403', req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Erro ao verificar o token:", error.message);
      return NextResponse.redirect(new URL('/auth/entrar', req.url));
    }
  }

  // Se o token existir e o usuário estiver acessando uma rota de autenticação
  if (token && (nextUrl.pathname.startsWith('/auth'))) {
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL('/cardapio', req.url));
    } catch (error) {
      console.log("Token inválido ou expirado, permitindo acesso à página de login.");
    }
  }

  return NextResponse.next();
}

// Defina em quais caminhos o middleware será aplicado
export const config = {
  matcher: ['/conta/:path*', '/pedidos/:path*', '/dados-cadastrais/:path*', '/admin/:path*', '/auth/entrar', '/auth/esqueci-senha', '/auth/cadastrar', '/auth/:path*'],
};
