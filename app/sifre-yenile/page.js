"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useOturum } from '../../lib/hooks';
import AuthKart from '../../components/AuthKart';
import SifreFormu from '../../components/SifreFormu';

// E-postadaki bağlantı açıldığında Supabase geçici bir oturum başlatır
export default function SifreYenile() {
  const { user, hazir } = useOturum();
  const [tamam, setTamam] = useState(false);

  return (
    <AuthKart baslik="Yeni Şifre" aciklama="Hesabınız için yeni bir şifre belirleyin.">
      {!hazir ? <p className="text-center text-sm text-slate-500">Yükleniyor…</p>
        : user ? <SifreFormu onBasari={() => setTamam(true)} />
        : (
          <>
            <p className="mb-4 text-sm text-slate-600">Bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı isteyin.</p>
            <Link href="/sifremi-unuttum" className="btn btn-navy w-full">Yeni Bağlantı İste</Link>
          </>
        )}
      {tamam && <Link href="/profil" className="btn btn-brand mt-3 w-full">Profilime Git</Link>}
    </AuthKart>
  );
}
