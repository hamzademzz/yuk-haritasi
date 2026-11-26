// İletişim sütunlarını yalnızca giriş yapanlar okuyabilir (supabase/03 numaralı dosya).
// Girişsiz bir sorgu bu sütunları ya da '*' isterse veritabanı tümünü reddeder.
import { supabase } from './supabase';

const ACIK = {
  yuk_ilanlari: 'id, yuk_turu, agirlik_ton, arac_tipi_gereksinimi, nereden, nereye, yukleme_tarihi, bosaltma_tarihi, is_active, olusturulma_tarihi, ilan_sahibi_ad_soyad',
  araclar: 'id, olusturulma_tarihi, arac_tipi, mevcut_konum_sehir, resim_url, ilan_sahibi, is_active, aciklama',
  firmalar: 'id, logo_url, firma_adi, hakkimizda, merkez_konum, hizmet_bolgeleri, uye_no, puan, yorum_sayisi, parsiyel_tasima, oto_kurtarici, oto_tasiyici, vinc_hizmetleri, forklift_hizmetleri, depolama, is_makinalari, paketleme',
};

const ILETISIM = {
  yuk_ilanlari: 'telefon_numarasi',
  araclar: 'iletisim',
  firmalar: 'telefon, whatsapp, eposta',
};

export const acikSutunlar = (tablo) => ACIK[tablo];
export const tumSutunlar = (tablo) => `${ACIK[tablo]}, ${ILETISIM[tablo]}`;

export async function sutunlar(tablo) {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? tumSutunlar(tablo) : acikSutunlar(tablo);
}
