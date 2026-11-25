import { simgeUret } from '../../../lib/simge';

export function generateStaticParams() {
  return [{ boyut: '192' }, { boyut: '512' }];
}

export const dynamicParams = false;

export async function GET(_istek, { params }) {
  const { boyut } = await params;
  return simgeUret(Number(boyut));
}
