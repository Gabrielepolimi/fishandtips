import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Redirect 301: articoli con slug che termina con -[13 cifre] → slug senza suffisso numerico (fix 404 Search Console)
  const articoliMatch = url.pathname.match(/^\/articoli\/(.+)-(\d{13})$/);
  if (articoliMatch) {
    const slugWithoutSuffix = articoliMatch[1];
    return NextResponse.redirect(new URL(`/articoli/${slugWithoutSuffix}`, url.origin), 301);
  }

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



