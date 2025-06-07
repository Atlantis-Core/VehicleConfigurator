import { test, expect } from "vitest";
import { formatCurrency } from "../../src/lib/formatCurrency";

test("formats currency for German locale", () => {
  const amount = 1234;

  const result = formatCurrency(amount);

  expect(result).toBe("1.234 €");
});

test("formats zero amount", () => {
  expect(formatCurrency(0)).toBe("0 €");
});

test("formats large numbers correctly", () => {
  expect(formatCurrency(1000000)).toBe("1.000.000 €");
});
