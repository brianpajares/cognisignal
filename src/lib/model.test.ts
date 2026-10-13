import { describe, expect, it } from "vitest";
import vectors from "../../spec/test_vectors.json";
import { calculate, validateInput } from "./model";

type Golden = { id: string; inputs: Parameters<typeof calculate>[0]; expected: Record<string, unknown> };
const cases = (vectors as { cases: Golden[] }).cases;

function expectParity(actual: unknown, expected: unknown, path = "$"): void {
  if (typeof expected === "number") {
    expect(actual, path).toEqual(expect.any(Number));
    expect(Math.abs(Number(actual) - expected), `${path}: ${String(actual)} != ${expected}`).toBeLessThanOrEqual(1e-9 + 1e-6 * Math.abs(expected));
  } else if (Array.isArray(expected)) {
    expect(actual, path).toHaveLength(expected.length);
    expected.forEach((item, i) => expectParity((actual as unknown[])[i], item, `${path}[${i}]`));
  } else if (expected !== null && typeof expected === "object") {
    expect(actual, path).toBeTypeOf("object");
    for (const [key, value] of Object.entries(expected)) expectParity((actual as Record<string, unknown>)[key], value, `${path}.${key}`);
  } else {
    expect(actual, path).toEqual(expected);
  }
}

describe("CS-LCM v1.0 golden vectors", () => {
  it("matches all 20 serialized cases and always remains non-clinical", () => {
    expect(cases).toHaveLength(20);
    for (const testCase of cases) {
      const actual = calculate(testCase.inputs);
      expectParity(actual, testCase.expected, testCase.id);
      expect(actual.clinical_probability).toBeNull();
      expect(actual.is_clinical_probability).toBe(false);
    }
  });

  it("rejects impossible and repeated dates and unknown properties", () => {
    const source = structuredClone(cases[0].inputs);
    const impossible = structuredClone(source);
    impossible.sessions[0].date = "2026-02-30";
    expect(() => validateInput(impossible)).toThrow();
    const repeated = structuredClone(source);
    repeated.sessions[1].date = repeated.sessions[0].date;
    expect(() => validateInput(repeated)).toThrow();
    expect(() => validateInput({ ...source, unexpected: true })).toThrow();
  });
});
