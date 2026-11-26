-- Güvenlik kuralları ve firma sahipliği.
-- 02 numaralı dosyanın ve "revoke select on public.profiles" komutunun yerini alır.
-- Mevcut kayıtları silmez veya değiştirmez. Birden fazla kez çalıştırılabilir.
--
-- DİKKAT: Canlı siteniz varsa bu dosyayı yeni kodu yayınlarken çalıştırın.
-- Eski kod bundan sonra firma listesini yükleyemez ve firma ekleyemez.
begin;

-- 1) Firmalar bir kullanıcıya bağlanır. Eski firmalar sahipsiz kalır.
alter table public.firmalar
  add column if not exists user_id uuid references auth.users (id) on delete set null;
alter table public.firmalar alter column user_id set default auth.uid();

-- Yeni firmalar uydurma puan, yorum sayısı veya doğrulama tarihiyle başlamasın
alter table public.firmalar alter column puan drop default;
alter table public.firmalar alter column yorum_sayisi set default 0;
alter table public.firmalar alter column dogrulama_tarihi drop default;
alter table public.firmalar alter column hizmet_bolgeleri drop default;

-- 2) Bu dört tablodaki tüm eski kurallar kaldırılır.
-- (Tek bir "herkese açık" kural kalsa bile diğer kurallar etkisiz olurdu.)
do $$
declare k record;
begin
  for k in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('profiles', 'yuk_ilanlari', 'araclar', 'firmalar')
  loop
    execute format('drop policy %I on public.%I', k.policyname, k.tablename);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.yuk_ilanlari enable row level security;
alter table public.araclar enable row level security;
alter table public.firmalar enable row level security;

-- 3) Profiller: herkes yalnızca kendi profilini görür ve düzenler
create policy "profil_kendi_okur" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profil_kendi_ekler" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profil_kendi_gunceller" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- 4) İlanlar ve firmalar: yayındakileri herkes görür; sahibi pasifleri de görür.
-- Ekleme, değiştirme ve silme yalnızca sahibine açıktır.
do $$
declare t text;
begin
  foreach t in array array['yuk_ilanlari', 'araclar', 'firmalar'] loop
    execute format('create policy "yayindakiler_herkese" on public.%I for select to anon, authenticated using (is_active is true)', t);
    execute format('create policy "sahibi_okur" on public.%I for select to authenticated using (auth.uid() = user_id)', t);
    execute format('create policy "sahibi_ekler" on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('create policy "sahibi_gunceller" on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create policy "sahibi_siler" on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
  end loop;
end $$;

-- 5) Girişsiz ziyaretçi profillere hiç erişemez
revoke all on public.profiles from anon;

-- 6) İletişim bilgileri yalnızca giriş yapanlara açıktır.
--    Girişsiz ziyaretçi (anon) telefon sütunlarını API üzerinden de okuyamaz.
revoke select on public.yuk_ilanlari, public.araclar from anon;

grant select (
  id, yuk_turu, agirlik_ton, arac_tipi_gereksinimi, nereden, nereye, mesafe_km,
  yukleme_tarihi, bosaltma_tarihi, is_active, olusturulma_tarihi,
  ilan_sahibi_ad_soyad, user_id
) on public.yuk_ilanlari to anon;

grant select (
  id, olusturulma_tarihi, arac_tipi, mevcut_konum_sehir, resim_url,
  ilan_sahibi, is_active, aciklama, user_id
) on public.araclar to anon;

-- 7) Firmalarda sütun izinleri:
--    Telefon, WhatsApp ve e-posta yalnızca giriş yapanlara açıktır.
--    TC kimlik ve vergi numarası API üzerinden okunamaz.
--    Puan, yorum sayısı ve doğrulama tarihi kullanıcılar tarafından yazılamaz.
revoke select, insert, update on public.firmalar from anon, authenticated;

grant select (
  id, user_id, logo_url, is_active, olusturulma_tarihi,
  firma_adi, hakkimizda, merkez_konum, hizmet_bolgeleri, uye_no,
  dogrulama_tarihi, puan, yorum_sayisi, parsiyel_tasima,
  oto_kurtarici, oto_tasiyici, vinc_hizmetleri, forklift_hizmetleri,
  depolama, is_makinalari, paketleme
) on public.firmalar to anon, authenticated;

grant select (telefon, whatsapp, eposta) on public.firmalar to authenticated;

grant insert (
  user_id, logo_url, telefon, whatsapp, eposta, is_active, firma_adi, hakkimizda,
  merkez_konum, hizmet_bolgeleri, uye_no, tc_kimlik_no, vergi_no, parsiyel_tasima,
  oto_kurtarici, oto_tasiyici, vinc_hizmetleri, forklift_hizmetleri,
  depolama, is_makinalari, paketleme
) on public.firmalar to authenticated;

grant update (
  logo_url, telefon, whatsapp, eposta, is_active, firma_adi, hakkimizda,
  merkez_konum, hizmet_bolgeleri, parsiyel_tasima,
  oto_kurtarici, oto_tasiyici, vinc_hizmetleri, forklift_hizmetleri,
  depolama, is_makinalari, paketleme
) on public.firmalar to authenticated;

-- 8) Girişsiz fotoğraf yüklemeyi kapatır (giriş yapanlar için kural duruyor)
drop policy if exists "Public Upload" on storage.objects;

commit;

notify pgrst, 'reload schema';

-- İSTEĞE BAĞLI: Sahipsiz eski bir kaydı, sahibini doğruladıktan SONRA bağlayın.
-- Baştaki "--" işaretlerini kaldırıp e-posta ve id değerlerini değiştirin.
-- update public.firmalar set user_id = (select id from auth.users where email = 'sahibi@ornek.com') where id = 0;
-- update public.yuk_ilanlari set user_id = (select id from auth.users where email = 'sahibi@ornek.com') where id = 0;
-- update public.araclar set user_id = (select id from auth.users where email = 'sahibi@ornek.com') where id = 0;
