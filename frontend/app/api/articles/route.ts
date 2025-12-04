import { NextResponse } from "next/server";

const Base_url=`${process.env.NEXT_PUBLIC_STRAPI_URL}`;

export async function GET() {
  try {
    const res = await fetch(`${Base_url}/articles?populate=*`, {
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
