import { NextRequest, NextResponse } from "next/server";

// GET /api/estimate-pages/[id]/payment/status - Check payment status (public, no auth)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json({ error: "paymentId query parameter is required" }, { status: 400 });
  }

  // TODO: When payments table is created, look up the payment record:
  //
  // const supabase = await createClient();
  //
  // const { data: payment } = await supabase
  //   .from("estimate_page_payments")
  //   .select("id, page_id, provider, status, amount, currency, deposit_or_full, paid_at, created_at")
  //   .eq("id", paymentId)
  //   .eq("page_id", id)
  //   .single();
  //
  // if (!payment) {
  //   return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  // }
  //
  // For Stripe, check the latest status:
  // if (payment.provider === "stripe" && payment.provider_payment_id) {
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  //   const intent = await stripe.paymentIntents.retrieve(payment.provider_payment_id);
  //   // Sync status if changed
  // }
  //
  // return NextResponse.json({
  //   paymentId: payment.id,
  //   pageId: payment.page_id,
  //   provider: payment.provider,
  //   status: payment.status,
  //   amount: payment.amount,
  //   currency: payment.currency,
  //   depositOrFull: payment.deposit_or_full,
  //   paidAt: payment.paid_at,
  //   createdAt: payment.created_at,
  // });

  // Placeholder until payments table is created
  return NextResponse.json({
    paymentId,
    pageId: id,
    status: "pending",
    message: "Payment processing not yet configured",
  }, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
  });
}
