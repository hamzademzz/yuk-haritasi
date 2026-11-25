"use client";
import { Bell } from 'lucide-react';
import { BosDurum, SayfaBasligi } from '../../components/ui';

export default function Bildirimler() {
  return (
    <>
      <SayfaBasligi baslik="Bildirimler" aciklama="Hesabınızla ilgili gelişmeler" />
      <div className="mx-auto -mt-8 max-w-3xl px-4 lg:-mt-10">
        <BosDurum Ikon={Bell} mesaj="Henüz bildiriminiz yok." />
      </div>
    </>
  );
}
