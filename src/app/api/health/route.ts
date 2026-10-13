import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ ok: true, version: process.env.npm_package_version ?? "1.0.0" }, { headers: { "Cache-Control": "no-store" } });
}
