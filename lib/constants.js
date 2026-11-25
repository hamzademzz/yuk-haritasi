export const SEHIRLER = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

export const ARAC_TIPLERI = ["Tır", "Kamyon", "Kamyonet", "Panelvan", "Forklift", "Vinç", "Lowbed", "Oto Kurtarıcı"];

export const HIZMETLER = [
  { anahtar: 'oto_kurtarici', ad: 'Oto Kurtarıcı', alt: '7/24 Yol Yardım', ikon: '🚨' },
  { anahtar: 'oto_tasiyici', ad: 'Oto Taşıyıcı', alt: 'Evden Eve Nakliyat', ikon: '⛓️' },
  { anahtar: 'vinc_hizmetleri', ad: 'Vinç Hizmetleri', alt: 'Vinç & Mobil Vinç', ikon: '🏗️' },
  { anahtar: 'forklift_hizmetleri', ad: 'Forklift Hizmetleri', alt: 'Forklift & İstif', ikon: '🚜' },
  { anahtar: 'depolama', ad: 'Depolama', alt: 'Depo & Antrepo', ikon: '🏢' },
  { anahtar: 'is_makinalari', ad: 'İş Makinaları', alt: 'Ekskavatör & Dozer', ikon: '👷' },
  { anahtar: 'paketleme', ad: 'Paketleme', alt: 'Ambalaj Hizmetleri', ikon: '📦' },
  { anahtar: 'parsiyel_tasima', ad: 'Parsiyel Taşıma', alt: 'Komple Taşıma', ikon: '🚛' },
];

export const DESTEK_WHATSAPP = '447400221777';

export const tarihYaz = (deger) => (deger ? new Date(deger).toLocaleDateString('tr-TR') : null);

// wa.me ülke kodlu ve yalnızca rakamlardan oluşan numara ister
export const whatsappLinki = (numara = '') => {
  let n = numara.replace(/\D/g, '');
  if (n.startsWith('00')) n = n.slice(2);
  else if (n.startsWith('0')) n = `90${n.slice(1)}`;
  else if (n.length === 10 && n.startsWith('5')) n = `90${n}`;
  return `https://wa.me/${n}`;
};
