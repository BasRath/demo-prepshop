'use strict';

(function () {
  const STORAGE_KEY = 'prepshop-basket';
  const MAX_QUANTITY = 99;

  const PRODUCTS = {
    'dehydrated-water': {
      name: 'Dehydrated Water',
      price: 19.99,
      image: 'img/product-dehydrated-water.png',
      url: 'product-dehydrated-water.html'
    },
    'tinfoil-cap': {
      name: 'Tinfoil Thinking Cap',
      price: 12.5,
      image: 'img/product-tinfoil-cap.png',
      url: 'product-tinfoil-cap.html'
    },
    'canned-optimism': {
      name: 'Canned Optimism',
      price: 7.77,
      image: 'img/product-canned-optimism.png',
      url: 'product-canned-optimism.html'
    }
  };

  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  // Basket storage: only known product ids and sane quantities are accepted.
  function readBasket() {
    const basket = {};
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      if (stored && typeof stored === 'object') {
        Object.keys(PRODUCTS).forEach(function (id) {
          const qty = Number(stored[id]);
          if (Number.isInteger(qty) && qty > 0) {
            basket[id] = Math.min(qty, MAX_QUANTITY);
          }
        });
      }
    } catch (e) {
      // Corrupt or unavailable storage: treat as an empty basket.
    }
    return basket;
  }

  function writeBasket(basket) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
    } catch (e) {
      // Storage unavailable (e.g. private mode); basket will not persist.
    }
    updateBasketCount();
  }

  function clearBasket() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore storage errors.
    }
    updateBasketCount();
  }

  function countItems(basket) {
    return Object.keys(basket).reduce(function (sum, id) { return sum + basket[id]; }, 0);
  }

  function updateBasketCount() {
    const count = countItems(readBasket());
    document.querySelectorAll('[data-basket-count]').forEach(function (el) {
      el.textContent = String(count);
    });
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Product page: "Add to Cart" buttons.
  function initAddButtons() {
    document.querySelectorAll('[data-add-to-basket]').forEach(function (button) {
      const id = button.getAttribute('data-add-to-basket');
      if (!Object.prototype.hasOwnProperty.call(PRODUCTS, id)) return;
      const status = document.getElementById('add-status');
      button.addEventListener('click', function () {
        const basket = readBasket();
        basket[id] = Math.min((basket[id] || 0) + 1, MAX_QUANTITY);
        writeBasket(basket);
        if (status) {
          status.textContent = PRODUCTS[id].name + ' added to your basket (' + basket[id] + ' in basket).';
        }
      });
    });
  }

  function buildSummary(basket, list, allowRemove, onChange) {
    list.replaceChildren();
    let total = 0;
    Object.keys(basket).forEach(function (id) {
      const product = PRODUCTS[id];
      const qty = basket[id];
      const lineTotal = product.price * qty;
      total += lineTotal;

      const item = el('li', 'basket-item');
      const img = el('img', 'basket-item-image');
      img.src = product.image;
      img.alt = '';
      img.width = 80;
      img.height = 80;
      const info = el('div', 'basket-item-info');
      const link = el('a', null, product.name);
      link.href = product.url;
      info.append(link, el('p', null, 'Quantity: ' + qty + ' × ' + currency.format(product.price)));
      item.append(img, info, el('p', 'basket-item-total', currency.format(lineTotal)));

      if (allowRemove) {
        const remove = el('button', 'button button-secondary', 'Remove');
        remove.type = 'button';
        remove.setAttribute('aria-label', 'Remove ' + product.name + ' from basket');
        remove.addEventListener('click', function () {
          const current = readBasket();
          delete current[id];
          writeBasket(current);
          onChange(product.name + ' removed from basket.');
        });
        item.append(remove);
      }
      list.append(item);
    });
    return total;
  }

  // Basket page.
  function initBasketPage() {
    const list = document.getElementById('basket-items');
    if (!list) return;
    const empty = document.getElementById('basket-empty');
    const totalEl = document.getElementById('basket-total');
    const clearButton = document.getElementById('clear-basket');
    const checkoutLink = document.getElementById('proceed-checkout');
    const status = document.getElementById('basket-status');

    function render(message) {
      const basket = readBasket();
      const isEmpty = countItems(basket) === 0;
      const total = buildSummary(basket, list, true, render);
      list.hidden = isEmpty;
      empty.hidden = !isEmpty;
      totalEl.hidden = isEmpty;
      totalEl.textContent = 'Total: ' + currency.format(total);
      clearButton.disabled = isEmpty;
      if (isEmpty) {
        checkoutLink.removeAttribute('href');
        checkoutLink.setAttribute('aria-disabled', 'true');
      } else {
        checkoutLink.setAttribute('href', 'checkout.html');
        checkoutLink.removeAttribute('aria-disabled');
      }
      if (message && status) status.textContent = message;
    }

    clearButton.addEventListener('click', function () {
      clearBasket();
      render('All products removed from basket.');
      empty.tabIndex = -1;
      empty.focus();
    });
    render();
  }

  // Checkout page. Form data is never read, sent or stored.
  function initCheckoutPage() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    const empty = document.getElementById('checkout-empty');
    const summary = document.getElementById('checkout-summary');
    const list = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');

    const basket = readBasket();
    if (countItems(basket) === 0) {
      empty.hidden = false;
      return;
    }
    const total = buildSummary(basket, list, false);
    totalEl.textContent = 'Total: ' + currency.format(total);
    summary.hidden = false;
    form.hidden = false;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.reset();
      clearBasket();
      const thanks = el('p', 'thank-you', 'Thank you for your order');
      thanks.id = 'thank-you';
      thanks.tabIndex = -1;
      thanks.setAttribute('role', 'status');
      form.replaceWith(thanks);
      summary.hidden = true;
      thanks.focus();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateBasketCount();
    initAddButtons();
    initBasketPage();
    initCheckoutPage();
  });

  // Keep the basket count in sync across open tabs.
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY || event.key === null) updateBasketCount();
  });
})();
