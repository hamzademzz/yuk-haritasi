"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Şifreler eşleşmiyor!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { first_name: formData.firstName, last_name: formData.lastName, phone: formData.phone }
      }
    });
    if (error) { setMessage(error.message); setLoading(false); }
    else { setMessage('Kayıt Başarılı! Giriş yapabilirsiniz.'); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
        <Link href="/" className="absolute top-6 left-6 text-gray-500 hover:text-[#1e3a5f] flex items-center gap-1 text-xs font-bold">
          <ArrowLeft size={16} /> Ana Sayfa
        </Link>
        <div className="text-center mt-8 mb-8">
          <h1 className="text-3xl font-black text-[#1e3a5f]">Kayıt Ol</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">Lojistik dünyasına ilk adımınızı atın.</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Ad" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder:text-gray-400" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="Soyad" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder:text-gray-400" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input type="tel" placeholder="Telefon Numarası" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder:text-gray-400" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <input type="email" placeholder="E-posta" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder:text-gray-400" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Şifre" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder:text-gray-400" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <input type="password" placeholder="Şifre Tekrar" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold placeholder:text-gray-400" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          <button disabled={loading} className="w-full py-4 bg-[#f58220] text-white rounded-2xl font-black shadow-lg hover:bg-[#e0721a] transition-all">
            {loading ? 'İşlem Yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>
        {message && <p className="mt-4 text-blue-600 text-center text-xs font-bold">{message}</p>}
        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Zaten üye misiniz? <Link href="/login" className="text-[#1e3a5f] font-black underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}