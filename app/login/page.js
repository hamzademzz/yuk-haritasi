"use client";
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { authHatasi } from '../../lib/authHata';
import AuthKart from '../../components/AuthKart';
import { Alan } from '../../components/ui';

export default function LoginPage() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const girisYap = async (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.currentTarget));
    setHata('');
    setYukleniyor(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setHata(authHatasi(error.message));
      setYukleniyor(false);
    } else {
      window.location.assign('/');
    }
  };

  return (
    <AuthKart baslik="Giriş Yap" aciklama="YükHaritası'na tekrar hoş geldiniz.">
      <form onSubmit={girisYap} className="grid gap-4">
        <Alan etiket="E-posta"><input className="input" name="email" type="email" autoComplete="email" required /></Alan>
        <Alan etiket="Şifre"><input className="input" name="password" type="password" autoComplete="current-password" required /></Alan>
        {hata && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{hata}</p>}
        <button disabled={yukleniyor} className="btn btn-navy">{yukleniyor ? 'Giriş yapılıyor…' : 'Giriş Yap'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Hesabınız yok mu? <Link href="/register" className="font-bold text-brand underline">Kayıt Ol</Link>
      </p>
    </AuthKart>
  );
}
