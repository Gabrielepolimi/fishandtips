/** Valori ammessi per il form del content gate (allineati agli attributi Brevo) */

export const ZONA_PESCA_OPTIONS = ['Mare', 'Lago/Fiume', 'Entrambi'] as const;
export type ZonaPesca = (typeof ZONA_PESCA_OPTIONS)[number];

/** Tecniche selezionabili (multi-scelta). Ordine: più comuni in cima. */
export const TECNICA_OPTIONS = [
  'Spinning',
  'Surfcasting',
  'Bolognese',
  'Beach Ledgering',
  'Feeder',
  'Light Rock Fishing',
  'Shore Jigging',
  'Eging',
  'Jigging',
  'Vertical Jigging',
  'Slow Pitch',
  'Traina',
  'Bolentino',
  'Pesca a Fondo',
  'Carp Fishing',
  'Pesca a Mosca',
  'Trota',
  'Innesco',
  'Altro',
] as const;
export type TecnicaPreferita = (typeof TECNICA_OPTIONS)[number];

export type GateSubscribePayload = {
  email: string;
  nome: string;
  zonaPesca: ZonaPesca;
  tecniche: TecnicaPreferita[];
};

/** Valore salvato su Brevo (attributo TECNICA, testo). */
export function formatTecnicheForBrevo(tecniche: TecnicaPreferita[]): string {
  return [...tecniche].join(', ');
}

export function parseTecnicheInput(raw: unknown): TecnicaPreferita[] | null {
  const list = Array.isArray(raw)
    ? raw
    : typeof raw === 'string' && raw.trim()
      ? [raw.trim()]
      : [];

  if (list.length === 0) return null;

  const normalized: TecnicaPreferita[] = [];
  for (const item of list) {
    if (typeof item !== 'string') return null;
    const trimmed = item.trim();
    if (!TECNICA_OPTIONS.includes(trimmed as TecnicaPreferita)) return null;
    const value = trimmed as TecnicaPreferita;
    if (!normalized.includes(value)) normalized.push(value);
  }

  return normalized.length > 0 ? normalized : null;
}
