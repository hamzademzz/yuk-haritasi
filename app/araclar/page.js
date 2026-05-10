"use client";
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Truck, MapPin, Calendar, Weight, User, Phone, ArrowLeft, Search, Navigation, Filter, X, Box } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase'; 

function AracListesi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [konumInput, setKonumInput] = useState(searchParams.get('konum') || '');
  const [tipInput, setTipInput] = useState(searchParams.get('tip') || '');
  
  const [araclar, setAraclar] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAraclar = useCallback(async () => {
    setLoading(true);
    // Note: Ensure your table name is 'araclar' in Supabase
    let query = supabase.from('araclar').select('*');
    
    if (searchParams.get('konum')) {
      query = query.ilike('mevcut_konum_sehir', `%${searchParams.get('konum')}%`);
    }
    if (searchParams.get('tip')) {
      query = query.ilike('arac_tipi', `%${searchParams.get('tip')}%`);
    }

    const { data, error } = await query.order('olusturulma_tarihi', { ascending: false });
    
    if (!error && data.length > 0) {
      setAraclar(data);
    } else {
      // Fallback with 10 high-quality dummy items if DB is empty for preview
      const fallbackAraclar = [
        { id: 1, arac_tipi: "Tır (Tenteli)", mevcut_konum_sehir: "İstanbul", iletisim: "0532 000 00 00", kapasite_ton: "24", resim_url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Ahmet Yılmaz" },
        { id: 2, arac_tipi: "Forklift", mevcut_konum_sehir: "Bursa", iletisim: "0533 111 22 33", kapasite_ton: "3", resim_url: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Mehmet Demir" },
        { id: 3, arac_tipi: "Kamyon (Onteker)", mevcut_konum_sehir: "Ankara", iletisim: "0535 222 33 44", kapasite_ton: "15", resim_url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Can Lojistik" },
        { id: 4, arac_tipi: "Kamyonet", mevcut_konum_sehir: "İzmir", iletisim: "0542 333 44 55", kapasite_ton: "3.5", resim_url: "https://images.unsplash.com/photo-1586191121264-1e0c21ed4602?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Ege Nakliyat" },
        { id: 5, arac_tipi: "Lowbed", mevcut_konum_sehir: "Kocaeli", iletisim: "0544 444 55 66", kapasite_ton: "60", resim_url: "https://images.unsplash.com/photo-1591768793355-74d7ca738596?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Saray Vinç" },
        { id: 6, arac_tipi: "Vinç", mevcut_konum_sehir: "Antalya", iletisim: "0531 555 66 77", kapasite_ton: "100", resim_url: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Akdeniz Platform" },
        { id: 7, arac_tipi: "Panelvan", mevcut_konum_sehir: "Mersin", iletisim: "0530 666 77 88", kapasite_ton: "1.2", resim_url: "https://images.unsplash.com/photo-1549194388-2469d59ec69c?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Hızlı Kurye" },
        { id: 8, arac_tipi: "Oto Kurtarıcı", mevcut_konum_sehir: "Sakarya", iletisim: "0539 777 88 99", kapasite_ton: "5", resim_url: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "7/24 Yol Yardım" },
        { id: 9, arac_tipi: "Tır (Frigo)", mevcut_konum_sehir: "Adana", iletisim: "0538 888 99 00", kapasite_ton: "22", resim_url: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Güney Soğuk Hava" },
        { id: 10, arac_tipi: "Damperli Kamyon", mevcut_konum_sehir: "Trabzon", iletisim: "0537 999 00 11", kapasite_ton: "20", resim_url: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&q=80&w=800", ilan_sahibi: "Karadeniz İnşaat" },
      ];
      setAraclar(fallbackAraclar);
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => { 
    fetchAraclar(); 
  }, [fetchAraclar]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (konumInput) params.set('konum', konumInput);
    if (tipInput) params.set('tip', tipInput);
    router.push(`/araclar?${params.toString()}`);
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a5f', paddingTop: '3rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
      </div>

      <div style={{ maxWidth: '1100px', margin: '-3rem auto 0', padding: '0 1rem 5rem' }}>
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
              type="text" placeholder="Araç Tipi? (Tır, Vinç...)" value={tipInput} onChange={(e) => setTipInput(e.target.value)}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#f58220', color: '#ffffff', padding: '1rem 2.5rem', borderRadius: '0.75rem', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, width: '100%', justifyContent: 'center', maxWidth: '180px' }}>
            <Search size={18} /> BUL
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontWeight: 'bold', color: '#1e3a5f' }}>ARAÇLAR ÇEKİLİYOR...</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {araclar.length > 0 ? (
              araclar.map((arac) => (
                <div key={arac.id} style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  
                  {/* Image Header */}
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img src={arac.resim_url} alt={arac.arac_tipi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: 'rgba(30, 58, 95, 0.9)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      MÜSAİT ARAÇ
                    </div>
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #e2e8f0' }}>
                        {arac.arac_tipi}
                      </span>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000000', margin: '0.75rem 0 0', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
                        <MapPin size={24} style={{ color: '#f58220', marginRight: '0.5rem' }} /> {arac.mevcut_konum_sehir}
                      </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
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
                          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>DURUM</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e' }}>AKTİF / BOŞTA</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '2rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fcfcfc', flexWrap: 'wrap', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e3a5f', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          <User size={24} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>{arac.ilan_sahibi || "FİRMA YETKİLİSİ"}</p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>DOĞRULANMIŞ ARAÇ SAHİBİ</p>
                        </div>
                     </div>

                     <a 
                      href={`tel:${arac.iletisim}`}
                      style={{ backgroundColor: '#22c55e', color: '#ffffff', textDecoration: 'none', padding: '1.25rem 3rem', borderRadius: '1rem', fontWeight: '900', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s', boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.2)' }}
                     >
                      <Phone size={20} fill="white" /> ŞİMDİ ARA
                     </a>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontWeight: 'bold' }}>Aradığınız kriterlere uygun araç bulunamadı.</p>
                <button onClick={() => {setKonumInput(''); setTipInput(''); router.push('/araclar')}} style={{ background: 'none', border: 'none', color: '#f58220', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                  Tüm ilanları göster
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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