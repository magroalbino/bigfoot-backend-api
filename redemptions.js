import { kv } from '@vercel/kv';

export default async function handler(req) {
  if (req.method === 'GET') {
    const data = await kv.get('redemptions') || [];
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (req.method === 'POST') {
    const { userId, product, date } = await req.json();

    if (!userId || !product || !date) {
      return new Response(JSON.stringify({ message: 'Campos obrigatórios ausentes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const current = await kv.get('redemptions') || [];
    const exists = current.find(r => r.userId === userId && r.product === product && r.date === date);

    if (exists) {
      return new Response(JSON.stringify({ message: 'Já resgatado' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updated = [...current, { userId, product, date }];
    await kv.set('redemptions', updated);

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
