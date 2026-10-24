// Test-side copy of the product catalogue in shop.js, keyed by the names shoppers see.
// Keep in sync with PRODUCTS in shop.js when products are added or renamed.
export const STORAGE_KEY = 'prepshop-basket';

export const PRODUCTS = {
  'dehydrated-water': { name: 'Dehydrated Water', price: 19.99, url: '/product-dehydrated-water.html' },
  'tinfoil-cap': { name: 'Tinfoil Thinking Cap', price: 12.5, url: '/product-tinfoil-cap.html' },
  'canned-optimism': { name: 'Canned Optimism', price: 7.77, url: '/product-canned-optimism.html' }
};

export function productId(name) {
  const id = Object.keys(PRODUCTS).find((key) => PRODUCTS[key].name === name);
  if (!id) {
    throw new Error(`Unknown product "${name}". Known products: ${Object.values(PRODUCTS).map((p) => p.name).join(', ')}`);
  }
  return id;
}
