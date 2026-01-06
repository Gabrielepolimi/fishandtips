import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Non indicizzare URL di ricerca (es. /articoli?search=...) per evitare duplicati/URL inutili in GSC.
  if (url.searchParams.has('search')) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex')
    return response
  }

  return NextResponse.next()
}

export const config = {
  // Applica a tutte le pagine; la condizione sopra decide quando intervenire.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


