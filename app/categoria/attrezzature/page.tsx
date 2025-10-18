import { redirect } from 'next/navigation';

export default function AttrezzatureRedirect() {
  redirect('/categoria/attrezzature', 301);
}

