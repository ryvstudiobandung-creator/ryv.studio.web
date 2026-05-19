import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase'; // Sesuaikan path jika perlu

export async function GET() {
  try {
    // Tarik semua data dari tabel 'products'
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

    // Kalau ada error dari Supabase, lempar status 500
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Kembalikan data dalam format JSON yang rapi
    return NextResponse.json(products, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}