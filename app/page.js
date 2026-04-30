"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Phone, MapPin, Menu, ChevronRight, 
  Home, PlusCircle, Bell, User, Search, Truck,
  CheckCircle, Zap, ShieldCheck, Headset, QrCode,
  UserPlus, SearchCode, Handshake, Lock, ArrowRight, LogOut, Building2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

const SEHIRLER = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

const ARAC_TIPLERI = ["Tır (Tenteli)", "Tır (Açık)", "Tır (Frigo)", "Kamyon (Onteker)", "Kamyon (Kırkayak)", "Kamyonet", "Panelvan", "Lowbed", "Damperli"];

export default function HomePage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  const [nereden, setNereden] = useState("");
  const [nereye, setNereye] = useState("");
  const [aracTipi, setAracTipi] = useState("");
  const [firmaAdi, setFirmaAdi] = useState("");
  const [aktifTab, setAktifTab] = useState("yuk");

  useEffect(() => {
    const kullaniciyiGetir = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setKullanici(user);
      setYukleniyor(false);
    };
    kullaniciyiGetir();
    const { data: authDinleyici } = supabase.auth.onAuthStateChange((event, session) => {
      setKullanici(session?.user ?? null);
    });
    return () => authDinleyici.subscription.unsubscribe();
  }, []);

  const cikisYap = async () => {
    await supabase.auth.signOut();
    window.location.reload(); 
  };

  const handleBul = () => {
    if (aktifTab === "firma") {
      router.push(`/firma-rehberi?arama=${firmaAdi}&sehir=${nereden}`);
    } else {
      const params = new URLSearchParams({ nereden, nereye, aracTipi });
      router.push(`/yukler?${params.toString()}`);
    }
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
    <div className="w-full min-h-screen bg-white font-sans pb-24 lg:pb-0 text-gray-900">
      
      <datalist id="sehirler">
        {SEHIRLER.map(sehir => <option key={sehir} value={sehir} />)}
      </datalist>
      <datalist id="arac-tipleri">
        {ARAC_TIPLERI.map(tip => <option key={tip} value={tip} />)}
      </datalist>

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 lg:h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-[#1e3a5f]">Yük<span className="text-[#f58220]">Haritası</span></span>
              <span className="text-[10px] font-bold text-gray-400 -mt-1 uppercase tracking-widest">Türkiye'nin Yük Haritası</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-5 text-[13px] font-bold text-gray-600">
              <Link href="/yukler" className="hover:text-[#f58220] transition">Yük İlanları</Link>
              <Link href="#" className="hover:text-[#f58220]">Araç İlanları</Link>
              <Link href="#" className="hover:text-[#f58220]">Firma Rehberi</Link>
              <Link href="#" className="hover:text-[#f58220]">İletişim</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!yukleniyor && (
              <>
                {kullanici ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Hoşgeldin</p>
                      <p className="text-xs font-black text-[#1e3a5f]">
                        {kullanici.user_metadata?.first_name || kullanici.email.split('@')[0]}
                      </p>
                    </div>
                    <button onClick={cikisYap} className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-red-100 rounded-lg text-red-500">
                      <LogOut size={14} /> Çıkış
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login"><button className="px-4 py-2 text-xs font-bold border rounded-lg text-[#1e3a5f]">Giriş Yap</button></Link>
                    <Link href="/register"><button className="px-4 py-2 text-xs font-bold bg-[#f58220] text-white rounded-lg shadow-lg">Üye Ol</button></Link>
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
            <h1 className="text-4xl lg:text-6xl font-black mb-4 leading-tight">Lojistik Dünyası <br/><span className="text-[#f58220]">Tek Platformda</span></h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0">Doğru yük, doğru araç ve güvenilir firmalarla hemen buluşun.</p>
          </div>
          
          <div className="w-full max-w-xl bg-white rounded-3xl p-2 shadow-2xl border border-white/20">
            <div className="flex p-1 bg-gray-50 rounded-2xl mb-2">
              <button onClick={() => setAktifTab("yuk")} className={`flex-1 py-3 text-[11px] font-black rounded-xl transition ${aktifTab === 'yuk' ? 'text-[#f58220] bg-white shadow-sm' : 'text-gray-400'}`}>
                YÜK ARA
              </button>
              <button onClick={() => setAktifTab("arac")} className={`flex-1 py-3 text-[11px] font-black rounded-xl transition ${aktifTab === 'arac' ? 'text-[#f58220] bg-white shadow-sm' : 'text-gray-400'}`}>
                ARAÇ ARA
              </button>
              <button onClick={() => setAktifTab("firma")} className={`flex-1 py-3 text-[11px] font-black rounded-xl transition ${aktifTab === 'firma' ? 'text-[#f58220] bg-white shadow-sm' : 'text-gray-400'}`}>
                FİRMA BUL
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {aktifTab === "firma" ? (
                <>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Firma Adı</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-3.5 text-gray-400" />
                      <input value={firmaAdi} onChange={(e) => setFirmaAdi(e.target.value)} className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none font-bold" placeholder="Firma ismi yazın..." />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Şehir</label>
                      <input list="sehirler" value={nereden} onChange={(e) => setNereden(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none font-bold" placeholder="Şehir Seçin..." />
                    </div>
                    <button onClick={handleBul} className="self-end bg-[#1e3a5f] text-white p-3 px-8 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-black transition shadow-lg shadow-blue-900/10">
                      <Search size={18}/> Bul
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Nereden?</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                      <input list="sehirler" value={nereden} onChange={(e) => setNereden(e.target.value)} className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none font-bold" placeholder="Şehir Seç..." />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Nereye?</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                      <input list="sehirler" value={nereye} onChange={(e) => setNereye(e.target.value)} className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none font-bold" placeholder="Şehir Seç..." />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Araç Tipi</label>
                      <input list="arac-tipleri" value={aracTipi} onChange={(e) => setAracTipi(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none font-bold" placeholder="Seçin..." />
                    </div>
                    <button onClick={handleBul} className="self-end bg-[#1e3a5f] text-white p-3 px-8 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-black transition shadow-lg shadow-blue-900/10">
                      <Search size={18}/> Bul
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="bg-[#162d4a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 border-r border-white/10 last:border-0">
            <User size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">10.000+</p><p className="text-[10px] text-gray-400">Aktif Üye</p></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 border-r border-white/10 last:border-0">
            <ShieldCheck size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">Güvenli</p><p className="text-[10px] text-gray-400">Doğrulanmış Üyeler</p></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 border-r border-white/10 last:border-0">
            <Zap size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">Hızlı Eşleşme</p><p className="text-[10px] text-gray-400">Doğru Yük & Araç</p></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Headset size={20} className="text-[#f58220]"/>
            <div><p className="text-xs font-black">7/24 Destek</p><p className="text-[10px] text-gray-400">Yanınızdayız</p></div>
          </div>
        </div>
      </div>

      {/* GÜNCEL İLANLAR */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-[#1e3a5f]">Güncel Yük İlanları</h2>
          <Link href="/yukler" className="text-[#f58220] font-bold text-sm flex items-center gap-1">Tüm İlanlara Göz At <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ilanlar.map((ilan, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-[#1e3a5f] group-hover:text-[#f58220] transition">{ilan.rota}</span>
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/5 pb-16 text-center md:text-left">
          <div className="col-span-1">
             <div className="text-2xl font-black mb-4 italic">Yük<span className="text-[#f58220]">Haritası</span></div>
             <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">Türkiye'nin lojistik platformu. Doğru yük, doğru araç ve güvenilir hizmetin buluşma noktası.</p>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-[#f58220] mb-6">Hızlı Erişim</h5>
            <div className="flex flex-col gap-3 text-sm text-gray-400 font-medium">
              <Link href="/yukler" className="hover:text-white">Yük İlanları</Link>
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
          <div className="bg-[#1e3a5f] bg-opacity-40 p-6 rounded-2xl border border-white/5">
             <p className="text-xs font-bold mb-4">Araç üzerindeki QR kodu okut, firmayı doğrula!</p>
             <div className="bg-white p-2 w-24 h-24 rounded-xl mx-auto md:mx-0 shadow-lg">
               <QrCode size={80} className="text-[#1e3a5f]" />
             </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-widest pb-8 lg:pb-0">© 2024 YükHaritası. Tüm hakları saklıdır.</p>
      </footer>

      {/* MOBİL ALT NAVİGASYON (GÜNCELLENDİ: FİRMA REHBERİ EKLENDİ) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 h-20 flex justify-between items-center z-[100] lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#1e3a5f] flex-1">
          <Home size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Ana Sayfa</span>
        </Link>
        <Link href="/yukler" className="flex flex-col items-center gap-1 text-gray-400 flex-1">
          <Truck size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">İlanlar</span>
        </Link>
        <div className="relative -mt-12 flex-1 flex justify-center">
          <Link href="/ilan-ver">
            <div className="w-16 h-16 bg-[#f58220] rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-200 border-4 border-white active:scale-90 transition">
              <PlusCircle size={28} />
            </div>
          </Link>
        </div>
        <Link href="#" className="flex flex-col items-center gap-1 text-gray-400 flex-1">
          <Building2 size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Firmalar</span>
        </Link>
        <Link href="/profil" className="flex flex-col items-center gap-1 text-gray-400 flex-1">
          <User size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Profil</span>
        </Link>
      </nav>

    </div>
  );
}