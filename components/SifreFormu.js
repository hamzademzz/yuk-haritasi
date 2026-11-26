"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { authHatasi } from '../lib/authHata';
import { Alan } from './ui';

export default function SifreFormu({ onBasari }) {
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState(null);

  const kaydet = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { sifre, tekrar } = Object.fromEntries(new FormData(form));
    if (sifre !== tekrar) return setMesaj({ tip: 'hata', icerik: 'Şifreler eşleşmiyor.' });
    setMesaj(null);
    setKaydediliyor(true);
    const { error } = await supabase.auth.updateUser({ password: sifre });
    setKaydediliyor(false);
    if (error) return setMesaj({ tip: 'hata', icerik: authHatasi(error.message) });
    form.reset();
    setMesaj({ tip: 'basari', icerik: 'Şifreniz güncellendi.' });
    onBasari?.();
  };

  return (
    <form onSubmit={kaydet} className="grid gap-3">
      <Alan etiket="Yeni şifre (en az 6 karakter)"><input className="input" name="sifre" type="password" autoComplete="new-password" minLength={6} required /></Alan>
      <Alan etiket="Yeni şifre tekrar"><input className="input" name="tekrar" type="password" autoComplete="new-password" minLength={6} required /></Alan>
      {mesaj && <p role="alert" className={`rounded-xl p-3 text-sm font-medium ${mesaj.tip === 'hata' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>{mesaj.icerik}</p>}
      <button disabled={kaydediliyor} className="btn btn-navy">{kaydediliyor ? 'Kaydediliyor…' : 'Şifreyi Güncelle'}</button>
    </form>
  );
}
