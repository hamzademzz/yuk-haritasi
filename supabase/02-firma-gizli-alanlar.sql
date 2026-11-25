-- TC kimlik ve vergi numarasının API üzerinden okunmasını engeller.
-- ÖNCE 01 numaralı dosyayı çalıştırın.
-- Yeni kodu yayına aldıktan SONRA çalıştırın: eski kod select('*') kullandığı için
-- bu dosyadan sonra firma listesini yükleyemez.
begin;

revoke select on public.firmalar from anon, authenticated;

grant select (
  id, logo_url, telefon, whatsapp, eposta, is_active, olusturulma_tarihi,
  firma_adi, hakkimizda, merkez_konum, hizmet_bolgeleri, uye_no,
  dogrulama_tarihi, puan, yorum_sayisi, parsiyel_tasima,
  oto_kurtarici, oto_tasiyici, vinc_hizmetleri, forklift_hizmetleri,
  depolama, is_makinalari, paketleme
) on public.firmalar to anon, authenticated;

commit;

notify pgrst, 'reload schema';
