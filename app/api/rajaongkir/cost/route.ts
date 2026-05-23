import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const res = await fetch("https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost", {
    // const res = await fetch("https://localhost/api/v1/calculate/district/domestic-cost", {
      method: "POST",
      headers: {
        "Key": process.env.RAJAONGKIR_API_KEY || "",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        origin: "557",
        destination: body.destinationDistrictId,
        weight: body.weight.toString(),
        courier: "jnt",
        price: "lowest"
      })
    });
    const json = await res.json();
    console.log("Cost Response:", json); // Debug log
    return NextResponse.json(json.data || [ ]);
  } catch (e) {
    console.error("Error Cost:", e);
    return NextResponse.json({ error: "Gagal hitung" }, { status: 500 });
  }
}