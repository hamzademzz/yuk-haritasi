"use client";
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, ArrowLeft, Search, MapPin, Phone, MessageSquare, 
  Mail, Star, CheckCircle2, QrCode, ArrowRight, Grid, 
  FileText, Image as ImageIcon, MessageCircle, Truck, Package, 
  Warehouse, Anchor, Construction 
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

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
      
      if (!data || data.length === 0) {
        const fallbackQuery = await supabase.from('firmalar').select('*').eq('is_active', true).order('firma_adi', { ascending: true });
        data = fallbackQuery.data || [];
      }

      if (!error && data) {
        setFirmalar(data);
        if (searchParams.get('id')) {
          const matching = data.find(f => f.id.toString() === searchParams.get('id'));
          if (matching) setSeciliFirma(matching);
        }
      } else {
        console.error("Supabase hatasi:", error);
      }
    } catch (err) {
      console.error("Baglanti hatasi:", err);
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
      ? seciliFirma.hizmet_bolgeleri.split(',') 
      : (seciliFirma.hizmet_bolgeleri || ['Batman', 'Diyarbakır', 'Mardin', 'İstanbul']);

    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '4rem' }}>
        
        {/* ÜST BANNER */}
        <div style={{ position: 'relative', height: '240px', background: 'linear-gradient(rgba(30, 58, 95, 0.5), rgba(30, 58, 95, 0.9)), url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '2rem 1rem' }}>
          <button onClick={closeFirmaDetay} style={{ position: 'absolute', top: '2rem', left: '2rem', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(5px)' }}>
            <ArrowLeft size={16} /> REHBERE DÖN
          </button>
          
          <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1.5rem', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <img src={seciliFirma.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300"} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>{seciliFirma.firma_adi}</h1>
                <span style={{ backgroundColor: '#22c55e', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.35rem 0.75rem', borderRadius: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={14} fill="white" stroke="#22c55e" /> Doğrulanmış Üye
                </span>
              </div>
              <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.1rem', color: '#cbd5e1', fontWeight: '500' }}>Şehirlerarası Nakliye & Lojistik Hizmetleri</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={16} fill="#fbbf24" /> {seciliFirma.puan || "4.8"} ({seciliFirma.yorum_sayisi || "27"})</span>
                <span style={{ color: '#94a3b8' }}>•</span>
                <span style={{ color: '#cbd5e1' }}>2018'den beri üyemiz</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEKMELER - no-scrollbar class added for premium mobile touch swiping */}
        <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
          <div className="no-scrollbar" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', overflowX: 'auto', padding: '0 1rem' }}>
            {[
              { id: 'profil', etiket: 'Profil', ikon: <Grid size={16} /> },
              { id: 'hizmetler', etiket: 'Hizmetler', ikon: <Truck size={16} /> },
              { id: 'ilanlar', etiket: 'İlanlar (8)', ikon: <FileText size={16} /> },
              { id: 'galeri', etiket: 'Galeri', ikon: <ImageIcon size={16} /> },
              { id: 'yorumlar', etiket: `Yorumlar (${seciliFirma.yorum_sayisi || '27'})`, ikon: <MessageSquare size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAktifTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.25rem 1.5rem', border: 'none', background: 'none', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
                  color: aktifTab === tab.id ? '#1e3a5f' : '#64748b',
                  borderBottom: aktifTab === tab.id ? '3px solid #1e3a5f' : '3px solid transparent'
                }}
              >
                {tab.ikon} {tab.etiket}
              </button>
            ))}
          </div>
        </div>

        {/* PROFiL DETAY İÇERİĞİ */}
        <div style={{ maxWidth: '1000px', margin: '2rem auto 0', padding: '0 1rem' }}>
          {aktifTab === 'profil' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                
                {/* HAKKIMIZDA */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1rem' }}>Hakkımızda</h3>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                    {seciliFirma.hakkimizda}
                  </p>
                  <button style={{ background: 'none', border: 'none', color: '#f58220', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem', cursor: 'pointer', padding: 0 }}>Devamını Gör</button>
                </div>

                {/* İLETİŞİM BİLGİLERİ */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1rem' }}>İletişim Bilgileri</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: '#1e3a5f', width: '24px' }}><Phone size={20} /></div>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.telefon || "0532 123 45 67"}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: '#22c55e', width: '24px' }}><MessageCircle size={20} fill="#22c55e" stroke="white" /></div>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.whatsapp || "0532 123 45 67"}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: '#64748b', width: '24px' }}><Mail size={20} /></div>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.eposta || "bilgi@firma.com"}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: '#ef4444', width: '24px' }}><MapPin size={20} /></div>
                      <div>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.merkez_konum || "Batman, Merkez"}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>Türkiye Geneli Hizmet</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                
                {/* HİZMET BÖLGELERİ VE VE-MAPS TABANLI HARİTA YÜKLEMESİ */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1rem' }}>Hizmet Bölgeleri</h3>
                  <div style={{ width: '100%', height: '170px', backgroundColor: '#f8fafc', borderRadius: '1rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                    
                    {/* ACCURATE TURKEY MAP INJECTED AND STYLED TO PREMIUM BRAND BLUE */}
                    <img 
                      src="https://vemaps.com/uploads/img/tr-03.png" 
                      alt="Türkiye Haritası" 
                      style={{ 
                        width: '95%', 
                        height: '95%', 
                        objectFit: 'contain',
                        /* Converts the image outline lines and paths to match the original #2563eb mockup blue smoothly */
                        filter: 'invert(29%) sepia(87%) saturate(2235%) hue-rotate(212deg) brightness(96%) contrast(97%) drop-shadow(0px 4px 10px rgba(30,58,95,0.06))'
                      }} 
                    />
                    
                    <span style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: '#ffffff', padding: '0.35rem 0.65rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '900', color: '#1e3a5f', display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <CheckCircle2 size={12} style={{ color: '#3b82f6' }} /> Türkiye Geneli
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {bolgeler.map((sehir, idx) => (
                      <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.8rem', fontWeight: 'bold', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>{sehir.trim()}</span>
                    ))}
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'center', marginLeft: '0.25rem' }}>+ 20 şehir daha</span>
                  </div>
                </div>

                {/* DOĞRULAMA BİLGİLERİ */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1rem' }}>Doğrulama Bilgileri</h3>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>Üyelik No</p>
                      <p style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 'bold', color: '#334155' }}>{seciliFirma.uye_no || "YH-0001254"}</p>
                      
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>Doğrulama Tarihi</p>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#334155' }}>
                        {seciliFirma.dogrulama_tarihi ? new Date(seciliFirma.dogrulama_tarihi).toLocaleDateString('tr-TR') : '14.05.2024'}
                      </p>
                    </div>
                    <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '900', marginTop: '1rem', display: 'inline-block' }}>
                      Kimlik ve Belgeler Doğrulandı
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyCentent: 'center', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '1rem', backgroundColor: '#fafafa', alignSelf: 'center' }}>
                    <QrCode size={90} strokeWidth={1.5} />
                  </div>
                </div>

              </div>

              {/* HİZMETLERİMİZ */}
              <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 1.5rem' }}>Hizmetlerimiz</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                  {hizmetTipleri.map((hizmet, idx) => (
                    <div key={idx} style={{ border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', padding: '1.25rem 1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ color: '#1e3a5f' }}>{hizmet.ikon}</div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#1e3a5f', textAlign: 'center', textTransform: 'uppercase' }}>{hizmet.ad}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GALERİ */}
              <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e3a5f', margin: 0 }}>Galeri</h3>
                  <button onClick={() => setAktifTab('galeri')} style={{ color: '#f58220', border: 'none', background: 'none', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Tüm Fotoğraflar <ArrowRight size={14} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {[
                    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=400"
                  ].map((url, idx) => (
                    <div key={idx} style={{ height: '130px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={url} alt="Galeri" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* DİĞER SEKMELER */}
          {aktifTab !== 'profil' && (
            <div style={{ backgroundColor: '#ffffff', padding: '4rem 2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Building2 size={40} style={{ color: '#cbd5e1' }} />
              <p style={{ margin: 0, fontWeight: 'bold', color: '#64748b' }}>Bu sekme ile ilgili detaylı içerik yükleniyor...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ANA LİSTE GÖRÜNÜMÜ
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <div style={{ backgroundColor: '#1e3a5f', paddingTop: '3rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16}/> ANA SAYFAYA DÖN
          </Link>
          <h1 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '900', margin: 0, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            LOJİSTİK FİRMA REHBERİ
          </h1>
          <p style={{ color: '#f58220', fontWeight: 'bold', marginTop: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            DOĞRULANMIŞ GÜVENİLİR İŞ ORTAKLARI
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-3rem auto 0', padding: '0 1rem 5rem' }}>
        
        {/* ARAMA FORMU */}
        <form onSubmit={handleSearch} style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'row', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 2, minWidth: '250px' }}>
            <input 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#000000', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none' }}
              type="text" placeholder="Firma Adı Ara..." value={aramaInput} onChange={(e) => setAramaInput(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#000000', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none' }}
              type="text" placeholder="Şehir Filtrele..." value={sehirInput} onChange={(e) => setSehirInput(e.target.value)}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#f58220', color: '#ffffff', padding: '1rem 2.5rem', borderRadius: '0.75rem', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> FİRMA BUL
          </button>
        </form>

        {/* REHBER KARTLARI */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontWeight: 'bold', color: '#1e3a5f' }}>FİRMALAR YÜKLENİYOR...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {firmalar.length > 0 ? (
              firmalar.map((firma) => (
                <div 
                  key={firma.id} 
                  onClick={() => openFirmaDetay(firma)}
                  style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f58220'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div style={{ width: '90px', height: '90px', backgroundColor: '#f8fafc', borderRadius: '1rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyCentent: 'center', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
                    <img src={firma.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300"} alt={firma.firma_adi} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e3a5f', margin: '0 0 0.25rem', textAlign: 'center' }}>{firma.firma_adi}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    <Star size={14} fill="#fbbf24" /> {firma.puan || "4.8"} ({firma.yorum_sayisi || "27"})
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', marginTop: 'auto' }}>
                    <MapPin size={14} style={{ color: '#f58220' }} /> {firma.merkez_konum || "Türkiye"}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontWeight: 'bold', margin: 0 }}>Aradığınız kriterlere uygun firma bulunamadı.</p>
              </div>
            )}
          </div>
        )}
      </div>

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