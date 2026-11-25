"use client";
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from './supabase';

export function useOturum() {
  const [durum, setDurum] = useState({ user: null, hazir: false });

  useEffect(() => {
    // onAuthStateChange ilk abonelikte mevcut oturumu da bildirir
    const { data } = supabase.auth.onAuthStateChange((_olay, session) => {
      setDurum({ user: session?.user ?? null, hazir: true });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return durum;
}

// İlan ekleme panelini yönetir: giriş yapılmamışsa giriş uyarısı gösterir.
// Adreste ?ekle=true varsa panel kendiliğinden açılır.
export function useEklePaneli() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [panel, setPanel] = useState(null); // null | 'form' | 'giris'

  const ac = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setPanel(session ? 'form' : 'giris');
  }, []);

  useEffect(() => {
    if (searchParams.get('ekle') !== 'true') return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setPanel(session ? 'form' : 'giris');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('ekle');
      window.history.replaceState(null, '', params.size ? `${pathname}?${params}` : pathname);
    });
  }, [searchParams, pathname]);

  const kapat = useCallback(() => setPanel(null), []);
  const girisIste = useCallback(() => setPanel('giris'), []);

  return { panel, ac, kapat, girisIste };
}

// Aynı sayfada yalnızca adres parametrelerini değiştirir. router.push, üretim
// sürümünde parametreli adresten parametresiz adrese geçmiyordu.
export function adresDegistir(yol) {
  window.history.pushState(null, '', yol);
}

// Sorgu anahtarı değiştikçe veriyi yeniden çeker; eski yanıtlar yok sayılır.
export function useSorgu(anahtar, sorgula) {
  const [sonuc, setSonuc] = useState({ anahtar: null, veri: [], hata: null });
  const [surum, setSurum] = useState(0);
  const tamAnahtar = `${anahtar}#${surum}`;

  useEffect(() => {
    let iptal = false;
    Promise.resolve(sorgula())
      .then(({ data, error }) => {
        if (error) console.error('Veri yükleme hatası:', error);
        if (!iptal) setSonuc({ anahtar: tamAnahtar, veri: data ?? [], hata: error ?? null });
      })
      .catch((error) => {
        console.error('Veri yükleme hatası:', error);
        if (!iptal) setSonuc({ anahtar: tamAnahtar, veri: [], hata: error });
      });
    return () => { iptal = true; };
    // sorgula her çizimde yenilenir; yeniden çekmeyi yalnızca anahtar belirler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tamAnahtar]);

  const yenile = useCallback(() => setSurum((s) => s + 1), []);

  return { veri: sonuc.veri, hata: sonuc.hata, yukleniyor: sonuc.anahtar !== tamAnahtar, yenile };
}
