import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("https://rajaongkir.komerce.id/api/v1/destination/province", {
    // const res = await fetch("https://localhost/api/v1/destination/province", {
      headers: { "Key": process.env.RAJAONGKIR_API_KEY || "" }
    });
    const json = await res.json();
    return NextResponse.json(json.data || [ ]);
  } catch (e) {
    console.error("Error Province:", e);
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}