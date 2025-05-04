export const calculateLeasingPrice = (months: number, basePrice: number): string => {
  // Dynamic interest rate calculation based on term length
  const baseRate = 0.025; // 2.5% base rate
  const termAdjustment = (48 - months) * 0.0005; // Shorter terms have higher rates
  const finalRate = baseRate + termAdjustment;

  // Calculate down payment (percentage decreases for longer terms)
  const downPaymentPercentage =
    months === 12 ? 0.2 : months === 24 ? 0.15 : months === 36 ? 0.1 : 0.05;
  const downPayment = basePrice * downPaymentPercentage;

  // Adjust for residual value (percentage increases for shorter terms)
  const residualValuePercentage =
    months === 12 ? 0.75 : months === 24 ? 0.65 : months === 36 ? 0.55 : 0.45;
  const residualValue = basePrice * residualValuePercentage;

  // Calculate amortized amount
  const amortizedAmount = basePrice - downPayment - residualValue;

  // Calculate monthly payment using proper leasing formula
  const monthlyInterest = finalRate / 12;
  const monthlyPayment =
    (amortizedAmount * monthlyInterest) /
      (1 - Math.pow(1 + monthlyInterest, -months)) +
    residualValue * monthlyInterest;

  return monthlyPayment.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
