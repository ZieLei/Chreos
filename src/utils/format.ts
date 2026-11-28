const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export function formatPeso(amount: number): string {
  return peso.format(amount);
}

// Local date as YYYY-MM-DD ("en-CA" happens to use that order)
export function today(): string {
  return new Date().toLocaleDateString("en-CA");
}
