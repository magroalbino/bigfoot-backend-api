import { kv } from '@vercel/kv';

export default async function handler(req) {
  if (req.method === 'GET') {
    const redemptions = await kv.get('redemptions') || [];
    return new Response(JSON.stringify(redemptions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    const { userId, product, date } = await req.json();

    if (!userId || !product || !date) {
      return new Response(JSON.stringify({ message: 'Campos obrigatórios' }), { status: 400 });
    }

    const redemptions = await kv.get('redemptions') || [];
    const already = redemptions.find(
      (r) => r.userId === userId && r.product === product && r.date === date
    );

    if (already) {
      return new Response(JSON.stringify({ message: 'Produto já resgatado.' }), { status: 409 });
    }

    redemptions.push({ userId, product, date });
    await kv.set('redemptions', redemptions);

    return new Response(JSON.stringify({ userId, product, date }), { status: 201 });
  }

  return new Response(JSON.stringify({ message: 'Método não permitido' }), { status: 405 });
}
