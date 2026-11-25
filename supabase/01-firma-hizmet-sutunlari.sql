-- Firma formunun kullandığı eksik hizmet sütunlarını ekler. Mevcut verileri değiştirmez.
alter table public.firmalar
  add column if not exists oto_kurtarici boolean default false,
  add column if not exists oto_tasiyici boolean default false,
  add column if not exists vinc_hizmetleri boolean default false,
  add column if not exists forklift_hizmetleri boolean default false,
  add column if not exists depolama boolean default false,
  add column if not exists is_makinalari boolean default false,
  add column if not exists paketleme boolean default false;

notify pgrst, 'reload schema';
