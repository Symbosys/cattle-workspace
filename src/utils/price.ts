/**
 * Safely parses price value from various types (string, number, or Decimal.js object structure)
 * and formats it according to en-IN locale format.
 */

export function parsePrice(price: any): number {
  if (price === null || price === undefined) {
    return 0;
  }

  if (typeof price === "number") {
    return price;
  }

  if (typeof price === "string") {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (typeof price === "object") {
    // Check if it's a decimal.js serialized object: has 'd', 'e', and 's'
    if (Array.isArray(price.d) && typeof price.e === "number" && typeof price.s === "number") {
      const { s, e, d } = price;
      if (d.length === 0) return 0;

      const d0Str = d[0].toString();
      const L0 = d0Str.length;

      let sum = 0;
      for (let i = 0; i < d.length; i++) {
        const power = e - L0 + 1 - 7 * i;
        sum += d[i] * Math.pow(10, power);
      }
      return Number((s * sum).toFixed(4));
    }

    // Check if it has a custom toString method that doesn't return [object Object]
    if (typeof price.toString === "function") {
      const str = price.toString();
      if (str !== "[object Object]") {
        const parsed = parseFloat(str);
        return isNaN(parsed) ? 0 : parsed;
      }
    }
  }

  return 0;
}

export function formatPrice(price: any): string {
  const parsed = parsePrice(price);
  return parsed.toLocaleString("en-IN");
}
