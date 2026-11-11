// unit tests for the display helpers in format.ts

import { describe, expect, it } from "vitest";
import { formatMW } from "./format";

describe("formatMW", () => {
    it("uses 2 decimals and thousands separators", () => {
        expect(formatMW(4540.909090909)).toBe("4,540.91");
        expect(formatMW(7000)).toBe("7,000.00");
        expect(formatMW(0)).toBe("0.00");
    });

    it("never shows negative zero from float noise", () => {
        expect(formatMW(-1e-12)).toBe("0.00");
    });
});