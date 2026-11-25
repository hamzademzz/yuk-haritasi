import { ImageResponse } from 'next/og';

export function simgeUret(boyut) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e3a5f', color: '#fff', fontSize: boyut * 0.44, fontWeight: 700 }}>
        Y<span style={{ color: '#f58220' }}>H</span>
      </div>
    ),
    { width: boyut, height: boyut }
  );
}
