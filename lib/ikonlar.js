// Lucide'de bulunmayan sektör ikonları; aynı çizgi stiliyle çizildi
import { createLucideIcon } from 'lucide-react';

const yol = (d, key) => ['path', { d, key }];
const daire = (cx, cy, r, key) => ['circle', { cx, cy, r, key }];

export const CekiciIkonu = createLucideIcon('cekici', [
  yol('M15 17V8h3.5L22 12.5V17h-1', 'kabin'),
  yol('M15 14H2v3h2', 'kasa'),
  yol('M9 17h6', 'sasi'),
  yol('M13 14 5 6', 'bom'),
  yol('M5 6v3.5a1.5 1.5 0 0 1-3 0', 'kanca'),
  daire(6.5, 17.5, 2, 'arka'),
  daire(18, 17.5, 2, 'on'),
]);

export const VincIkonu = createLucideIcon('vinc', [
  yol('M6 21V3', 'kule1'),
  yol('M10 21V7', 'kule2'),
  yol('M3 21h10', 'taban'),
  yol('M2 7h20', 'kol'),
  yol('M6 3l16 4', 'ust'),
  yol('M6 3 2 7', 'denge'),
  yol('m6 11 4 4-4 4', 'kafes'),
  yol('M18 7v6', 'halat'),
  yol('M16 13h4v4h-4z', 'yuk'),
]);

export const EkskavatorIkonu = createLucideIcon('ekskavator', [
  ['rect', { x: 2, y: 17, width: 13, height: 4, rx: 2, key: 'palet' }],
  yol('M4 17v-7h5l2 4h2v3', 'kabin'),
  yol('M11 12.500 15 4l5 4', 'kol'),
  yol('M20 8v6', 'bilek'),
  yol('M22 14h-5a4 4 0 0 0 4 4h1z', 'kepce'),
]);
