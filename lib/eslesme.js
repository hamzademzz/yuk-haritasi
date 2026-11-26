import { SEHIRLER } from './constants.js';

// "BATMAN", "batman" ve "Batman, Merkez" aynı sayılsın diye sadeleştirir
export const duzle = (metin) =>
  (metin || '').toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const ILLER = new Set(SEHIRLER.map(duzle));
const kelimeler = (metin) => duzle(metin).split(/[^a-z0-9]+/).filter(Boolean);
const sehirKodu = (metin) => kelimeler(metin).find((k) => ILLER.has(k)) ?? duzle(metin);

export const ayniSehir = (a, b) => !!duzle(a) && !!duzle(b) && sehirKodu(a) === sehirKodu(b);

// Tam kelime karşılaştırılır: "Kamyon" ile "Kamyonet" eşleşmez
export const aracUygun = (gereken, tip) => {
  const aranan = kelimeler(gereken);
  return kelimeler(tip).some((k) => aranan.includes(k));
};

export const bugun = () => new Date().toLocaleDateString('en-CA'); // YYYY-AA-GG
export const suresiDoldu = (yuk, gun = bugun()) => !!yuk.yukleme_tarihi && yuk.yukleme_tarihi < gun;

const uygunOnce = (liste) => [...liste].sort((a, b) => Number(b.uygun) - Number(a.uygun));

export const aracIcinYukler = (arac, yukler, gun = bugun()) =>
  uygunOnce(
    yukler
      .filter((y) => !suresiDoldu(y, gun) && ayniSehir(y.nereden, arac.mevcut_konum_sehir))
      .map((y) => ({ ...y, uygun: aracUygun(y.arac_tipi_gereksinimi, arac.arac_tipi) }))
  );

export const yukIcinAraclar = (yuk, araclar) =>
  uygunOnce(
    araclar
      .filter((a) => ayniSehir(a.mevcut_konum_sehir, yuk.nereden))
      .map((a) => ({ ...a, uygun: aracUygun(yuk.arac_tipi_gereksinimi, a.arac_tipi) }))
  );
