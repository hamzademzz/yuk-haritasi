"use client";
import React, { useEffect, useState } from 'react';
import { 
  User, Building2, Phone, Shield, MapPin, Tag, PlusCircle, 
  Lock, LogOut, ArrowRight, Home, Box, Truck, Edit3, Save, 
  List, CheckCircle, Clock, MessageSquare, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState(null);
  const [profilData, setProfilData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    rol: 'Firma / Yük Sahibi'
  });
  
  const [yukleniyor, setYukleniyor] = useState(true);
  const [islemde, setIslemde] = useState(false);
  const [mesaj, setMesaj] = useState({ tip: '', icerik: '' });
  const [aktifTab, setProfilTab] = useState("genel");

  // Mock data placeholders mirroring your schema definitions
  const [userStats, setUserStats] = useState({ ilanlar: 3, teklifler: 12, onayli: true });
  const [aktifIlanlar, setAktifIlanlar] = useState([
    { id: 1, nereden: "İstanbul", nereye: "Ankara", tur: "Paletli Yük", tarih: "24.05.2026", durum: "Aktif" },
    { id: 2, nereden: "İzmir", nereye: "Bursa", tur: "Kuru Yük", tarih: "22.05.2026", durum: "Beklemede" }
  ]);

  useEffect(() => {
    const profilGetir = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;

      if (!user) {
        router.push('/login');
        return;
      }

      setKullanici(user);

      // Fetch dynamic profile details tied to auth.users.id
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, rol')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfilData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          rol: profile.rol || 'Firma / Yük Sahibi'
        });
      }
      setYukleniyor(false);
    };

    profilGetir();
  }, [router]);

  const handleProfilGuncelle = async (e) => {
    e.preventDefault();
    setIslemde(true);
    setMesaj({ tip: '', icerik: '' });

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profilData.first_name,
        last_name: profilData.last_name,
        phone: profilData.phone,
        rol: profilData.rol
      })
      .eq('id', kullanici.id);

    setIslemde(false);
    if (error) {
      setMesaj({ tip: 'hata', icerik: 'Profil güncellenirken bir hata oluştu: ' + error.message });
    } else {
      setMesaj({ tip: 'basari', icerik: 'Profil bilgileriniz başarıyla kaydedildi!' });
      setTimeout(() => setMesaj({ tip: '', icerik: '' }), 4000);
    }
  };

  const cikisYap = async () => {
    await supabase.auth.signOut();
    router.push('/');
    window.location.reload(); 
  };

  if (yukleniyor) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1e3a5f]/20"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans pb-28 lg:pb-12 text-gray-900 overflow-x-hidden">
      
      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 lg:h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tighter text-[#1e3a5f]">Yük<span className="text-[#f58220]">Haritası</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-gray-600">
              <Link href="/yukler" className="hover:text-[#f58220] transition">Yük İlanları</Link>
              <Link href="/araclar" className="hover:text-[#f58220] transition">Araç İlanları</Link>
              <Link href="/firmalar" className="hover:text-[#f58220] transition">Firma Rehberi</Link>
              <Link href="/ilan-ver" className="flex items-center gap-1.5 text-[#f58220]">
                <PlusCircle size={16}/> İlan Ver
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-black text-gray-500 hover:text-[#1e3a5f] transition hidden sm:block">
              Ana Sayfaya Dön
            </Link>
            <button onClick={cikisYap} className="px-3 py-2 text-xs font-black text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition flex items-center gap-1">
              <LogOut size={14} /> <span className="hidden sm:inline">Güvenli</span> Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* CORE PROFILE CONTENT */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        
        {/* HERO ACCOUNT STRIP */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-white relative shrink-0">
              <User size={28} className="sm:hidden" />
              <User size={32} className="hidden sm:block" />
              {userStats.onayli && (
                <span className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white p-0.5 sm:p-1 rounded-full text-white" title="Doğrulanmış Üye">
                  <CheckCircle size={10} fill="currentColor" className="text-green-500 sm:hidden" />
                  <CheckCircle size={12} fill="currentColor" className="text-green-500 hidden sm:block" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-black text-[#1e3a5f] uppercase tracking-tight truncate">
                {profilData.first_name ? `${profilData.first_name} ${profilData.last_name}` : kullanici.email.split('@')[0]}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 sm:mt-1">
                <span className="bg-orange-50 text-[#f58220] text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md italic">
                  {profilData.rol}
                </span>
                <span className="text-xs text-gray-400 font-medium truncate max-w-[180px] sm:max-w-none">{kullanici.email}</span>
              </div>
            </div>
          </div>

          {/* DASHBOARD STATS COUNTER */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto pt-2 md:pt-0 border-t border-gray-50 md:border-none">
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-100 min-w-[80px]">
              <p className="text-base sm:text-lg font-black text-[#1e3a5f]">{userStats.ilanlar}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">İlanlarım</p>
            </div>
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-100 min-w-[80px]">
              <p className="text-base sm:text-lg font-black text-[#f58220]">{userStats.teklifler}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Teklifler</p>
            </div>
            <div className="bg-green-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-green-100/50 col-span-2 sm:col-span-1 flex flex-col justify-center">
              <p className="text-xs font-black text-green-700 uppercase tracking-tighter">Hesap Durumu</p>
              <p className="text-[9px] text-green-600 font-bold uppercase">Doğrulanmış</p>
            </div>
          </div>
        </div>

        {/* SUB-NAVIGATION CONTROL TABS - PRO TOUCH OPTIMIZED */}
        <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto no-scrollbar scroll-smooth">
          <button 
            onClick={() => setProfilTab("genel")} 
            className={`pb-3 px-3 sm:px-4 text-xs font-black tracking-tight uppercase border-b-2 whitespace-nowrap transition-all ${aktifTab === 'genel' ? 'border-[#f58220] text-[#f58220]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Hesap Bilgileri
          </button>
          <button 
            onClick={() => setProfilTab("ilanlarim")} 
            className={`pb-3 px-3 sm:px-4 text-xs font-black tracking-tight uppercase border-b-2 whitespace-nowrap transition-all ${aktifTab === 'ilanlarim' ? 'border-[#f58220] text-[#f58220]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Aktif İlanlarım ({aktifIlanlar.length})
          </button>
          <button 
            onClick={() => setProfilTab("teklifler")} 
            className={`pb-3 px-3 sm:px-4 text-xs font-black tracking-tight uppercase border-b-2 whitespace-nowrap transition-all ${aktifTab === 'teklifler' ? 'border-[#f58220] text-[#f58220]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Gelen Teklifler
          </button>
        </div>

        {/* STATUS NOTIFICATIONS */}
        {mesaj.icerik && (
          <div className={`p-3.5 rounded-xl mb-4 sm:mb-6 flex items-center gap-3 font-bold text-sm shadow-sm ${mesaj.tip === 'basari' ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-800'}`}>
            {mesaj.tip === 'basari' ? <CheckCircle size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
            <p>{mesaj.icerik}</p>
          </div>
        )}

        {/* PROFILE WINDOW SWITCH ENGINE */}
        <div className="w-full">
          {aktifTab === "genel" && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 max-w-3xl">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base font-black text-[#1e3a5f] uppercase tracking-tight italic">Profil Düzenleme</h3>
                <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-widest">Lojistik ağındaki diğer üyelerin göreceği bilgileri yönetin.</p>
              </div>

              <form onSubmit={handleProfilGuncelle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black italic uppercase text-gray-400 ml-1">Adınız</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-4 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={profilData.first_name} 
                        onChange={(e) => setProfilData({...profilData, first_name: e.target.value})}
                        className="w-full p-3.5 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#f58220] focus:bg-white transition"
                        placeholder="Örn. Ahmet" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black italic uppercase text-gray-400 ml-1">Soyadınız</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-4 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={profilData.last_name} 
                        onChange={(e) => setProfilData({...profilData, last_name: e.target.value})}
                        className="w-full p-3.5 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#f58220] focus:bg-white transition"
                        placeholder="Örn. Yılmaz" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black italic uppercase text-gray-400 ml-1">Telefon Numarası</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-4 text-gray-400" />
                      <input 
                        type="tel" 
                        required
                        value={profilData.phone} 
                        onChange={(e) => setProfilData({...profilData, phone: e.target.value})}
                        className="w-full p-3.5 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#f58220] focus:bg-white transition"
                        placeholder="Örn. 0532 XXX XX XX" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black italic uppercase text-gray-400 ml-1">Platform Rolü</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-4 text-gray-400" />
                      <select 
                        value={profilData.rol} 
                        onChange={(e) => setProfilData({...profilData, rol: e.target.value})}
                        className="w-full p-3.5 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#f58220] focus:bg-white transition appearance-none"
                      >
                        <option value="Firma / Yük Sahibi">Firma / Yük Sahibi (Yük İlanı Verir)</option>
                        <option value="Bireysel Nakliyeci">Bireysel Nakliyeci / Sürücü</option>
                        <option value="Lojistik Şirketi">Lojistik Şirketi (Araç & Filo Sahibi)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 order-2 sm:order-1">
                    <Lock size={14} /> Güvenli Altyapı
                  </div>
                  <button 
                    type="submit" 
                    disabled={islemde}
                    className="w-full sm:w-auto bg-[#1e3a5f] text-white py-3.5 px-8 rounded-xl font-black text-xs uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-black transition shadow-lg disabled:opacity-50 order-1 sm:order-2"
                  >
                    <Save size={16}/> {islemde ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {aktifTab === "ilanlarim" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <div>
                  <h3 className="text-base font-black text-[#1e3a5f] uppercase tracking-tight italic">Yayınladığınız İlanlar</h3>
                  <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-widest">Güncel lojistik taleplerinizin durumunu ve detaylarını izleyin.</p>
                </div>
                <Link href="/ilan-ver" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-[#f58220] text-white px-4 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1 hover:bg-[#e4761a] transition shadow-md">
                    <PlusCircle size={14} /> Yeni İlan Ekle
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aktifIlanlar.map((ilan) => (
                  <div key={ilan.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-black text-[#1e3a5f]">{ilan.nereden} → {ilan.nereye}</span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${ilan.durum === 'Aktif' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {ilan.durum}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-500 mb-4">
                        <div><span className="text-[10px] block text-gray-400 font-normal uppercase">Yük Tipi</span>{ilan.tur}</div>
                        <div><span className="text-[10px] block text-gray-400 font-normal uppercase">Yayın Tarihi</span>{ilan.tarih}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-50">
                      <button className="flex-1 py-2.5 bg-gray-50 text-gray-700 font-black text-[10px] rounded-xl border border-gray-100 hover:bg-gray-100 transition uppercase">Düzenle</button>
                      <button className="flex-1 py-2.5 bg-red-50 text-red-500 font-black text-[10px] rounded-xl border border-red-100 hover:bg-red-100 transition uppercase">Kaldır</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aktifTab === "teklifler" && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-sm border border-gray-100 text-center py-12 max-w-3xl">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#f58220] mx-auto mb-4">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-base font-black text-[#1e3a5f] uppercase tracking-tight italic">Gelen Teklif Kutusu</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto mt-2 font-medium">İlanlarınıza gelen fiyat teklifleri, taşımacı mesajları ve navlun pazarlıkları yakında burada listelenecek.</p>
              <button onClick={() => setProfilTab("ilanlarim")} className="mt-6 text-[#f58220] text-xs font-black uppercase tracking-tight flex items-center gap-1 mx-auto hover:underline">
                İlanlarımı Kontrol Et <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE HUD UNDERLAY FOOTER BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-1 h-20 flex justify-between items-center z-[100] lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 flex-1">
          <Home size={18} />
          <span className="text-[8px] font-black uppercase tracking-tighter italic">Ana Sayfa</span>
        </Link>
        <Link href="/yukler" className="flex flex-col items-center gap-1 text-gray-400 flex-1">
          <Box size={18} />
          <span className="text-[8px] font-black uppercase tracking-tighter italic">Yük Ara</span>
        </Link>
        <div className="relative -mt-10 flex-1 flex justify-center scale-90">
          <Link href="/ilan-ver">
            <div className="w-14 h-14 bg-[#f58220] rounded-full flex flex-col items-center justify-center text-white shadow-xl shadow-orange-200 border-4 border-white active:scale-90 transition">
              <PlusCircle size={20} />
              <span className="text-[7px] font-bold uppercase mt-0.5">İlan Ver</span>
            </div>
          </Link>
        </div>
        <Link href="/araclar" className="flex flex-col items-center gap-1 text-gray-400 flex-1">
          <Truck size={18} />
          <span className="text-[8px] font-black uppercase tracking-tighter italic">Araç Bul</span>
        </Link>
        <Link href="/firmalar" className="flex flex-col items-center gap-1 text-[#1e3a5f] flex-1">
          <Building2 size={18} />
          <span className="text-[8px] font-black uppercase tracking-tighter italic">Firmalar</span>
        </Link>
      </nav>

    </div>
  );
}