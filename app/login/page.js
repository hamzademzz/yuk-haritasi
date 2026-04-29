"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage(error.message); setLoading(false); }
    else { window.location.href = "/"; }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
        <Link href="/" className="absolute top-6 left-6 text-gray-500 hover:text-[#1e3a5f] transition-colors flex items-center gap-1 text-xs font-bold">
          <ArrowLeft size={16} /> Ana Sayfa
        </Link>
        <div className="text-center mt-8 mb-8">
          <h1 className="text-3xl font-black text-[#1e3a5f]">Giriş Yap</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">YükHaritası'na tekrar hoşgeldiniz.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="E-posta Adresiniz" required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-900 font-bold placeholder:text-gray-400 focus:border-[#f58220]"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Şifreniz" required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-900 font-bold placeholder:text-gray-400 focus:border-[#f58220]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button disabled={loading} className="w-full py-4 bg-[#1e3a5f] text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all">
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 text-center text-xs font-bold">{message}</p>}
        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Hesabınız yok mu? <Link href="/register" className="text-[#f58220] font-black underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}