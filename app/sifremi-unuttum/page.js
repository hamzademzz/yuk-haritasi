"use client";
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { authHatasi } from '../../lib/authHata';
import AuthKart from '../../components/AuthKart';
import { Alan } from '../../components/ui';

export default function SifremiUnuttum() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState(null);

  const gonder = async (e) => {
    e.preventDefault();
    const { email } = Object.fromEntries(new FormData(e.currentTarget));
    setMesaj(null);
    setYukleniyor(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/sifre-yenile` });
    setYukleniyor(false);
    setMesaj(error
      ? { tip: 'hata', icerik: authHatasi(error.message) }
      : { tip: 'basari', icerik: 'Bu adrese kayıtlı bir hesap varsa şifre yenileme bağlantısı gönderildi.' });
  };

  return (
    <AuthKart baslik="Şifremi Unuttum" aciklama="E-posta adresinize yenileme bağlantısı gönderelim.">
      <form onSubmit={gonder} className="grid gap-4">
        <Alan etiket="E-posta"><input className="input" name="email" type="email" autoComplete="email" required /></Alan>
        {mesaj && <p role="alert" className={`rounded-xl p-3 text-sm font-medium ${mesaj.tip === 'hata' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>{mesaj.icerik}</p>}
        <button disabled={yukleniyor} className="btn btn-navy">{yukleniyor ? 'Gönderiliyor…' : 'Bağlantı Gönder'}</button>
      </form>
      <p className="mt-6 text-center text-sm"><Link href="/login" className="font-bold text-navy underline">Girişe dön</Link></p>
    </AuthKart>
  );
}
