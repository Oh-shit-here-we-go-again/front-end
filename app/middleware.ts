// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTES = ['/login', '/register']
const PROTECTED_ROUTES = ['/trono', '/ranking', '/store', '/feed', '/profile', '/family']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  // Se está tentando acessar rota protegida sem token → redireciona p/ login
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // Se está logado e tenta acessar login/register → redireciona p/ trono
  if (isAuthRoute && token) {
    const url = new URL('/trono', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}