"use client";
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, ArrowLeft, Search, MapPin, Phone, MessageSquare, 
  Mail, Star, CheckCircle2, QrCode, ArrowRight, Grid, PlusCircle,
  FileText, Image as ImageIcon, MessageCircle, Truck, Package, 
  Warehouse, Anchor, Construction, X, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

// Complete list of Turkey's 81 provinces for the dropdown array
const TURKIYE_SEHIRLERI = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

function FirmalarRehberi() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlArama = searchParams.get('arama') || '';
  const urlSehir = searchParams.get('sehir') || searchParams.get('merkez_konum') || '';

  const [aramaInput, setAramaInput] = useState(urlArama);
  const [sehirInput, setSehirInput] = useState(urlSehir);
  
  const [firmalar, setFirmalar] = useState([]);
  const [seciliFirma, setSeciliFirma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aktifTab, setAktifTab] = useState('profil');
  const [session, setSession] = useState(null);

  // Expansion and Dynamic Toggles
  const [hakkimizdaUzun, setHakkimizdaUzun] = useState(false);
  const [sehirleriGoster, setSehirleriGoster] = useState(false);
  const [firmaEkleModal, setFirmaEkleModal] = useState(false);
  const [sehirDropdownAcik, setSehirDropdownAcik] = useState(false);

  // Form State
  const [yeniFirma, setYeniFirma] = useState({
    firma_adi: '',
    hakkimizda: '',
    telefon: '',
    whatsapp: '',
    eposta: '',
    merkez_konum: '',
    hizmet_bolgeleri: [], // Dynamic array for selections
    logo_url: '',
    uye_no: '',
    puan: '4.8',
    yorum_sayisi: '0',
    is_active: true,
    // Service categories mapped directly as database columns
    sehirlerarasi_nakliye: false,
    parsiyel_tasima: false,
    komple_tasima: false,
    depolama_hizmeti: false,
    forklift_hizmeti: false,
    vinc_hizmeti: false
  });

  // Track authenticated session state dynamically
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setAramaInput(urlArama);
    setSehirInput(urlSehir);
  }, [urlArama, urlSehir]);

  const fetchFirmalar = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('firmalar').select('*').eq('is_active', true);
      
      if (urlArama) {
        query = query.ilike('firma_adi', `%${urlArama}%`);
      }
      if (urlSehir) {
        query = query.ilike('merkez_konum', `%${urlSehir}%`);
      }

      let { data, error } = await query.order('firma_adi', { ascending: true });
      
      if (!error && data) {
        setFirmalar(data);
        const urlId = searchParams.get('id');
        if (urlId) {
          const matching = data.find(f => f.id.toString() === urlId);
          if (matching) setSeciliFirma(matching);
        }
      }
    } catch (err) {
      console.error("Veri yukleme hatasi:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, urlArama, urlSehir]);

  useEffect(() => {
    fetchFirmalar();
  }, [fetchFirmalar]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (aramaInput) params.set('arama', aramaInput);
    if (sehirInput) params.set('sehir', sehirInput);
    setSeciliFirma(null);
    router.push(`/firmalar?${params.toString()}`);
  };

  const openFirmaDetay = (firma) => {
    setSeciliFirma(firma);
    setAktifTab('profil');
    setHakkimizdaUzun(false);
    setSehirleriGoster(false);
    const params = new URLSearchParams(window.location.search);
    params.set('id', firma.id);
    router.push(`/firmalar?${params.toString()}`, { scroll: false });
  };

  const closeFirmaDetay = () => {
    setSeciliFirma(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('id');
    router.push(`/firmalar?${params.toString()}`, { scroll: false });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setYeniFirma(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleSehirSecim = (sehirAdi) => {
    setYeniFirma(prev => {
      const mevcutSehirler = [...prev.hizmet_bolgeleri];
      if (mevcutSehirler.includes(sehirAdi)) {
        return { ...prev, hizmet_bolgeleri: mevcutSehirler.filter(s => s !== sehirAdi) };
      } else {
        return { ...prev, hizmet_bolgeleri: [...mevcutSehirler, sehirAdi] };
      }
    });
  };

  const handleFirmaKaydet = async (e) => {
    e.preventDefault();
    try {
      const generatedUyeNo = "YH-" + Math.floor(1000000 + Math.random() * 9000000);
      const finalHizmetBolgeleri = yeniFirma.hizmet_bolgeleri.join(', ');

      const insertData = { 
        ...yeniFirma, 
        uye_no: generatedUyeNo,
        hizmet_bolgeleri: finalHizmetBolgeleri 
      };

      const { error } = await supabase.from('firmalar').insert([insertData]);
      if (!error) {
        setFirmaEkleModal(false);
        setYeniFirma({
          firma_adi: '', hakkimizda: '', telefon: '', whatsapp: '',
          eposta: '', merkez_konum: '', hizmet_bolgeleri: [], logo_url: '',
          uye_no: '', puan: '4.8', yorum_sayisi: '0', is_active: true,
          sehirlerarasi_nakliye: false, parsiyel_tasima: false, komple_tasima: false,
          depolama_hizmeti: false, forklift_hizmeti: false, vinc_hizmeti: false
        });
        fetchFirmalar();
      } else {
        alert("Kayıt sırasında bir sorun oluştu: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hizmetTipleri = [
    { ad: "Şehirlerarası Nakliye", ikon: <Truck size={24} /> },
    { ad: "Parsiyel Taşıma", ikon: <Package size={24} /> },
    { ad: "Komple Taşıma", ikon: <Truck size={24} /> },
    { ad: "Depolama Hizmeti", ikon: <Warehouse size={24} /> },
    { ad: "Forklift Hizmeti", ikon: <Construction size={24} /> },
    { ad: "Vinç Hizmeti", ikon: <Anchor size={24} /> },
  ];

  if (seciliFirma) {
    const bolgeler = typeof seciliFirma.hizmet_bolgeleri === 'string' 
      ? seciliFirma.hizmet_bolgeleri.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const gorunurSehirler = sehirleriGoster ? bolgeler : bolgeler.slice(0, 4);

    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '4rem' }}>
        
        {/* ÜST BANNER REHBER DÖNÜŞ PANELİ */}
        <div style={{ backgroundColor: '#1e3a5f', padding: '1rem', display: 'flex', alignItems: 'center' }}>
          <button onClick={closeFirmaDetay} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> REHBERE DÖN
          </button>
        </div>

        {/* ANA KART BANNER GÖVDESİ */}
        <div style={{ position: 'relative', minHeight: '200px', background: 'linear-gradient(rgba(30, 58, 95, 0.7), rgba(30, 58, 95, 0.95)), url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: '1rem', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', flexShrink: 0 }}>
              <img src={seciliFirma.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300"} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ color: '#ffffff', flex: '1', minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0, tracking: '-0.02em', lineHeight: '1.2' }}>{seciliFirma.firma_adi}</h1>
                <span style={{ backgroundColor: '#22c55e', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} fill="white" stroke="#22c55e" /> Doğrulanmış Üye
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#cbd5e1', fontWeight: '500' }}>Şehirlerarası Nakliye & Lojistik Hizmetleri</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={14} fill="#fbbf24" /> {seciliFirma.puan || "4.8"} ({seciliFirma.yorum_sayisi || "0"})</span>
                <span style={{ color: '#64748b' }}>•</span>
                <span style={{ color: '#cbd5e1' }}>Güvenilir Lojistik Ortağı</span>
              </div>
            </div>
          </div>
        </div>

        {/* SWIPE EDİLEBİLİR SEKMELER ÇUBUĞU */}
        <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
          <div className="no-scrollbar" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', overflowX: 'auto', padding: '0 1rem', WebkitOverflowScrolling: 'touch' }}>
            {[
              { id: 'profil', etiket: 'Profil', ikon: <Grid size={16} /> },
              { id: 'hizmetler', etiket: 'Hizmetler', ikon: <Truck size={16} /> },
              { id: 'ilanlar', etiket: 'İlanlar (8)', ikon: <FileText size={16} /> },
              { id: 'galeri', etiket: 'Galeri', ikon: <ImageIcon size={16} /> },
              { id: 'yorumlar', etiket: `Yorumlar (${seciliFirma.yorum_sayisi || '0'})`, ikon: <MessageSquare size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAktifTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '1rem 1.25rem', border: 'none', background: 'none', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
                  color: aktifTab === tab.id ? '#1e3a5f' : '#64748b',
                  borderBottom: aktifTab === tab.id ? '3px solid #1e3a5f' : '3px solid transparent'
                }}
              >
                {tab.ikon} {tab.etiket}
              </button>
            ))}
          </div>
        </div>

        {/* PROFiL DETAY PANEL ALANI */}
        <div style={{ maxWidth: '1000px', margin: '1.5rem auto 0', padding: '0 1rem' }}>
          {aktifTab === 'profil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                
                {/* HAKKIMIZDA */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 0.75rem 0' }}>Hakkımızda</h3>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {seciliFirma.hakkimizda && seciliFirma.hakkimizda.length > 160 && !hakkimizdaUzun
                      ? `${seciliFirma.hakkimizda.substring(0, 160)}...`
                      : seciliFirma.hakkimizda || "Firma hakkında detaylı bilgi girilmemiştir."}
                  </p>
                  {seciliFirma.hakkimizda && seciliFirma.hakkimizda.length > 160 && (
                    <button 
                      onClick={() => setHakkimizdaUzun(!hakkimizdaUzun)}
                      style={{ background: 'none', border: 'none', color: '#f58220', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.75rem', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {hakkimizdaUzun ? <>Kapat <ChevronUp size={14} /></> : <>Devamını Gör <ChevronDown size={14} /></>}
                    </button>
                  )}
                </div>

                {/* İLETİŞİM PANELİ */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1rem 0' }}>İletişim Bilgileri</h3>
                  
                  {session ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <a href={`tel:${seciliFirma.telefon}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ color: '#1e3a5f' }}><Phone size={18} /></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.telefon || "Belirtilmedi"}</span>
                      </a>
                      {seciliFirma.whatsapp && (
                        <a href={`https://wa.me/${seciliFirma.whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
                          <div style={{ color: '#22c55e' }}><MessageCircle size={18} fill="#22c55e" stroke="white" /></div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.whatsapp}</span>
                        </a>
                      )}
                      {seciliFirma.eposta && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ color: '#64748b' }}><Mail size={18} /></div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.eposta}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ color: '#ef4444' }}><MapPin size={18} /></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.merkez_konum || "Belirtilmedi"}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '1.25rem', borderRadius: '0.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <Lock size={28} style={{ color: '#64748b' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', fontWeight: 'bold', lineHeight: '1.4' }}>
                        Telefon numaralarını ve e-posta adreslerini görebilmek için üye girişi yapmanız gerekmektedir.
                      </p>
                      <Link href="/login" style={{ backgroundColor: '#1e3a5f', color: '#ffffff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', display: 'inline-block' }}>
                        Giriş Yap / Üye Ol
                      </Link>
                    </div>
                  )}
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                
                {/* HİZMET BÖLGELERİ */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1rem 0' }}>Hizmet Bölgeleri</h3>
                  <div style={{ width: '100%', height: '140px', backgroundColor: '#f8fafc', borderRadius: '0.75rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                    <img 
                      src="https://vemaps.com/uploads/img/tr-03.png" 
                      alt="Harita" 
                      style={{ width: '95%', height: '95%', objectFit: 'contain', filter: 'invert(29%) sepia(87%) saturate(2235%) hue-rotate(212deg) brightness(96%) contrast(97%)' }} 
                    />
                    <span style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: '#ffffff', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '900', color: '#1e3a5f', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={12} style={{ color: '#3b82f6' }} /> Türkiye Geneli
                    </span>
                  </div>
                  
                  {bolgeler.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {gorunurSehirler.map((sehir, idx) => (
                        <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.35rem 0.65rem', borderRadius: '0.5rem' }}>{sehir}</span>
                      ))}
                      {bolgeler.length > 4 && (
                        <button 
                          onClick={() => setSehirleriGoster(!sehirleriGoster)}
                          style={{ border: 'none', background: 'none', fontSize: '0.75rem', color: '#f58220', fontWeight: '900', padding: '0.35rem 0.5rem', cursor: 'pointer' }}
                        >
                          {sehirleriGoster ? "Daha Az Göster" : `+ ${bolgeler.length - 4} şehir daha`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>Tüm Türkiye</span>
                  )}
                </div>

                {/* DOĞRULAMA KARTI */}
                <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 0.75rem 0' }}>Doğrulama Bilgileri</h3>
                      <p style={{ margin: '0 0 0.15rem 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>Üyelik Kodu</p>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.uye_no || "YH-YUKLE"}</p>
                      
                      <p style={{ margin: '0 0 0.15rem 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>Sistem Durumu</p>
                      <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: '900', display: 'inline-block' }}>
                        Belgeler Onaylandı
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '0.75rem', backgroundColor: '#fafafa', border: '1px solid #e2e8f0' }}>
                    <QrCode size={75} strokeWidth={1.5} />
                  </div>
                </div>

              </div>

              {/* HİZMETLERİMİZ */}
              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1rem 0' }}>Hizmetlerimiz</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { key: 'sehirlerarasi_nakliye', ad: "Şehirlerarası Nakliye", ikon: <Truck size={24} /> },
                    { key: 'parsiyel_tasima', ad: "Parsiyel Taşıma", ikon: <Package size={24} /> },
                    { key: 'komple_tasima', ad: "Komple Taşıma", ikon: <Truck size={24} /> },
                    { key: 'depolama_hizmeti', ad: "Depolama Hizmeti", ikon: <Warehouse size={24} /> },
                    { key: 'forklift_hizmeti', ad: "Forklift Hizmeti", ikon: <Construction size={24} /> },
                    { key: 'vinc_hizmeti', ad: "Vinç Hizmeti", ikon: <Anchor size={24} /> },
                  ].map((item, idx) => {
                    const aktif = !!seciliFirma[item.key];
                    return (
                      <div key={idx} style={{ border: '1px solid #f1f5f9', backgroundColor: aktif ? '#eff6ff' : '#f8fafc', opacity: aktif ? 1 : 0.45, padding: '1rem 0.5rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ color: aktif ? '#2563eb' : '#64748b' }}>{item.ikon}</div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: aktif ? '#1e3a5f' : '#64748b', textAlign: 'center' }}>{item.ad}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {aktifTab !== 'profil' && (
            <div style={{ backgroundColor: '#ffffff', padding: '3rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={32} style={{ color: '#cbd5e1' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#64748b' }}>Bu modül yakında aktif edilecektir.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ANA LİSTE GÖRÜNÜMÜ
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <div style={{ backgroundColor: '#1e3a5f', paddingTop: '2.5rem', paddingBottom: '5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <ArrowLeft size={14}/> ANA SAYFA
            </Link>
            <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>
              LOJİSTİK FİRMA REHBERİ
            </h1>
            <p style={{ color: '#f58220', fontWeight: 'bold', marginTop: '0.25rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              DOĞRULANMIŞ GÜVENİLİR FİRMALAR
            </p>
          </div>

          <button 
            onClick={() => setFirmaEkleModal(true)}
            style={{ backgroundColor: '#f58220', color: '#ffffff', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 10px rgba(245,130,32,0.3)' }}
          >
            <PlusCircle size={16} /> FİRMA EKLE
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-2.5rem auto 0', padding: '0 1rem 4rem' }}>
        
        {/* ARAMA FORMU */}
        <form onSubmit={handleSearch} style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.75rem', boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.08)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input 
              style={{ width: '100%', padding: '0.85rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#000000', fontWeight: 'bold', fontSize: '0.85rem', outline: 'none' }}
              type="text" placeholder="Firma Adı ile Ara..." value={aramaInput} onChange={(e) => setAramaInput(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <input 
              style={{ width: '100%', padding: '0.85rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#000000', fontWeight: 'bold', fontSize: '0.85rem', outline: 'none' }}
              type="text" placeholder="Şehir Filtresi..." value={sehirInput} onChange={(e) => setSehirInput(e.target.value)}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#1e3a5f', color: '#ffffff', padding: '0.85rem 1.5rem', borderRadius: '#0.5rem', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} /> SORGULA
          </button>
        </form>

        {/* REHBER KARTLARI */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontWeight: 'bold', color: '#1e3a5f', fontSize: '0.9rem' }}>Veriler Alınıyor...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {firmalar.length > 0 ? (
              firmalar.map((firma) => (
                <div 
                  key={firma.id} 
                  onClick={() => openFirmaDetay(firma)}
                  style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ width: '70px', height: '70px', backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid #f1f5f9' }}>
                    <img src={firma.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300"} alt={firma.firma_adi} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 0.25rem 0', textAlign: 'center' }}>{firma.firma_adi}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    <Star size={12} fill="#fbbf24" /> {firma.puan || "4.8"} ({firma.yorum_sayisi || "0"})
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', marginTop: 'auto' }}>
                    <MapPin size={12} style={{ color: '#f58220' }} /> {firma.merkez_konum || "Türkiye"}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontWeight: 'bold', margin: 0, fontSize: '0.9rem' }}>Arama kriterlerine uygun lojistik firması bulunamadı.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* YENİ FİRMA EKLEME FORMU - TÜM YAZI SOLUKLUK SORUNLARI GİDERİLDİ */}
      {firmaEkleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '550px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '1.25rem', backgroundColor: '#1e3a5f', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900' }}>Rehbere Firma Kaydet</h2>
              <button onClick={() => setFirmaEkleModal(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '0.25rem' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleFirmaKaydet} className="no-scrollbar" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>Firma Ticari Unvanı *</label>
                <input required type="text" name="firma_adi" value={yeniFirma.firma_adi} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700', backgroundColor: '#ffffff', outline: 'none' }} placeholder="Örn: Aydın Lojistik Ltd." />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>Firma Hakkında Tanıtım Yazısı *</label>
                <textarea required rows="3" name="hakkimizda" value={yeniFirma.hakkimizda} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700', backgroundColor: '#ffffff', outline: 'none', fontFamily: 'sans-serif', resize: 'vertical' }} placeholder="Hizmet ağınız, araç filonuz ve misyonunuz hakkında bilgi giriniz..."></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>Telefon *</label>
                  <input required type="tel" name="telefon" value={yeniFirma.telefon} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700', backgroundColor: '#ffffff', outline: 'none' }} placeholder="0532 123 45 67" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>WhatsApp</label>
                  <input type="tel" name="whatsapp" value={yeniFirma.whatsapp} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700', backgroundColor: '#ffffff', outline: 'none' }} placeholder="0532 123 45 67" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>E-Posta Adresi</label>
                  <input type="email" name="eposta" value={yeniFirma.eposta} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700', backgroundColor: '#ffffff', outline: 'none' }} placeholder="destek@firma.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>Merkez Şehir *</label>
                  <select required name="merkez_konum" value={yeniFirma.merkez_konum} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700', backgroundColor: '#ffffff', outline: 'none' }}>
                    <option value="" style={{ color: '#94a3b8' }}>Şehir Seçiniz</option>
                    {TURKIYE_SEHIRLERI.map((city) => <option key={city} value={city} style={{ color: '#000000' }}>{city}</option>)}
                  </select>
                </div>
              </div>

              {/* DİNAMİK MULTI-SELECT DROPDOWN */}
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>Hizmet Verdiği Şehirler *</label>
                <div 
                  onClick={() => setSehirDropdownAcik(!sehirDropdownAcik)}
                  style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem' }}
                >
                  {yeniFirma.hizmet_bolgeleri.length > 0 
                    ? yeniFirma.hizmet_bolgeleri.map(s => <span key={s} style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '0.35rem', fontSize: '0.8rem', fontWeight: 'bold' }}>{s}</span>)
                    : <span style={{ color: '#94a3b8', fontWeight: '700' }}>Şehirleri Seçmek için Tıklayın ({yeniFirma.hizmet_bolgeleri.length})</span>
                  }
                </div>
                {sehirDropdownAcik && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '0.5rem', maxHeight: '180px', overflowY: 'auto', zIndex: 110, padding: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    {TURKIYE_SEHIRLERI.map((sehir) => {
                      const secili = yeniFirma.hizmet_bolgeleri.includes(sehir);
                      return (
                        <div 
                          key={sehir} 
                          onClick={() => toggleSehirSecim(sehir)}
                          style={{ padding: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', backgroundColor: secili ? '#eff6ff' : 'transparent', color: secili ? '#2563eb' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0.25rem' }}
                        >
                          {sehir} {secili && '✓'}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* HİZMET CHECKBOXLARI */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.5rem' }}>Verilen Hizmet Çeşitleri</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '0.5rem', border: '2px solid #cbd5e1' }}>
                  {[
                    { key: 'sehirlerarasi_nakliye', etiket: 'Şehirlerarası Nakliye' },
                    { key: 'parsiyel_tasima', etiket: 'Parsiyel Taşıma' },
                    { key: 'komple_tasima', etiket: 'Komple Taşıma' },
                    { key: 'depolama_hizmeti', etiket: 'Depolama Hizmeti' },
                    { key: 'forklift_hizmeti', etiket: 'Forklift Hizmeti' },
                    { key: 'vinc_hizmeti', etiket: 'Vinç Hizmeti' },
                  ].map((item) => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" name={item.key} checked={yeniFirma[item.key]} onChange={handleInputChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      {item.etiket}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '0.4rem' }}>Logo Görsel Linki (URL)</label>
                <input type="url" name="logo_url" value={yeniFirma.logo_url} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', border: '2px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700', backgroundColor: '#ffffff', outline: 'none' }} placeholder="https://site.com/gorsel.png" />
              </div>

              <button type="submit" style={{ backgroundColor: '#f58220', color: '#ffffff', border: 'none', padding: '1rem', borderRadius: '0.5rem', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                KAYDI TAMAMLA
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function FirmalarPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>}>
      <FirmalarRehberi />
    </Suspense>
  );
}