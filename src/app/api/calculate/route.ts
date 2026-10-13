import { NextResponse } from "next/server";
import { calculate, validateInput } from "@/lib/model";

export const runtime = "nodejs";
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  try {
    validateInput(body);
    return NextResponse.json(calculate(body), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid input.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
