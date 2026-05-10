"use client";
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Truck, MapPin, Calendar, Weight, User, Phone, ArrowLeft, Search, Navigation, Filter, X, Box, Camera, Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase'; 

function AracListesi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [konumInput, setKonumInput] = useState(searchParams.get('konum') || '');
  const [tipInput, setTipInput] = useState(searchParams.get('tip') || '');
  
  const [araclar, setAraclar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [yeniArac, setYeniArac] = useState({
    arac_tipi: '',
    mevcut_konum_sehir: '',
    iletisim: '',
    kapasite_ton: '',
    resim_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800'
  });

  // AUTO-OPEN MODAL LOGIC
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ekle') === 'true') {
      setIsModalOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  const fetchAraclar = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('araclar').select('*').eq('is_active', true);
    
    if (searchParams.get('konum')) {
      query = query.ilike('mevcut_konum_sehir', `%${searchParams.get('konum')}%`);
    }
    if (searchParams.get('tip')) {
      query = query.ilike('arac_tipi', `%${searchParams.get('tip')}%`);
    }

    const { data, error } = await query.order('olusturulma_tarihi', { ascending: false });
    
    if (!error) {
      setAraclar(data);
    } else {
      console.error("DB Hatası:", error);
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => { 
    fetchAraclar(); 
  }, [fetchAraclar]);

  // FIXED DYNAMIC IMAGE UPLOAD WITH FALLBACK LOGIC
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `araclar/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('arac-resimleri')
      .upload(filePath, file);

    if (uploadError) {
      alert('Resim yüklenemedi: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from('arac-resimleri').getPublicUrl(filePath);
    
    // Fallback logic if getPublicUrl is restricted
    const finalUrl = data.publicUrl || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/arac-resimleri/${filePath}`;

    setYeniArac(prev => ({ ...prev, resim_url: finalUrl }));
    setIsUploading(false);
  };

  const handleEkle = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('araclar').insert([yeniArac]);

    if (error) {
      alert('İlan eklenirken bir hata oluştu: ' + error.message);
    } else {
      setIsModalOpen(false);
      fetchAraclar();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (konumInput) params.set('konum', konumInput);
    if (tipInput) params.set('tip', tipInput);
    router.push(`/araclar?${params.toString()}`);
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER SECTION */}
      <div style={{ backgroundColor: '#1e3a5f', paddingTop: '3rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <ArrowLeft size={16}/> ANA SAYFAYA DÖN
              </Link>
              <h1 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '900', margin: 0, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                GÜNCEL ARAÇ İLANLARI
              </h1>
              <p style={{ color: '#f58220', fontWeight: 'bold', marginTop: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                SİSTEMDE {araclar.length} AKTİF ARAÇ BULUNUYOR
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{ backgroundColor: '#f58220', color: '#ffffff', padding: '1rem 1.5rem', borderRadius: '0.75rem', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PlusCircle size={18} /> ARAÇ İLANI VER
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-3rem auto 0', padding: '0 1rem 5rem' }}>
        {/* SEARCH FORM */}
        <form onSubmit={handleSearch} style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'row', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#000000', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none' }}
              type="text" placeholder="Bulunduğu Şehir?" value={konumInput} onChange={(e) => setKonumInput(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#000000', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none' }}
              type="text" placeholder="Araç Tipi? (Tır, Kamyon...)" value={tipInput} onChange={(e) => setTipInput(e.target.value)}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#1e3a5f', color: '#ffffff', padding: '1rem 2.5rem', borderRadius: '0.75rem', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> BUL
          </button>
        </form>

        {/* LISTING */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontWeight: 'bold', color: '#1e3a5f' }}>VERİLER ÇEKİLİYOR...</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {araclar.length > 0 ? (
              araclar.map((arac) => (
                <div key={arac.id} style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img src={arac.resim_url} alt={arac.arac_tipi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #e2e8f0' }}>
                          {arac.arac_tipi}
                        </span>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000000', margin: '0.75rem 0 0', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
                          <MapPin size={24} style={{ color: '#f58220' }} /> {arac.mevcut_konum_sehir}
                        </h3>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Weight size={24} style={{ color: '#64748b' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>KAPASİTE</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#000000' }}>{arac.kapasite_ton ? `${arac.kapasite_ton} TON` : 'BELİRTİLMEDİ'}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Truck size={24} style={{ color: '#64748b' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>ARAÇ DURUMU</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e' }}>MÜSAİT / AKTİF</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '2rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fcfcfc', flexWrap: 'wrap', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e3a5f' }}>
                          <User size={24} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>{arac.ilan_sahibi || "FİRMA YETKİLİSİ"}</p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>DOĞRULANMIŞ ARAÇ SAHİBİ</p>
                        </div>
                     </div>

                     <a 
                      href={`tel:${arac.iletisim}`}
                      style={{ backgroundColor: '#22c55e', color: '#ffffff', textDecoration: 'none', padding: '1.25rem 3rem', borderRadius: '1rem', fontWeight: '900', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.2)' }}
                     >
                      <Phone size={20} fill="white" /> ŞİMDİ ARA
                     </a>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontWeight: 'bold' }}>Aradığınız kriterlere uygun araç bulunamadı.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD VEHICLE MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(30, 58, 95, 0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '600px', borderRadius: '1.5rem', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e3a5f', marginBottom: '1.5rem', fontStyle: 'italic', textTransform: 'uppercase' }}>YENİ ARAÇ EKLE</h2>
            
            <form onSubmit={handleEkle} style={{ display: 'grid', gap: '1rem' }}>
              <input required style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#000' }} placeholder="Araç Tipi (Örn: Tır)" onChange={(e) => setYeniArac({...yeniArac, arac_tipi: e.target.value})} />
              <input required style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#000' }} placeholder="Bulunduğu Şehir" onChange={(e) => setYeniArac({...yeniArac, mevcut_konum_sehir: e.target.value})} />
              <input required style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#000' }} placeholder="İletişim Numarası" onChange={(e) => setYeniArac({...yeniArac, iletisim: e.target.value})} />
              <input style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#000' }} placeholder="Kapasite (Ton) - Opsiyonel" onChange={(e) => setYeniArac({...yeniArac, kapasite_ton: e.target.value})} />
              
              <div style={{ border: '2px dashed #e2e8f0', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                <input type="file" id="file" hidden accept="image/*" onChange={handleImageUpload} />
                <label htmlFor="file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  {isUploading ? <Loader2 className="animate-spin" /> : <Camera size={24} />}
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{isUploading ? 'YÜKLENİYOR...' : 'GALERİDEN FOTOĞRAF SEÇ'}</span>
                </label>
              </div>

              <button type="submit" disabled={isUploading} style={{ backgroundColor: '#f58220', color: '#fff', padding: '1rem', borderRadius: '0.75rem', fontWeight: '900', border: 'none', cursor: 'pointer', marginTop: '1rem', opacity: isUploading ? 0.5 : 1 }}>
                İLANIMI YAYINLA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AraclarPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>}>
      <AracListesi />
    </Suspense>
  );
}