import { redirect } from 'next/navigation';

export default function UserAuditPage() {
  redirect('/security/audit/system');
}
