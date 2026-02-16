const DEFAULT_CC_FEE_RATE = 2.9;

export function calculateCcFee(amount: number, rate = DEFAULT_CC_FEE_RATE) {
  if (rate <= 0 || amount <= 0) return { ccFeeAmount: 0, ccFeeRate: 0 };
  return {
    ccFeeAmount: Math.round(amount * (rate / 100) * 100) / 100,
    ccFeeRate: rate,
  };
}
