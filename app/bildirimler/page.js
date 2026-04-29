import React from 'react';
import Link from 'next/link';

export default function BildirimlerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-black text-[#1e3a5f]">Bildirimler</h1>
      <p className="text-gray-500 mt-2">Henüz bir bildiriminiz bulunmuyor.</p>
      <Link href="/" className="mt-6 text-[#f58220] font-bold border-b-2 border-[#f58220]">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}