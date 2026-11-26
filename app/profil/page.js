"use client";
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adresDegistir, useOturum, useSorgu } from '../../lib/hooks';
import { tumSutunlar } from '../../lib/sutunlar';
import { HataDurumu, Iskelet } from '../../components/ui';
import Ilanlarim, { ilanDurumu } from './Ilanlarim';
import Eslesmeler from './Eslesmeler';
import Firmam from './Firmam';
import Hesap, { ROLLER } from './Hesap';
import IlanDuzenle from './IlanDuzenle';

const SEKMELER = [['ilanlar', 'İlanlarım'], ['eslesmeler', 'Eşleşmeler'], ['firmam', 'Firmam'], ['hesap', 'Hesabım']];
const TABLO = { yuk: 'yuk_ilanlari', arac: 'araclar' };

function ProfilIcerigi({ user }) {
  const router = useRouter();
  const istenen = useSearchParams().get('sekme');
  const sekme = SEKMELER.some(([id]) => id === istenen) ? istenen : 'ilanlar';
  const [mesaj, setMesaj] = useState(null);
  const [duzenlenen, setDuzenlenen] = useState(null); // { tip, ilan, yeniden? }

  const { veri, hata, yukleniyor, yenile } = useSorgu(`profil-${user.id}`, async () => {
    const benim = (tablo, secilen) => supabase.from(tablo).select(secilen).eq('user_id', user.id).order('id', { ascending: false });
    const [profil, yukler, araclar, firmalar] = await Promise.all([
      supabase.from('profiles').select('first_name, last_name, phone, rol').eq('id', user.id).maybeSingle(),
      benim('yuk_ilanlari', '*'),
      benim('araclar', '*'),
      benim('firmalar', `${tumSutunlar('firmalar')}, is_active`),
    ]);
    // Firma sorgusu başarısız olsa da profilin geri kalanı açılır
    if (firmalar.error) console.error('Firmalar yüklenemedi:', firmalar.error);
    return {
      data: [{ profil: profil.data || {}, yukler: yukler.data || [], araclar: araclar.data || [], firmalar: firmalar.data || [], firmaHatasi: !!firmalar.error }],
      error: profil.error || yukler.error || araclar.error,
    };
  });

  useEffect(() => {
    if (!mesaj) return;
    const zaman = setTimeout(() => setMesaj(null), 6000);
    return () => clearTimeout(zaman);
  }, [mesaj]);

  const sonuc = (tip, icerik, tazele) => {
    setMesaj({ tip, icerik });
    if (tazele) yenile();
  };

  // İzin kuralı işlemi engellerse hata dönmez, yalnızca sonuç boş gelir
  const uygula = async (sorgu, basari, basarisiz) => {
    const { data, error } = await sorgu.select('id');
    if (error) sonuc('hata', `${basarisiz}: ${error.message}`);
    else if (!data.length) sonuc('hata', `${basarisiz}. Bu işlem için izniniz olmayabilir.`);
    else sonuc('basari', basari, true);
  };

  const ilanIslemleri = {
    onDuzenle: ({ tip, ilan }) => setDuzenlenen({ tip, ilan }),
    onTamamla: ({ tip, ilan }) => uygula(supabase.from(TABLO[tip]).update({ is_active: false }).eq('id', ilan.id), 'İlan yayından kaldırıldı. Geçmiş bölümünde duruyor.', 'İlan güncellenemedi'),
    onYeniden: ({ tip, ilan }) => {
      // Yük ilanı için yeni yükleme tarihi gerekir
      if (tip === 'yuk') setDuzenlenen({ tip, ilan, yeniden: true });
      else uygula(supabase.from('araclar').update({ is_active: true, olusturulma_tarihi: new Date().toISOString() }).eq('id', ilan.id), 'Araç ilanı yeniden yayında.', 'İlan yayınlanamadı');
    },
    onSil: ({ tip, ilan }) => {
      if (window.confirm('Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?')) {
        uygula(supabase.from(TABLO[tip]).delete().eq('id', ilan.id), 'İlan silindi.', 'İlan silinemedi');
      }
    },
  };

  // Sonraki tazelemelerde mevcut içerik ekranda kalır
  const bilgi = veri[0];
  const profil = bilgi?.profil ?? {};
  const ad = [profil.first_name, profil.last_name].filter(Boolean).join(' ') || user.email.split('@')[0];
  const rol = ROLLER.find(([v]) => v === profil.rol)?.[0];
  const yayindaki = bilgi
    ? bilgi.yukler.filter((y) => ilanDurumu('yuk', y) === 'Yayında').length + bilgi.araclar.filter((a) => ilanDurumu('arac', a) === 'Yayında').length
    : null;

  return (
    <>
      <section className="hero-desen bg-navy px-4 pt-3 pb-5 text-white lg:py-10">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10"><User size={28} /></span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold">{ad}</h1>
            <p className="truncate text-sm text-slate-300">
              {[rol, yayindaki != null && `${yayindaki} yayında ilan`].filter(Boolean).join(' · ') || user.email}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-slate-200/70 p-1 lg:max-w-2xl">
          {SEKMELER.map(([id, etiket]) => (
            <button key={id} aria-pressed={sekme === id} onClick={() => adresDegistir(`/profil?sekme=${id}`)} className={`min-h-11 cursor-pointer rounded-xl px-1 text-xs font-bold sm:text-sm ${sekme === id ? 'bg-white text-navy shadow-sm' : 'text-slate-500'}`}>{etiket}</button>
          ))}
        </div>

        {/* Alt kenarda sabit: kaydırılmış sayfada da görünür */}
        {mesaj && (
          <p role="status" className={`fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md items-center gap-2 rounded-xl p-4 text-sm font-semibold text-white shadow-xl lg:bottom-8 ${mesaj.tip === 'basari' ? 'bg-green-700' : 'bg-red-700'}`}>
            {mesaj.tip === 'basari' ? <CheckCircle size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />} {mesaj.icerik}
          </p>
        )}

        <div className="mt-4">
          {!bilgi ? <div className="grid gap-3"><Iskelet adet={3} className="h-28" /></div>
            : hata && !yukleniyor ? <HataDurumu onTekrar={yenile} />
            : sekme === 'hesap' ? <Hesap user={user} profil={profil} onSonuc={sonuc} />
            : sekme === 'eslesmeler' ? <Eslesmeler userId={user.id} yukler={bilgi.yukler} araclar={bilgi.araclar} />
            : sekme === 'firmam' ? (
              <Firmam
                firmalar={bilgi.firmalar}
                kullanilamiyor={bilgi.firmaHatasi}
                onGirisGerekli={() => router.push('/login')}
                onKaydedildi={() => sonuc('basari', 'Firma bilgileri kaydedildi.', true)}
                onGorunurluk={(f) => uygula(supabase.from('firmalar').update({ is_active: !f.is_active }).eq('id', f.id), f.is_active ? 'Firmanız rehberden gizlendi.' : 'Firmanız yeniden yayında.', 'Firma güncellenemedi')}
                onSil={(f) => {
                  if (window.confirm(`"${f.firma_adi}" kalıcı olarak silinsin mi?`)) uygula(supabase.from('firmalar').delete().eq('id', f.id), 'Firma silindi.', 'Firma silinemedi');
                }}
              />
            )
            : <Ilanlarim yukler={bilgi.yukler} araclar={bilgi.araclar} {...ilanIslemleri} />}
        </div>
      </div>

      {duzenlenen && (
        <IlanDuzenle
          {...duzenlenen}
          onKapat={() => setDuzenlenen(null)}
          onKaydet={() => { setDuzenlenen(null); sonuc('basari', duzenlenen.yeniden ? 'İlan yeniden yayında.' : 'İlan güncellendi.', true); }}
        />
      )}
    </>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, hazir } = useOturum();

  useEffect(() => {
    if (hazir && !user) router.replace('/login');
  }, [hazir, user, router]);

  if (!user) return <p className="p-20 text-center text-slate-500">Yükleniyor…</p>;

  return (
    <Suspense fallback={null}>
      <ProfilIcerigi user={user} />
    </Suspense>
  );
}
