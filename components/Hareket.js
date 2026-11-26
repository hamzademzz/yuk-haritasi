"use client";
// Sayfa hareketleri: yumuşak kaydırma, kaydırınca beliren bölümler, kelime kelime gelen başlıklar
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function YumusakKaydirma() {
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const oncekiYol = useRef(pathname);
  const geriDonus = useRef(false);

  // Yeni sayfa en üstten açılır; geri/ileri tuşunda tarayıcının konumu korunur
  useEffect(() => {
    const isaretle = () => { geriDonus.current = window.location.pathname !== oncekiYol.current; };
    window.addEventListener('popstate', isaretle);
    return () => window.removeEventListener('popstate', isaretle);
  }, []);

  useEffect(() => {
    if (oncekiYol.current === pathname) return;
    oncekiYol.current = pathname;
    lenisRef.current?.resize();
    if (!geriDonus.current && !window.location.hash) {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    }
    geriDonus.current = false;
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Dokunmatik ekranlarda telefonun kendi kaydırması korunur
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
    lenisRef.current = lenis;
    return () => { lenisRef.current = null; lenis.destroy(); };
  }, []);
  return null;
}

// İçerik ekrana girince bulanıklıktan netleşerek yükselir
export function Belir({ children, gecikme = 0, tur = 'yukari', className = '' }) {
  const ref = useRef(null);
  const [gorundu, setGorundu] = useState(false);

  useEffect(() => {
    const gozlemci = new IntersectionObserver(([giris]) => {
      if (giris.isIntersecting) {
        setGorundu(true);
        gozlemci.disconnect();
      }
    }, { rootMargin: '0px 0px -40px 0px' });
    gozlemci.observe(ref.current);
    return () => gozlemci.disconnect();
  }, []);

  return (
    <div ref={ref} className={`belir belir-${tur} ${gorundu ? 'gorundu' : ''} ${className}`} style={{ transitionDelay: `${gecikme}ms` }}>
      {children}
    </div>
  );
}

// Her satır ayrı satırda, kelimeler sırayla netleşir
export function Kelimeler({ satirlar }) {
  let sira = 0;
  return satirlar.map((satir, i) => {
    const { metin, className = '' } = typeof satir === 'string' ? { metin: satir } : satir;
    return (
      <span key={i} className="block">
        {metin.split(' ').map((kelime, j) => (
          <span key={j}>
            {j > 0 && ' '}
            <span className={`kelime ${className}`} style={{ animationDelay: `${120 + sira++ * 90}ms` }}>{kelime}</span>
          </span>
        ))}
      </span>
    );
  });
}
