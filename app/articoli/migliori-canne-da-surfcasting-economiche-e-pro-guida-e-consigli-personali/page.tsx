import { redirect } from 'next/navigation';

export default function RedirectPage() {
  redirect('/articoli/migliori-canne-da-surfcasting', 301);
}


