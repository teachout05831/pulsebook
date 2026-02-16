import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/estimate-pages/[id]/payment - Process a payment (public, no auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const body = await request.json();

  // Validate required fields
  if (!body.amount || typeof body.amount !== "number" || body.amount <= 0) {
    return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
  }
  if (!body.depositOrFull || !["deposit", "full", "installment"].includes(body.depositOrFull)) {
    return NextResponse.json({ error: "depositOrFull must be deposit, full, or installment" }, { status: 400 });
  }
  if (!body.customerEmail || typeof body.customerEmail !== "string") {
    return NextResponse.json({ error: "Customer email is required" }, { status: 400 });
  }
  if (!body.customerName || typeof body.customerName !== "string") {
    return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
  }

  // Verify page exists and is active
  const { data: page } = await supabase
    .from("estimate_pages")
    .select("id, company_id, estimate_id, status, is_active, require_deposit, deposit_amount, deposit_type")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  if (page.status === "expired") {
    return NextResponse.json({ error: "This estimate has expired" }, { status: 400 });
  }

  // Validate amount against expected values
  if (body.depositOrFull === "deposit" && page.require_deposit && page.deposit_amount) {
    // For percentage deposits, we trust the client-computed amount
    // but could validate against the estimate total in the future
    if (page.deposit_type === "flat" && body.amount !== page.deposit_amount) {
      return NextResponse.json(
        { error: "Amount does not match expected deposit" },
        { status: 400 }
      );
    }
  }

  // Determine provider (default to internal — platform's own payment system)
  const provider = body.provider || "internal";

  if (!["internal", "stripe", "square"].includes(provider)) {
    return NextResponse.json({ error: "Invalid payment provider" }, { status: 400 });
  }

  // Block external providers unless enabled by platform admin for this company
  // TODO: Look up allowExternalProviders from company_payment_settings table
  if (provider !== "internal") {
    const allowExternalProviders = false;
    if (!allowExternalProviders) {
      return NextResponse.json(
        { error: "External payment providers are not enabled" },
        { status: 403 }
      );
    }
  }

  let providerPaymentId: string | null = null;
  let paymentStatus: "pending" | "processing" | "succeeded" = "pending";
  let clientSecret: string | null = null;

  if (provider === "stripe") {
    const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET) {
      return NextResponse.json({ error: "Stripe payments not configured" }, { status: 503 });
    }
    // TODO: Create Stripe PaymentIntent
    // const stripe = new Stripe(STRIPE_SECRET);
    // const intent = await stripe.paymentIntents.create({
    //   amount: Math.round(body.amount * 100), // Convert to cents
    //   currency: "usd",
    //   payment_method: body.paymentMethodId,
    //   metadata: { pageId: id, estimateId: page.estimate_id },
    // });
    // providerPaymentId = intent.id;
    // clientSecret = intent.client_secret;
    // paymentStatus = "processing";
    return NextResponse.json({ error: "Stripe integration pending implementation" }, { status: 503 });
  }

  if (provider === "square") {
    const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    if (!SQUARE_TOKEN) {
      return NextResponse.json({ error: "Square payments not configured" }, { status: 503 });
    }
    // TODO: Create Square payment
    // const squareClient = new Client({ accessToken: SQUARE_TOKEN });
    // const response = await squareClient.paymentsApi.createPayment({
    //   sourceId: body.paymentMethodId,
    //   amountMoney: { amount: BigInt(Math.round(body.amount * 100)), currency: "USD" },
    //   idempotencyKey: crypto.randomUUID(),
    // });
    // providerPaymentId = response.result.payment?.id ?? null;
    // paymentStatus = "processing";
    return NextResponse.json({ error: "Square integration pending implementation" }, { status: 503 });
  }

  if (provider === "internal") {
    // Internal payment processing — platform's own system
    // This is the primary/default flow
    // TODO: Implement internal payment processing
    // For now, create a pending payment record
    paymentStatus = "pending";
    providerPaymentId = null;
  }

  // Generate a payment ID for tracking
  const paymentId = crypto.randomUUID();

  // Record analytics event: deposit_paid
  await supabase.from("estimate_page_analytics").insert({
    page_id: id,
    event_type: "deposit_paid",
    event_data: {
      paymentId,
      provider,
      amount: body.amount,
      depositOrFull: body.depositOrFull,
      customerEmail: body.customerEmail,
    },
    user_agent: request.headers.get("user-agent") ?? null,
  });

  // Return success structure
  // When the payments table is created, the payment record will be inserted here
  const response: Record<string, unknown> = {
    success: true,
    paymentId,
    provider,
    status: paymentStatus,
    amount: body.amount,
    depositOrFull: body.depositOrFull,
  };

  if (clientSecret) {
    response.clientSecret = clientSecret;
  }

  return NextResponse.json(response);
}
