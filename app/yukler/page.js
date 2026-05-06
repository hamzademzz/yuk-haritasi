"use client";
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Truck, MapPin, Calendar, Weight, User, Phone, ArrowLeft, Search, Navigation, Filter } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase'; 

function YukListesi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Syncing state with URL params
  const [neredenInput, setNeredenInput] = useState(searchParams.get('nereden') || '');
  const [nereyeInput, setNereyeInput] = useState(searchParams.get('nereye') || '');
  const [tarihInput, setTarihInput] = useState(searchParams.get('tarih') || '');
  
  const [yukler, setYukler] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchYukler = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('yuk_ilanlari').select('*').eq('is_active', true);
    
    // Applying Filters
    if (searchParams.get('nereden')) {
      query = query.ilike('nereden', `%${searchParams.get('nereden')}%`);
    }
    if (searchParams.get('nereye')) {
      query = query.ilike('nereye', `%${searchParams.get('nereye')}%`);
    }
    if (searchParams.get('tarih')) {
      // Filtering for the specific day
      query = query.eq('yukleme_tarihi', searchParams.get('tarih'));
    }

    const { data, error } = await query.order('olusturulma_tarihi', { ascending: false });
    
    if (!error) {
      setYukler(data);
    } else {
      console.error("Supabase Error:", error);
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => { 
    fetchYukler(); 
  }, [fetchYukler]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (neredenInput) params.set('nereden', neredenInput);
    if (nereyeInput) params.set('nereye', nereyeInput);
    if (tarihInput) params.set('tarih', tarihInput);
    
    router.push(`/yukler?${params.toString()}`);
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <style>{`
        input::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(0.2); }
      `}</style>

      {/* ENTERPRISE HEADER */}
      <div style={{ backgroundColor: '#1e3a5f', paddingTop: '3rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16}/> ANA SAYFAYA DÖN
          </Link>
          
          <h1 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '900', margin: 0, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            GÜNCEL YÜK İLANLARI
          </h1>
          <p style={{ color: '#f58220', fontWeight: 'bold', marginTop: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            SİSTEMDE {yukler.length} AKTİF İLAN BULUNUYOR
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-3rem auto 0', padding: '0 1rem 5rem' }}>
        {/* ENHANCED SEARCH BAR */}
        <form onSubmit={handleSearch} style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'row', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#000000', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none' }}
              type="text" placeholder="Nereden?" value={neredenInput} onChange={(e) => setNeredenInput(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <input 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#000000', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none' }}
              type="text" placeholder="Nereye?" value={nereyeInput} onChange={(e) => setNereyeInput(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
             <Calendar size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#1e3a5f', pointerEvents: 'none', zIndex: 1 }} />
             <input 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#000000', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none', position: 'relative' }}
              type="date" value={tarihInput} onChange={(e) => setTarihInput(e.target.value)}
            />
          </div>

          <button type="submit" style={{ backgroundColor: '#f58220', color: '#ffffff', padding: '1rem 2.5rem', borderRadius: '0.75rem', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> BUL
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontWeight: 'bold', color: '#1e3a5f' }}>VERİLER ÇEKİLİYOR...</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {yukler.length > 0 ? (
              yukler.map((yuk) => (
                <div key={yuk.id} style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  
                  {/* CONTENT AREA */}
                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #e2e8f0' }}>
                          {yuk.yuk_turu || "GENEL YÜK"}
                        </span>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#000000', margin: '0.75rem 0 0', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
                          {yuk.nereden} <span style={{ color: '#f58220' }}>➔</span> {yuk.nereye}
                        </h3>
                      </div>
                    </div>

                    {/* DETAILS GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Weight size={24} style={{ color: '#64748b' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>AĞIRLIK</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#000000' }}>{yuk.agirlik_ton} TON</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Truck size={24} style={{ color: '#64748b' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>ARAÇ TİPİ</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#000000' }}>{yuk.arac_tipi_gereksinimi || "STANDART"}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Calendar size={24} style={{ color: '#64748b' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>YÜKLEME TARİHİ</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#000000' }}>
                            {yuk.yukleme_tarihi ? new Date(yuk.yukleme_tarihi).toLocaleDateString('tr-TR') : 'ACİL'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM CONTACT SECTION */}
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '2rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fcfcfc', flexWrap: 'wrap', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e3a5f', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          <User size={24} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>{yuk.ilan_sahibi_ad_soyad || "İSİMSİZ"}</p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>DOĞRULANMIŞ İLAN SAHİBİ</p>
                        </div>
                     </div>

                     <a 
                      href={`tel:${yuk.telefon_numarasi}`}
                      style={{ backgroundColor: '#22c55e', color: '#ffffff', textDecoration: 'none', padding: '1.25rem 3rem', borderRadius: '1rem', fontWeight: '900', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s', boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.2)' }}
                     >
                      <Phone size={20} fill="white" /> ŞİMDİ ARA
                     </a>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontWeight: 'bold' }}>Aradığınız kriterlere uygun ilan bulunamadı.</p>
                <button onClick={() => {setNeredenInput(''); setNereyeInput(''); setTarihInput(''); router.push('/yukler')}} style={{ background: 'none', border: 'none', color: '#f58220', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
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

export default function YuklerPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>}>
      <YukListesi />
    </Suspense>
  );
}