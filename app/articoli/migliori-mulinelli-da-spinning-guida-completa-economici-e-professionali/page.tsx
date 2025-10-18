import { redirect } from 'next/navigation';

export default function OldMulinelliRedirect() {
  redirect('/articoli/mulinelli-spinning', 301);
}

