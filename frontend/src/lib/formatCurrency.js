export function formatCurrency(value) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

/** Amazon-style: main amount + superscript cents */
export function formatPriceParts(value) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  const [main, fraction = "00"] = n
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    .split(".");
  return { main: `$${main}`, fraction };
}
