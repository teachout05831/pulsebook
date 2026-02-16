import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// GET /api/payment-settings - Get company payment settings (auth required)
export async function GET() {
  try {
    await getAuthCompany();

    // TODO: When payment_settings table/column is created, fetch from DB:
    //
    // const { data, error } = await supabase
    //   .from("company_payment_settings")
    //   .select("provider, stripe_account_id, square_merchant_id, internal_enabled, accepted_methods")
    //   .eq("company_id", companyId)
    //   .limit(1)
    //   .single();
    //
    // if (data) {
    //   return NextResponse.json({
    //     data: {
    //       provider: data.provider,
    //       stripeAccountId: data.stripe_account_id,
    //       squareMerchantId: data.square_merchant_id,
    //       internalEnabled: data.internal_enabled,
    //       acceptedMethods: data.accepted_methods,
    //     },
    //   });
    // }

    // Return defaults — internal payment processing is the primary/default option
    // allowExternalProviders is controlled by platform admin, defaults to false
    return NextResponse.json({
      data: {
        provider: "internal",
        stripeAccountId: null,
        squareMerchantId: null,
        internalEnabled: true,
        allowExternalProviders: false,
        acceptedMethods: ["card"],
      },
    }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT /api/payment-settings - Update company payment settings (auth required)
export async function PUT(request: NextRequest) {
  try {
    await getAuthCompany();

    const body = await request.json();

    // Validate provider
    if (body.provider && !["internal", "stripe", "square"].includes(body.provider)) {
      return NextResponse.json({ error: "Invalid payment provider" }, { status: 400 });
    }

    // Block external providers if not allowed by platform admin
    // TODO: Check allowExternalProviders from DB when table exists
    if (body.provider && body.provider !== "internal") {
      // For now, external providers are disabled by default
      // Platform admin toggle will control this per-company
      const allowExternalProviders = false;
      if (!allowExternalProviders) {
        return NextResponse.json(
          { error: "External payment providers are not enabled for this account" },
          { status: 403 }
        );
      }
    }

    // Validate accepted methods
    const validMethods = ["card", "bank", "apple_pay", "google_pay"];
    if (body.acceptedMethods) {
      if (!Array.isArray(body.acceptedMethods)) {
        return NextResponse.json({ error: "acceptedMethods must be an array" }, { status: 400 });
      }
      for (const method of body.acceptedMethods) {
        if (!validMethods.includes(method)) {
          return NextResponse.json(
            { error: `Invalid payment method: ${method}` },
            { status: 400 }
          );
        }
      }
    }

    // Validate Stripe account ID format if provided
    if (body.stripeAccountId && typeof body.stripeAccountId !== "string") {
      return NextResponse.json({ error: "Invalid Stripe account ID" }, { status: 400 });
    }

    // Validate Square merchant ID format if provided
    if (body.squareMerchantId && typeof body.squareMerchantId !== "string") {
      return NextResponse.json({ error: "Invalid Square merchant ID" }, { status: 400 });
    }

    // TODO: When payment_settings table/column is created, persist to DB:
    //
    // const payload = {
    //   company_id: companyId,
    //   provider: body.provider ?? "internal",
    //   stripe_account_id: body.stripeAccountId ?? null,
    //   square_merchant_id: body.squareMerchantId ?? null,
    //   internal_enabled: body.internalEnabled ?? true,
    //   accepted_methods: body.acceptedMethods ?? ["card"],
    //   updated_at: new Date().toISOString(),
    // };
    //
    // const { error } = await supabase
    //   .from("company_payment_settings")
    //   .upsert(payload, { onConflict: "company_id" })
    //   .select("company_id")
    //   .single();
    //
    // if (error) {
    //   return NextResponse.json({ error: "Failed to save payment settings" }, { status: 500 });
    // }

    return NextResponse.json({
      success: true,
      data: {
        provider: body.provider ?? "internal",
        stripeAccountId: body.stripeAccountId ?? null,
        squareMerchantId: body.squareMerchantId ?? null,
        internalEnabled: body.internalEnabled ?? true,
        allowExternalProviders: false,
        acceptedMethods: body.acceptedMethods ?? ["card"],
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
