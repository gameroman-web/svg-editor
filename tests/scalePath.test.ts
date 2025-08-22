import { describe, it, expect } from "bun:test";

import { scalePath } from "~/lib/scalePath";

interface TestCase {
  name: string;
  input: string;
  scale: number;
  expected: string;
}

describe("scalePath", () => {
  const testCases: TestCase[] = [
    {
      name: "Simple line",
      input: "M 100 100 L 200 200",
      scale: 0.1,
      expected: "M 10 10 L 20 20",
    },
    {
      name: "Horizontal and vertical lines",
      input: "M 50 50 H 150 V 200",
      scale: 0.2,
      expected: "M 10 10 H 30 V 40",
    },
    {
      name: "Arc",
      input: "M 100 100 A 50 50 0 0 1 200 200",
      scale: 0.1,
      expected: "M 10 10 A 5 5 0 0 1 20 20",
    },
    {
      name: "Mixed path",
      input:
        "M 100 100 L 200 100 H 250 V 200 C 250 250 200 250 150 200 A 50 50 0 0 1 100 100",
      scale: 0.1,
      expected:
        "M 10 10 L 20 10 H 25 V 20 C 25 25 20 25 15 20 A 5 5 0 0 1 10 10",
    },
    {
      name: "Mixed path (relative commands)",
      input:
        "m 100 100 l 100 0 h 50 v 100 c 0 50 -50 50 -100 0 a 50 50 0 0 1 -50 -100",
      scale: 0.1,
      expected: "m 10 10 l 10 0 h 5 v 10 c 0 5 -5 5 -10 0 a 5 5 0 0 1 -5 -10",
    },
    {
      name: "Absolute + Relative",
      input: "M 5 5 H 10 V 10 l 10 10 L 5 20 Z",
      scale: 5,
      expected: "M 25 25 H 50 V 50 l 50 50 L 25 100 Z",
    },
  ];

  for (const test of testCases) {
    it(test.name, () => {
      const transformed = scalePath(test.input, { scale: test.scale });
      expect(transformed).toBe(test.expected);
    });
  }
});
