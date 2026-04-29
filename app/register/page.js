"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      setMessage('Kayıt başarılı! Giriş yapabilirsiniz.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
        <h1 className="text-3xl font-black text-[#1e3a5f] mb-2">Kayıt Ol</h1>
        <p className="text-gray-400 text-sm mb-8 font-medium">Lojistik dünyasına ilk adımınızı atın.</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="email" placeholder="E-posta" required
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Şifre" required
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button disabled={loading} className="w-full py-4 bg-[#f58220] text-white rounded-2xl font-black">
            {loading ? 'Kayıt ediliyor...' : 'Kayıt Ol'}
          </button>
        </form>
        {message && <p className="mt-4 text-blue-600 text-xs font-bold">{message}</p>}
        <p className="mt-6 text-sm text-gray-500">
          Zaten üye misiniz? <Link href="/login" className="text-[#1e3a5f] font-bold underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}