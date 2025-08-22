import { describe, it, expect } from "bun:test";

import { translatePath } from "~/lib/translatePath";

interface TestCase {
  name: string;
  input: string;
  xOffset: number;
  yOffset: number;
  expected: string;
}

describe("translatePath", () => {
  const testCases: TestCase[] = [
    {
      name: "Simple absolute square",
      input: "M10 10 H90 V90 H10 Z",
      xOffset: 10,
      yOffset: 10,
      expected: "M 20 20 H 100 V 100 H 20 Z",
    },
    {
      name: "Simple relative square",
      input: "m10 10 h80 v80 h-80 z",
      xOffset: 10,
      yOffset: 10,
      expected: "m 20 20 h 80 v 80 h -80 z",
    },
    {
      name: "Complex path with absolute and relative commands",
      input: "M10 10 L50 50 l20 0 Z",
      xOffset: 5,
      yOffset: 5,
      expected: "M 15 15 L 55 55 l 20 0 Z",
    },
    {
      name: "User-provided path (your specific case)",
      input:
        "m19.01 11.55-7.46 7.46c-.46.46-.46 1.19 0 1.65a1.16 1.16 0 0 0 1.64 0l7.46-7.46c.46-.46.46-1.19 0-1.65s-1.19-.46-1.65 0Zm.16-8.21c-.46-.46-1.19-.46-1.65 0L3.34 17.52c-.46.46-.46 1.19 0 1.65a1.16 1.16 0 0 0 1.64 0L19.16 4.99c.46-.46.46-1.19 0-1.65Z",
      xOffset: 10,
      yOffset: 10,
      expected:
        "m 29.01 21.55 -7.46 7.46 c -0.46 0.46 -0.46 1.19 0 1.65 a 1.16 1.16 0 0 0 1.64 0 l 7.46 -7.46 c 0.46 -0.46 0.46 -1.19 0 -1.65 s -1.19 -0.46 -1.65 0 Z m 0.16 -8.21 c -0.46 -0.46 -1.19 -0.46 -1.65 0 L 13.34 27.52 c -0.46 0.46 -0.46 1.19 0 1.65 a 1.16 1.16 0 0 0 1.64 0 L 29.16 14.99 c 0.46 -0.46 0.46 -1.19 0 -1.65 Z",
    },
    {
      name: "Absolute Line commands",
      input: "M10 10 L50 20 L30 40",
      xOffset: 5,
      yOffset: 5,
      expected: "M 15 15 L 55 25 L 35 45",
    },
    {
      name: "Relative Line commands",
      input: "m10 10 l40 10 l-20 20",
      xOffset: 5,
      yOffset: 5,
      expected: "m 15 15 l 40 10 l -20 20",
    },
    {
      name: "Absolute Curve commands",
      input: "M10 10 C20 40 40 40 50 10",
      xOffset: 10,
      yOffset: 10,
      expected: "M 20 20 C 30 50 50 50 60 20",
    },
    {
      name: "Relative Curve commands",
      input: "m10 10 c10 30 30 30 40 0",
      xOffset: 10,
      yOffset: 10,
      expected: "m 20 20 c 10 30 30 30 40 0",
    },
  ];

  for (const test of testCases) {
    it(test.name, () => {
      const transformed = translatePath(test.input, {
        dx: test.xOffset,
        dy: test.yOffset,
      });
      expect(transformed).toBe(test.expected);
    });
  }
});
