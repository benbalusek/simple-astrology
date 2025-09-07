import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ASTROLOGY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const body = await req.json();

    const upstream = await fetch(
      "https://json.freeastrologyapi.com/western/planets",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(body),
      },
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, body: text },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Request failed", details: String(err) },
      { status: 500 },
    );
  }
}
