"use client";
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { authHatasi } from '../../lib/authHata';
import AuthKart from '../../components/AuthKart';
import { Alan } from '../../components/ui';

export default function RegisterPage() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState({ tip: '', icerik: '' });

  const kayitOl = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (f.password !== f.confirmPassword) {
      setMesaj({ tip: 'hata', icerik: 'Şifreler eşleşmiyor.' });
      return;
    }
    setMesaj({ tip: '', icerik: '' });
    setYukleniyor(true);
    const { data, error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: { data: { first_name: f.firstName, last_name: f.lastName, phone: f.phone } },
    });
    if (error) {
      setMesaj({ tip: 'hata', icerik: authHatasi(error.message) });
    } else if (data.session) {
      // E-posta onayı kapalıysa kullanıcı doğrudan giriş yapmış olur
      window.location.assign('/');
      return;
    } else {
      setMesaj({ tip: 'basari', icerik: 'Kaydınız alındı. E-postanıza gelen onay bağlantısına tıkladıktan sonra giriş yapabilirsiniz.' });
    }
    setYukleniyor(false);
  };

  return (
    <AuthKart baslik="Kayıt Ol" aciklama="Lojistik dünyasına ilk adımınızı atın.">
      <form onSubmit={kayitOl} className="grid grid-cols-2 gap-3">
        <Alan etiket="Ad"><input className="input" name="firstName" autoComplete="given-name" required /></Alan>
        <Alan etiket="Soyad"><input className="input" name="lastName" autoComplete="family-name" required /></Alan>
        <Alan etiket="Telefon" className="col-span-2"><input className="input" name="phone" type="tel" autoComplete="tel" required placeholder="05XX XXX XX XX" /></Alan>
        <Alan etiket="E-posta" className="col-span-2"><input className="input" name="email" type="email" autoComplete="email" required /></Alan>
        <Alan etiket="Şifre (en az 6 karakter)" className="col-span-2"><input className="input" name="password" type="password" autoComplete="new-password" minLength={6} required /></Alan>
        <Alan etiket="Şifre Tekrar" className="col-span-2"><input className="input" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required /></Alan>
        {mesaj.icerik && <p role="alert" className={`col-span-2 rounded-xl p-3 text-sm font-medium ${mesaj.tip === 'hata' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>{mesaj.icerik}</p>}
        <button disabled={yukleniyor} className="btn btn-brand col-span-2">{yukleniyor ? 'İşlem yapılıyor…' : 'Kayıt Ol'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Zaten üye misiniz? <Link href="/login" className="font-bold text-navy underline">Giriş Yap</Link>
      </p>
    </AuthKart>
  );
}
