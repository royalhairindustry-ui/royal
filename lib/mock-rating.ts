// Deterministic placeholder ratings until a real reviews model exists.
// Seeded by product id so the same product always shows the same rating/count.
export function getMockRating(seed: number) {
  const ratingNoise = Math.sin(seed * 999.73) * 10000;
  const ratingFrac = ratingNoise - Math.floor(ratingNoise);
  const rating = Math.round((3.6 + ratingFrac * 1.4) * 10) / 10;

  const countNoise = Math.sin(seed * 431.17) * 10000;
  const countFrac = countNoise - Math.floor(countNoise);
  const reviewCount = Math.floor(8 + countFrac * 230);

  return { rating, reviewCount };
}
