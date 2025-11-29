import { redirect } from 'next/navigation';

export default function AllUsersPage() {
  redirect('/users/all/list');
}