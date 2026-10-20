import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { configured, supabase } from './supabase';
import { Auth, NewPassword } from './Auth';
import Main from './Main';

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    if (!configured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((ev, s) => {
      setSession(s);
      if (ev === 'PASSWORD_RECOVERY') setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  if (!configured)
    return <main><div className="card"><h1>Supabase fehlt</h1><p>Die Werte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY sind nicht gesetzt. Siehe README, Schritt 4.</p></div></main>;
  if (session === undefined) return <p className="center">Lädt …</p>;
  if (recovery) return <NewPassword onDone={() => setRecovery(false)} />;
  return session ? <Main user={session.user} /> : <Auth />;
}
