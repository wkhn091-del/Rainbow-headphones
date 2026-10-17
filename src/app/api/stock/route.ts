import { NextResponse } from "next/server";
import { LAUNCH } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Public remaining units — demo falls back to LAUNCH.totalUnits.
 * Never leaks provider errors.
 */
export async function GET() {
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      {
        ok: true,
        remaining: LAUNCH.totalUnits,
        total: LAUNCH.totalUnits,
        demo: true,
      },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } },
    );
  }

  try {
    const { data, error } = await admin
      .from("stock")
      .select("remaining, total")
      .eq("product_name", "Nexa Pro 3D")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        {
          ok: true,
          remaining: LAUNCH.totalUnits,
          total: LAUNCH.totalUnits,
          demo: true,
        },
        { headers: { "Cache-Control": "public, s-maxage=15" } },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        remaining: Number(data.remaining),
        total: Number(data.total ?? LAUNCH.totalUnits),
        demo: false,
      },
      { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=45" } },
    );
  } catch {
    return NextResponse.json(
      {
        ok: true,
        remaining: LAUNCH.totalUnits,
        total: LAUNCH.totalUnits,
        demo: true,
      },
      { status: 200 },
    );
  }
}
