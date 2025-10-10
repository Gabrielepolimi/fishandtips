import { redirect } from 'next/navigation';

export default function OldSpotRedirect() {
  redirect('/categoria/spot-di-pesca', 301);
}
