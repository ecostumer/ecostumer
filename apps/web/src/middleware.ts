import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()

  // Definir o cookie `path-name` com o caminho atual
  response.cookies.set('path-name', pathname, {
    path: '/', // Certificar que o cookie está disponível em todas as rotas
  })

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')

    response.cookies.set('org', slug, {
      path: '/',
      sameSite: 'lax', // Definir `SameSite` como lax para evitar restrições de envio em certos casos
      secure: process.env.NODE_ENV === 'production', // Tornar o cookie seguro apenas em produção
    })
  } else {
    // Deletar o cookie `org` se o caminho não começar com `/org`
    response.cookies.delete('org')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
