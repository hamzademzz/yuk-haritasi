"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Phone, MapPin, Menu, ChevronRight, 
  Home, PlusCircle, Bell, User, Search, Truck,
  CheckCircle, Zap, ShieldCheck, Headset, QrCode,
  UserPlus, SearchCode, Handshake, Lock, ArrowRight, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  // KULLANICI KONTROLÜ: Sayfa yüklendiğinde giriş yapmış biri var mı bakıyoruz
  useEffect(() => {
    const kullaniciyiGetir = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setKullanici(user);
      setYukleniyor(false);
    };
    kullaniciyiGetir();

    // Giriş/Çıkış yapıldığında sayfayı otomatik güncelle
    const { data: authDinleyici } = supabase.auth.onAuthStateChange((event, session) => {
      setKullanici(session?.user ?? null);
    });

    return () => authDinleyici.subscription.unsubscribe();
  }, []);

  const cikisYap = async () => {
    await supabase.auth.signOut();
    window.location.reload(); 
  };

  const ilanlar = [
    { rota: "İstanbul → Ankara", yuk: "Parça Yük", arac: "Kamyon", tarih: "25 Mayıs 2024" },
    { rota: "Mersin → İzmir", yuk: "Komple Yük", arac: "Tır / Tenteli", tarih: "24 Mayıs 2024" },
    { rota: "Gaziantep → Bursa", yuk: "Parça Yük", arac: "Kamyon", tarih: "25 Mayıs 2024" },
    { rota: "Konya → Samsun", yuk: "Komple Yük", arac: "Tır / Tenteli", tarih: "26 Mayıs 2024" },
  ];

  const adimlar = [
    { id: 1, baslik: "Üye Ol", tanim: "Ücretsiz üye olun, profilinizi oluşturun.", ikon: <UserPlus size={32} /> },
    { id: 2, baslik: "İlan Bul / Yayınla", tanim: "Yük ilanlarını inceleyin veya kendi ilanınızı yayınlayın.", ikon: <SearchCode size={32} /> },
    { id: 3, baslik: "Anlaş ve Taşı", tanim: "Doğru eşleşmeyi bulun, anlaşın ve taşıma işlemini gerçekleştirin.", ikon: <Handshake size={32} /> },
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans pb-24 lg:pb-0">
      
      {/* ÜST MENÜ (HEADER) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 lg:h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-[#1e3a5f]">Yük<span className="text-[#f58220]">Haritası</span></span>
              <span className="text-[10px] font-bold text-gray-400 -mt-1 uppercase tracking-widest">Türkiye'nin Yük Haritası</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-5 text-[13px] font-bold text-gray-600">
              <Link href="#" className="hover:text-[#f58220] transition">Yük İlanları</Link>
              <Link href="#" className="hover:text-[#f58220]">Araç İlanları</Link>
              <Link href="#" className="hover:text-[#f58220]">Firma Rehberi</Link>
              <Link href="#" className="hover:text-[#f58220]">İletişim</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!yukleniyor && (
              <>
                {kullanici ? (
                  /* GİRİŞ YAPMIŞ KULLANICI GÖRÜNÜMÜ */
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Hoşgeldin</p>
                      <p className="text-xs font-black text-[#1e3a5f]">{kullanici.email.split('@')[0]}</p>
                    </div>
                    <button 
                      onClick={cikisYap}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-red-100 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <LogOut size={14} /> Çıkış
                    </button>
                  </div>
                ) : (
                  /* GİRİŞ YAPMAMIŞ KULLANICI GÖRÜNÜMÜ */
                  <>
                    <Link href="/login">
                      <button className="px-4 py-2 text-xs font-bold border rounded-lg text-[#1e3a5f] hover:bg-gray-50 transition">
                        Giriş Yap
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="px-4 py-2 text-xs font-bold bg-[#f58220] text-white rounded-lg shadow-lg shadow-orange-100 hover:bg-[#e0721a] transition">
                        Üye Ol
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-[#1e3a5f] bg-opacity-[0.98] py-12 lg:py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="text-white text-center lg:text-left flex-1">
            <h1 className="text-4xl lg:text-6xl font-black mb-4 leading-tight">Yükünü Taşıyacak <br/><span className="text-[#f58220]">Doğru Adres</span></h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0">Türkiye'nin dört bir yanındaki taşıyıcılar, yük sahipleri ve lojistik firmaları tek platformda.</p>
          </div>
          
          {/* Arama Paneli */}
          <div className="w-full max-w-xl bg-white rounded-3xl p-2 shadow-2xl">
            <div className="flex p-1">
              <button className="flex-1 py-3 text-sm font-black text-[#f58220] bg-orange-50 rounded-2xl flex items-center justify-center gap-2">
                <Truck size={18}/> Yük Ara
              </button>
              <button className="flex-1 py-3 text-sm font-bold text-gray-400 flex items-center justify-center gap-2">
                <Search size={18}/> Araç Ara
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 ml-1">Nereden?</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"><option>Şehir Seçin</option></select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 ml-1">Nereye?</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"><option>Şehir Seçin</option></select>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 ml-1">Araç Tipi</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"><option>Tümü</option></select>
                </div>
                <button className="self-end bg-[#1e3a5f] text-white p-3 px-8 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition">
                  <Search size={18}/> Bul
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="bg-[#162d4a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 border-r border-white/10 last:border-0">
            <User size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">10.000+</p><p className="text-[10px] text-gray-400">Aktif Üye</p></div>
          </div>
          <div className="flex items-center gap-3 border-r border-white/10 last:border-0">
            <ShieldCheck size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">Güvenli</p><p className="text-[10px] text-gray-400">Doğrulanmış Üyeler</p></div>
          </div>
          <div className="flex items-center gap-3 border-r border-white/10 last:border-0">
            <Zap size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">Hızlı Eşleşme</p><p className="text-[10px] text-gray-400">Doğru Yük & Araç</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Headset size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">7/24 Destek</p><p className="text-[10px] text-gray-400">Yanınızdayız</p></div>
          </div>
        </div>
      </div>

      {/* GÜNCEL İLANLAR */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-[#1e3a5f]">Güncel Yük İlanları</h2>
          <Link href="#" className="text-[#f58220] font-bold text-sm flex items-center gap-1">Tüm İlanlara Göz At <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ilanlar.map((ilan, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-[#1e3a5f]">{ilan.rota}</span>
                <Truck size={16} className="text-gray-300"/>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Yük Tipi</p><p className="text-xs font-bold text-gray-700">{ilan.yuk}</p></div>
                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Araç Tipi</p><p className="text-xs font-bold text-gray-700">{ilan.arac}</p></div>
                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Tarih</p><p className="text-xs font-bold text-gray-700">{ilan.tarih}</p></div>
              </div>
              <button className="w-full py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 border border-dashed border-gray-200">
                <Lock size={12}/> İLETİŞİM İÇİN GİRİŞ YAPIN
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* NASIL ÇALIŞIR? */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-black text-[#1e3a5f] mb-16">Nasıl Çalışır?</h2>
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 grid md:grid-cols-3 gap-8">
              {adimlar.map((adim) => (
                <div key={adim.id} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center text-[#1e3a5f] mb-6 group-hover:scale-110 transition-transform relative">
                    {adim.ikon}
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#f58220] text-white rounded-full flex items-center justify-center font-bold border-4 border-white">{adim.id}</span>
                  </div>
                  <h4 className="text-lg font-black text-[#1e3a5f] mb-2">{adim.baslik}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed px-4">{adim.tanim}</p>
                </div>
              ))}
            </div>
            
            {/* CTA CARD */}
            <div className="bg-[#1e3a5f] rounded-3xl p-8 text-white relative overflow-hidden">
               <h4 className="text-xl font-black mb-4 leading-tight">Tüm İlanlara Erişmek İçin Üye Olun</h4>
               <p className="text-sm text-gray-400 mb-8 leading-relaxed">İletişim bilgilerini görüntüleyin, teklif verin, daha fazla iş fırsatına ulaşın.</p>
               {kullanici ? (
                 <p className="bg-white/10 p-4 rounded-xl text-xs font-bold">Zaten üyesiniz, ilanları incelemeye başlayabilirsiniz!</p>
               ) : (
                <Link href="/register">
                  <button className="w-full py-4 bg-[#f58220] text-white rounded-xl font-black text-sm shadow-xl shadow-orange-900/20 active:scale-95 transition">Ücretsiz Üye Ol</button>
                </Link>
               )}
               <div className="absolute -bottom-10 -right-10 opacity-10">
                 <Truck size={150} />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#12243d] text-white pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/5 pb-16">
          <div className="col-span-1">
             <div className="text-2xl font-black mb-4">Yük<span className="text-[#f58220]">Haritası</span></div>
             <p className="text-sm text-gray-400 leading-relaxed">Türkiye'nin lojistik platformu. Doğru yük, doğru araç ve güvenilir hizmetin buluşma noktası.</p>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-[#f58220] mb-6">Hızlı Erişim</h5>
            <div className="flex flex-col gap-3 text-sm text-gray-400 font-medium">
              <Link href="#" className="hover:text-white">Yük İlanları</Link>
              <Link href="#" className="hover:text-white">Araç İlanları</Link>
              <Link href="#" className="hover:text-white">Firma Rehberi</Link>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-[#f58220] mb-6">Destek</h5>
            <div className="flex flex-col gap-3 text-sm text-gray-400 font-medium">
              <Link href="#" className="hover:text-white">Sıkça Sorulan Sorular</Link>
              <Link href="#" className="hover:text-white">Destek Merkezi</Link>
              <Link href="#" className="hover:text-white">İletişim</Link>
            </div>
          </div>
          <div className="bg-[#1e3a5f] bg-opacity-40 p-6 rounded-2xl">
             <p className="text-xs font-bold mb-4">Araç üzerindeki QR kodu okut, firmayı doğrula!</p>
             <div className="bg-white p-2 w-24 h-24 rounded-xl mx-auto md:mx-0">
               <QrCode size={80} className="text-[#1e3a5f]" />
             </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-widest">© 2024 YükHaritası. Tüm hakları saklıdır.</p>
      </footer>

      {/* MOBİL ALT NAVİGASYON */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 h-20 flex justify-between items-center z-[100] lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#1e3a5f]">
          <Home size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Ana Sayfa</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-gray-400">
          <Truck size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">İlanlar</span>
        </Link>
        <div className="relative -mt-12">
          <Link href="/ilan-ver">
            <div className="w-16 h-16 bg-[#f58220] rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-200 border-4 border-white active:scale-90 transition">
              <PlusCircle size={30} />
            </div>
          </Link>
        </div>
        <Link href="/bildirimler" className="flex flex-col items-center gap-1 text-gray-400">
          <Bell size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Bildirim</span>
        </Link>
        <Link href="/profil" className="flex flex-col items-center gap-1 text-gray-400">
          <User size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Profil</span>
        </Link>
      </nav>

    </div>
  );
}