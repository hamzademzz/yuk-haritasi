// "Ana ekrana ekle" ile uygulama gibi açılmasını sağlar
export default function manifest() {
  return {
    name: 'YükHaritası',
    short_name: 'YükHaritası',
    description: "Türkiye'nin lojistik platformu",
    lang: 'tr',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f6f9',
    theme_color: '#1e3a5f',
    icons: [
      { src: '/simge/192', sizes: '192x192', type: 'image/png' },
      { src: '/simge/512', sizes: '512x512', type: 'image/png' },
    ],
  };
}
