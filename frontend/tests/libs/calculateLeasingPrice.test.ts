import { test, expect } from "vitest";
import { calculateLeasingPrice } from "../../src/lib/calculateLeasingPrice";

test("calculates low basePrice", () => {
  const months = 12;
  const basePrice = 12;

  const leasingPrice = calculateLeasingPrice(months, basePrice);

  expect(leasingPrice).toBe("0.08");
});

test("calculates zero basePrice", () => {
  const months = 12;
  const basePrice = 0;

  const leasingPrice = calculateLeasingPrice(months, basePrice);

  expect(leasingPrice).toBe("0.00");
});

test("calculates zero months", () => {
  const months = 0;
  const basePrice = 1200;

  const leasingPrice = calculateLeasingPrice(months, basePrice);

  expect(leasingPrice).toBe("1,200.00");
});

test("calculates negative months", () => {
  const months = -9;
  const basePrice = 1900;

  const leasingPrice = calculateLeasingPrice(months, basePrice);

  expect(leasingPrice).toBe("1,900.00");
});

test("calculates negative basePrice", () => {
  const months = 24;
  const basePrice = -5000;

  const leasingPrice = calculateLeasingPrice(months, basePrice);

  expect(leasingPrice).toBe("0.00");
});

test("calculates negative basePrice and months", () => {
  const months = -48;
  const basePrice = -3210;

  const leasingPrice = calculateLeasingPrice(months, basePrice);

  expect(leasingPrice).toBe("0.00");
});

test("retrieves correct output format", () => {
  const months = 48;
  const basePrice = 3210;

  const leasingPrice = calculateLeasingPrice(months, basePrice);

  expect(leasingPrice).toEqual("38.18");
});