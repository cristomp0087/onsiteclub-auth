import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // User is logged in, redirect to dashboard
    redirect(process.env.NEXT_PUBLIC_DASHBOARD_URL || '/');
  }

  // Not logged in, redirect to login
  redirect('/login');
}
