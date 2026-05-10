"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Truck, 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  Navigation, 
  Calendar, 
  Weight, 
  Phone, 
  User, 
  ChevronRight,
  X 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function IlanVerPage() {
  const router = useRouter();
  const [step, setStep] = useState('selection'); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    yuk_turu: '',
    agirlik_ton: '',
    arac_tipi_gereksinimi: '',
    nereden: '',
    nereye: '',
    yukleme_tarihi: '',
    bosaltma_tarihi: '',
    ilan_sahibi_ad_soyad: '',
    telefon_numarasi: '',
    is_active: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('yuk_ilanlari')
        .insert([{ 
          ...formData, 
          agirlik_ton: parseFloat(formData.agirlik_ton),
          olusturulma_tarihi: new Date().toISOString()
        }]);
      if (error) throw error;
      setStep('success');
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: '900',
    color: '#475569',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: '2px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '700', 
    color: '#000000', 
    outline: 'none',
    boxSizing: 'border-box'
  };

  const inputWithIconStyle = {
    ...inputStyle,
    paddingLeft: '2.75rem'
  };

  const iconInsideStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#1e3a5f'
  };

  const SelectionCard = ({ title, icon: Icon, active, desc, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '1.5rem',
        border: active ? '2px solid #f58220' : '2px solid #e2e8f0',
        cursor: active ? 'pointer' : 'not-allowed',
        opacity: active ? 1 : 0.6,
        textAlign: 'center',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      <div style={{ backgroundColor: active ? '#f58220' : '#94a3b8', color: '#fff', width: 'fit-content', padding: '1rem', borderRadius: '1rem', margin: '0 auto 1.5rem' }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontWeight: '900', color: '#1e3a5f', margin: '0 0 0.5rem' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem' }}>{desc}</p>
      {!active && <span style={{ backgroundColor: '#f1f5f9', color: '#f58220', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: '900' }}>YAKINDA</span>}
    </div>
  );

  if (step === 'selection') {
    return (
      <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', cursor: 'pointer', marginBottom: '2rem', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> ANA SAYFA
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e3a5f', marginBottom: '0.5rem', fontStyle: 'italic' }}>İLAN TÜRÜ SEÇİN</h1>
          <p style={{ color: '#64748b', marginBottom: '3rem', fontWeight: '500' }}>Sistemde yayınlamak istediğiniz ilan kategorisini belirleyin.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <SelectionCard title="YÜK İLANI" desc="Taşınacak yükünüz için araç bulun" icon={Package} active={true} onClick={() => router.push('/yukler?ekle=true')} />
            <SelectionCard 
  title="ARAÇ İLANI" 
  desc="Boş aracınız için yük bulun" 
  icon={Truck} 
  active={true} 
  onClick={() => router.push('/araclar?ekle=true')} 
/>
            <SelectionCard title="FİRMA İLANI" desc="Lojistik şirketinizi tanıtın" icon={Building2} active={false} />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
        <div style={{ backgroundColor: '#fff', padding: '4rem 2rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '500px' }}>
          <CheckCircle2 size={70} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontWeight: '900', color: '#1e3a5f', fontSize: '2rem' }}>İLAN YAYINLANDI!</h2>
          <button onClick={() => router.push('/yukler')} style={{ backgroundColor: '#1e3a5f', color: '#fff', padding: '1.25rem', borderRadius: '1rem', border: 'none', fontWeight: '900', cursor: 'pointer', width: '100%' }}>İLANLARI LİSTELE</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
       <style>{`
        input::placeholder { color: #94a3b8 !important; font-weight: 500; font-size: 0.8rem; }
        input::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(0.2); }
        input[type="date"]::-webkit-datetime-edit { padding-left: 0.5rem; }
        @media (max-width: 600px) {
          .mobile-grid { grid-template-columns: 1fr !important; }
          .form-padding { padding: 1.5rem !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#1e3a5f', padding: '3rem 1rem 6rem' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <button onClick={() => setStep('selection')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
            <ArrowLeft size={18}/> SEÇİME DÖN
          </button>
          <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' }}>GÜNCEL YÜK BİLGİLERİ</h1>
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '-4rem auto 0', padding: '0 1rem 5rem' }}>
        <form onSubmit={handleSubmit} className="form-padding" style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#f58220', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '2px solid #f8fafc', paddingBottom: '0.75rem' }}>
              <Package size={22} /> YÜK VE ARAÇ DETAYLARI
            </h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>YÜKÜN CİNSİ / TÜRÜ</label>
                <input required style={inputStyle} placeholder="Örn: Evden Eve, Paletli, Demir..." value={formData.yuk_turu} onChange={(e) => setFormData({...formData, yuk_turu: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}>AĞIRLIK (TON)</label>
                  <div style={{ position: 'relative' }}>
                    <Weight style={iconInsideStyle} size={18} />
                    <input required type="number" step="0.1" style={inputWithIconStyle} placeholder="0.0" value={formData.agirlik_ton} onChange={(e) => setFormData({...formData, agirlik_ton: e.target.value})} />
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}>İHTİYAÇ ARAÇ</label>
                  <div style={{ position: 'relative' }}>
                    <Truck style={iconInsideStyle} size={18} />
                    <input style={inputWithIconStyle} placeholder="Tır, Kamyon..." value={formData.arac_tipi_gereksinimi} onChange={(e) => setFormData({...formData, arac_tipi_gereksinimi: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#f58220', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '2px solid #f8fafc', paddingBottom: '0.75rem' }}>
              <Navigation size={22} /> ROTA VE TAKVİM
            </h3>
            <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>KALKIŞ NOKTASI</label>
                <input required style={inputStyle} placeholder="Şehir ve İlçe" value={formData.nereden} onChange={(e) => setFormData({...formData, nereden: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>VARIŞ NOKTASI</label>
                <input required style={inputStyle} placeholder="Şehir ve İlçe" value={formData.nereye} onChange={(e) => setFormData({...formData, nereye: e.target.value})} />
              </div>
            </div>
            <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={labelStyle}>YÜKLEME TARİHİ</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ position: 'relative', flex: 1 }}>
                     <Calendar style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#1e3a5f', pointerEvents: 'none', zIndex: 1 }} size={16} />
                     <input 
                      required 
                      type="date" 
                      style={{
                        ...inputStyle, 
                        paddingLeft: '2.8rem', 
                        appearance: 'none', 
                        display: 'block'
                      }} 
                      value={formData.yukleme_tarihi} 
                      onChange={(e) => setFormData({...formData, yukleme_tarihi: e.target.value})} 
                    />
                   </div>
                   {formData.yukleme_tarihi && (
                     <button type="button" onClick={() => setFormData({...formData, yukleme_tarihi: ''})} style={{ background: '#fee2e2', border: 'none', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer', color: '#ef4444' }}>
                       <X size={16} />
                     </button>
                   )}
                </div>
              </div>
              <div>
                <label style={labelStyle}>BOŞALTMA TARİHİ</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ position: 'relative', flex: 1 }}>
                     <Calendar style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#1e3a5f', pointerEvents: 'none', zIndex: 1 }} size={16} />
                     <input 
                      type="date" 
                      style={{
                        ...inputStyle, 
                        paddingLeft: '2.8rem', 
                        appearance: 'none', 
                        display: 'block'
                      }} 
                      value={formData.bosaltma_tarihi} 
                      onChange={(e) => setFormData({...formData, bosaltma_tarihi: e.target.value})} 
                    />
                   </div>
                   {formData.bosaltma_tarihi && (
                     <button type="button" onClick={() => setFormData({...formData, bosaltma_tarihi: ''})} style={{ background: '#fee2e2', border: 'none', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer', color: '#ef4444' }}>
                       <X size={16} />
                     </button>
                   )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#f58220', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '2px solid #f8fafc', paddingBottom: '0.75rem' }}>
              <User size={22} /> İLETİŞİM KANALLARI
            </h3>
            <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>YÜKÜ VEREN (AD SOYAD)</label>
                <input required style={inputStyle} placeholder="Adınız Soyadınız" value={formData.ilan_sahibi_ad_soyad} onChange={(e) => setFormData({...formData, ilan_sahibi_ad_soyad: e.target.value})} />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>TELEFON NUMARASI</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={iconInsideStyle} size={18} />
                  <input required type="tel" style={inputWithIconStyle} placeholder="05XX XXX XX XX" value={formData.telefon_numarasi} onChange={(e) => setFormData({...formData, telefon_numarasi: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              backgroundColor: '#22c55e', 
              color: '#ffffff', 
              padding: '1.25rem', 
              borderRadius: '1rem', 
              border: 'none', 
              fontSize: '1.25rem', 
              fontWeight: '900', 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.4)'
            }}
          >
            {loading ? "İLANINIZ KAYDEDİLİYOR..." : <>ŞİMDİ YAYINLA <ChevronRight size={24}/></>}
          </button>
        </form>
      </div>
    </div>
  );
}