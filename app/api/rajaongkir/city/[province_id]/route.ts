import { NextResponse } from 'next/server';

// Kita tambahin 'await' di depan params
export async function GET(req: Request, { params }: { params: Promise<{ province_id: string }> }) {
  const { province_id } = await params; // Unwrapping params
  
  try {
    const res = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/city/${province_id}`, {
    // const res = await fetch(`https:/localhost/api/v1/destination/city/${province_id}`, {
      headers: { "Key": process.env.RAJAONGKIR_API_KEY || "" }
    });
    const json = await res.json();
    return NextResponse.json(json.data || [ ]);
  } catch (e) {
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}