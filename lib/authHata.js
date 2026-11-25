const CEVIRILER = [
  [/invalid login credentials/i, 'E-posta veya şifre hatalı.'],
  [/email not confirmed/i, 'Önce e-postanıza gelen onay bağlantısına tıklayın.'],
  [/already registered/i, 'Bu e-posta adresiyle zaten bir hesap var.'],
  [/password should be at least (\d+)/i, 'Şifre en az $1 karakter olmalı.'],
  [/rate limit|only request this after/i, 'Çok fazla deneme yapıldı. Biraz sonra tekrar deneyin.'],
];

export function authHatasi(mesaj) {
  const eslesme = CEVIRILER.find(([desen]) => desen.test(mesaj));
  if (!eslesme) return mesaj;
  const [desen, ceviri] = eslesme;
  return ceviri.replace('$1', mesaj.match(desen)[1] ?? '');
}
