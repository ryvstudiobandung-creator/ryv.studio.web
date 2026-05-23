import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ city_id: string }> }) {
  const { city_id } = await params; // Unwrapping params
  
  try {
    const res = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/district/${city_id}`, {
    // const res = await fetch("https://localhost/api/v1/calculate/district/domestic-cost", {
      headers: { "Key": process.env.RAJAONGKIR_API_KEY || "" }
    });
    const json = await res.json();
    console.log("District Response:", json); // Debug log
    return NextResponse.json(json.data || [ ]);
  } catch (e) {
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}