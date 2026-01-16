import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isValidApp, getAppConfig, createCheckoutSession, AppName } from '@/lib/stripe';
import { CheckoutMessage } from './CheckoutMessage';

interface CheckoutPageProps {
  params: Promise<{ app: string }>;
  searchParams: Promise<{ canceled?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { app } = await params;
  const { canceled } = await searchParams;

  // Validate app name
  if (!isValidApp(app)) {
    redirect('/');
  }

  const appConfig = getAppConfig(app);
  if (!appConfig) {
    redirect('/');
  }

  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(`/checkout/${app}`);
    redirect(`/login?redirect=${returnUrl}`);
  }

  // Check if user already has an active subscription for this app
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id, status')
    .eq('user_id', user.id)
    .eq('app', app)
    .single();

  if (existingSubscription?.status === 'active' || existingSubscription?.status === 'trialing') {
    // User already has subscription, redirect to manage page
    redirect(`/manage?app=${app}`);
  }

  // If user canceled, show message with retry option
  if (canceled === 'true') {
    return (
      <CheckoutMessage
        type="canceled"
        appDisplayName={appConfig.displayName}
        retryUrl={`/checkout/${app}`}
      />
    );
  }

  // Create Stripe checkout session and redirect directly to Stripe
  try {
    const session = await createCheckoutSession({
      app: app as AppName,
      userId: user.id,
      userEmail: user.email || '',
      customerId: existingSubscription?.stripe_customer_id,
    });

    if (session.url) {
      redirect(session.url);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return (
      <CheckoutMessage
        type="error"
        appDisplayName={appConfig.displayName}
        retryUrl={`/checkout/${app}`}
      />
    );
  }

  // Fallback - should not reach here
  redirect('/');
}
