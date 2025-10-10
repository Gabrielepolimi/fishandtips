import { redirect } from 'next/navigation';

export default function OldSlugRedirect() {
  redirect('/articoli/licenza-di-pesca-in-italia-costi-regole-e-come-ottenerla', 301);
}