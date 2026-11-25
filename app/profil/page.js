"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Box, CheckCircle, Edit3, LogOut, Plus, Trash2, Truck, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useOturum, useSorgu } from '../../lib/hooks';
import { cikisYap } from '../../components/AppShell';
import { Alan, BosDurum, HataDurumu, Iskelet } from '../../components/ui';
import IlanDuzenle from './IlanDuzenle';

const ROLLER = [
  ['Firma / Yük Sahibi', 'Firma / Yük Sahibi'],
  ['Bireysel Nakliyeci', 'Bireysel Nakliyeci / Sürücü'],
  ['Lojistik Şirketi', 'Lojistik Şirketi (Araç & Filo Sahibi)'],
];

const SEKMELER = [['ilanlar', 'İlanlarım'], ['hesap', 'Hesabım'], ['teklifler', 'Teklifler']];

function HesapFormu({ userId, profil, onSonuc }) {
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const kaydet = async (e) => {
    e.preventDefault();
    const degisiklik = Object.fromEntries(new FormData(e.currentTarget));
    setKaydediliyor(true);
    const { data, error } = await supabase.from('profiles').update(degisiklik).eq('id', userId).select('id');
    setKaydediliyor(false);
    if (error) onSonuc('hata', `Profil güncellenemedi: ${error.message}`);
    else if (!data.length) onSonuc('hata', 'Profil güncellenemedi. Profil kaydı bulunamadı veya izniniz yok.');
    else onSonuc('basari', 'Profil bilgileriniz kaydedildi.', true);
  };

  return (
    <form onSubmit={kaydet} className="card grid max-w-3xl grid-cols-2 gap-3 p-4 lg:p-6">
      <Alan etiket="Adınız"><input className="input" name="first_name" required defaultValue={profil.first_name || ''} autoComplete="given-name" /></Alan>
      <Alan etiket="Soyadınız"><input className="input" name="last_name" required defaultValue={profil.last_name || ''} autoComplete="family-name" /></Alan>
      <Alan etiket="Telefon Numarası" className="col-span-2 sm:col-span-1"><input className="input" name="phone" type="tel" required defaultValue={profil.phone || ''} autoComplete="tel" /></Alan>
      <Alan etiket="Platform Rolü" className="col-span-2 sm:col-span-1">
        {/* Veritabanı varsayılanı 'user' seçeneklerde yok; ilk seçeneği göster */}
        <select className="input" name="rol" defaultValue={ROLLER.some(([v]) => v === profil.rol) ? profil.rol : ROLLER[0][0]}>
          {ROLLER.map(([v, ad]) => <option key={v} value={v}>{ad}</option>)}
        </select>
      </Alan>
      <button type="submit" disabled={kaydediliyor} className="btn btn-navy col-span-2">{kaydediliyor ? 'Kaydediliyor…' : 'Değişiklikleri Kaydet'}</button>
    </form>
  );
}

function IlanBolumu({ baslik, Ikon, ilanlar, bosMesaj, ozet, onDuzenle, onSil }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-extrabold text-navy"><Ikon size={18} className="text-brand" /> {baslik} ({ilanlar.length})</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {ilanlar.length === 0 ? <BosDurum mesaj={bosMesaj} /> : ilanlar.map((ilan) => {
          const [ust, alt] = ozet(ilan);
          return (
            <article key={ilan.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-extrabold break-words text-navy">{ust}</p>
                  <p className="mt-1 text-sm break-words text-slate-500">{alt}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${ilan.is_active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{ilan.is_active ? 'Aktif' : 'Pasif'}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => onDuzenle(ilan)} className="btn btn-ghost !min-h-11"><Edit3 size={15} /> Düzenle</button>
                <button onClick={() => onSil(ilan)} className="btn btn-danger !min-h-11"><Trash2 size={15} /> Kaldır</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProfilIcerigi({ user }) {
  const [sekme, setSekme] = useState('ilanlar');
  const [mesaj, setMesaj] = useState(null);
  const [duzenlenen, setDuzenlenen] = useState(null); // { tip, ilan }

  const { veri, hata, yukleniyor, yenile } = useSorgu(`profil-${user.id}`, async () => {
    const ilanlarim = (tablo) => supabase.from(tablo).select('*').eq('user_id', user.id).order('id', { ascending: false });
    const [profil, yukler, araclar] = await Promise.all([
      supabase.from('profiles').select('first_name, last_name, phone, rol').eq('id', user.id).maybeSingle(),
      ilanlarim('yuk_ilanlari'),
      ilanlarim('araclar'),
    ]);
    const error = profil.error || yukler.error || araclar.error;
    return { data: [{ profil: profil.data || {}, yukler: yukler.data || [], araclar: araclar.data || [] }], error };
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

  const sil = async (tablo, ilan) => {
    if (!window.confirm('Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?')) return;
    const { data, error } = await supabase.from(tablo).delete().eq('id', ilan.id).select('id');
    if (error) sonuc('hata', `İlan silinemedi: ${error.message}`);
    else if (!data.length) sonuc('hata', 'İlan silinemedi. Bu ilan için silme izniniz olmayabilir.');
    else sonuc('basari', 'İlan kaldırıldı.', true);
  };

  // İlk yüklemeden sonraki tazelemelerde mevcut içerik ekranda kalır
  const bilgi = veri[0];
  const profil = bilgi?.profil ?? {};
  const ad = [profil.first_name, profil.last_name].filter(Boolean).join(' ') || user.email.split('@')[0];

  return (
    <>
      <section className="bg-navy px-4 pt-3 pb-6 text-white lg:py-10">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10"><User size={28} /></span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-extrabold">{ad}</h1>
            <p className="truncate text-sm text-slate-300">{user.email}</p>
          </div>
          <button onClick={cikisYap} className="flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-white/10 px-3 text-sm font-bold hover:bg-white/20"><LogOut size={16} /> Çıkış</button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-200/70 p-1 sm:max-w-md">
          {SEKMELER.map(([id, etiket]) => (
            <button key={id} aria-pressed={sekme === id} onClick={() => setSekme(id)} className={`min-h-11 cursor-pointer rounded-xl text-sm font-bold ${sekme === id ? 'bg-white text-navy shadow-sm' : 'text-slate-500'}`}>{etiket}</button>
          ))}
        </div>

        {mesaj && (
          <p role="status" className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-sm font-semibold ${mesaj.tip === 'basari' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
            {mesaj.tip === 'basari' ? <CheckCircle size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />} {mesaj.icerik}
          </p>
        )}

        <div className="mt-4">
          {!bilgi ? <div className="grid gap-3"><Iskelet adet={3} className="h-28" /></div>
            : hata && !yukleniyor ? <HataDurumu onTekrar={yenile} />
            : sekme === 'hesap' ? <HesapFormu userId={user.id} profil={profil} onSonuc={sonuc} />
            : sekme === 'teklifler' ? <BosDurum mesaj="Henüz bir teklif bulunmuyor." />
            : (
              <div className="space-y-6">
                <Link href="/ilan-ver" className="btn btn-brand w-full sm:w-auto"><Plus size={17} /> Yeni İlan Ekle</Link>
                <IlanBolumu
                  baslik="Yük İlanlarım" Ikon={Box} ilanlar={bilgi.yukler} bosMesaj="Yayınlanmış yük ilanınız bulunmuyor."
                  ozet={(i) => [`${i.nereden || '—'} → ${i.nereye || '—'}`, `${i.yuk_turu || 'Genel Yük'} · ${i.agirlik_ton ?? '—'} Ton`]}
                  onDuzenle={(ilan) => setDuzenlenen({ tip: 'yuk', ilan })}
                  onSil={(ilan) => sil('yuk_ilanlari', ilan)}
                />
                <IlanBolumu
                  baslik="Araç İlanlarım" Ikon={Truck} ilanlar={bilgi.araclar} bosMesaj="Yayınlanmış araç ilanınız bulunmuyor."
                  ozet={(i) => [i.mevcut_konum_sehir, [i.arac_tipi, i.aciklama].filter(Boolean).join(' · ')]}
                  onDuzenle={(ilan) => setDuzenlenen({ tip: 'arac', ilan })}
                  onSil={(ilan) => sil('araclar', ilan)}
                />
              </div>
            )}
        </div>
      </div>

      {duzenlenen && (
        <IlanDuzenle
          {...duzenlenen}
          onKapat={() => setDuzenlenen(null)}
          onKaydet={() => { setDuzenlenen(null); sonuc('basari', 'İlan güncellendi.', true); }}
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

  return <ProfilIcerigi user={user} />;
}
