'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Incorrect password.');
        return;
      }
      window.location.href = '/';
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'24px'}}>
      <section style={{width:'100%',maxWidth:'440px',background:'#fff',border:'1px solid #d9dde5',borderRadius:'18px',padding:'32px',boxShadow:'0 18px 50px rgba(15,23,42,.08)'}}>
        <div className="eyebrow">PRIVATE ACCESS</div>
        <h1 style={{fontSize:'34px',marginBottom:'8px'}}>Target In-Stock Command Center</h1>
        <p style={{marginBottom:'24px'}}>Enter the shared access password to continue.</p>
        <form onSubmit={submit}>
          <label style={{display:'block',fontWeight:700,marginBottom:'8px'}}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            style={{width:'100%',padding:'13px 14px',border:'1px solid #cbd5e1',borderRadius:'10px',fontSize:'16px',marginBottom:'12px'}}
          />
          {error && <div style={{color:'#b91c1c',fontWeight:700,marginBottom:'12px'}}>{error}</div>}
          <button className="primary" type="submit" disabled={busy || !password} style={{width:'100%'}}>
            {busy ? 'Checking…' : 'Enter Dashboard'}
          </button>
        </form>
      </section>
    </main>
  );
}
