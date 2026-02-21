/**
 * Test the implementation of applyAdvantageToHitChance to verify that the
 * results are correct.
 */

import { test, describe, expect } from "vitest";
import { applyAdvantageToHitChance as apply } from "../src/calc/hit";
import { Advantage } from "d20attack.js";

describe("verify hit chance calculations", () => {
  test("test normal", () => {
    const { hit, miss, crit } = apply(Advantage.Normal, 0.35, 0.6, 0.05);

    expect(crit).closeTo(0.05, 1e-6);
    expect(miss).closeTo(0.35, 1e-6);
    expect(hit).closeTo(0.6, 1e-6);
    expect(crit + miss + hit).toEqual(1.0);
  });

  test("test advantage", () => {
    const { hit, miss, crit } = apply(Advantage.Advantage, 0.35, 0.6, 0.05);

    expect(crit).closeTo(0.0975, 1e-6);
    expect(miss).closeTo(0.1225, 1e-6);
    expect(hit).closeTo(0.78, 1e-6);
    expect(crit + miss + hit).toEqual(1.0);
  });

  test("test disadvantage", () => {
    const { hit, miss, crit } = apply(Advantage.Disadvantage, 0.35, 0.6, 0.05);

    expect(crit).closeTo(0.0025, 1e-6);
    expect(miss).closeTo(0.5775, 1e-6);
    expect(hit).closeTo(0.42, 1e-6);
    expect(crit + miss + hit).toEqual(1.0);
  });

  test("test elven accuracy", () => {
    const { hit, miss, crit } = apply(Advantage.ElvenAccuracy, 0.35, 0.6, 0.05);

    expect(crit).closeTo(0.142625, 1e-6);
    expect(miss).closeTo(0.042875, 1e-6);
    expect(hit).closeTo(0.8145, 1e-6);
    expect(crit + miss + hit).toEqual(1.0);
  });
});

describe("verify hit chance calculations fifty-fifty", () => {
  test("test normal", () => {
    const { hit, miss, crit } = apply(Advantage.Normal, 0.5, 0.5, 0.0);

    expect(crit).toEqual(0.0);
    expect(miss).toEqual(0.5);
    expect(hit).toEqual(0.5);
    expect(crit + miss + hit).toEqual(1.0);
  });

  test("test advantage", () => {
    const { hit, miss, crit } = apply(Advantage.Advantage, 0.5, 0.5, 0.0);

    expect(crit).toEqual(0.0);
    expect(miss).toEqual(0.25);
    expect(hit).toEqual(0.75);
    expect(crit + miss + hit).toEqual(1.0);
  });

  test("test disadvantage", () => {
    const { hit, miss, crit } = apply(Advantage.Disadvantage, 0.5, 0.5, 0.0);

    expect(crit).toEqual(0.0);
    expect(miss).toEqual(0.75);
    expect(hit).toEqual(0.25);
    expect(crit + miss + hit).toEqual(1.0);
  });

  test("test elven accuracy", () => {
    const { hit, miss, crit } = apply(Advantage.ElvenAccuracy, 0.5, 0.5, 0.0);

    expect(crit).toEqual(0.0);
    expect(miss).toEqual(0.125);
    expect(hit).toEqual(0.875);
    expect(crit + miss + hit).toEqual(1.0);
  });
});
