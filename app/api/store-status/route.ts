import { NextResponse } from "next/server";
import { getStoreStatus } from "@/lib/store-status";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getStoreStatus());
}
