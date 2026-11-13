/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */

function calculateSimpleRevenue(purchase, _product) {
// Расчет выручки от операции
  const { sale_price, quantity, discount } = purchase;
  const discountFactor = 1 - discount / 100;

  return sale_price * quantity * discountFactor;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */

function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */

function analyzeSalesData(data, options) {
  // Проверка входных данных
  if (!data
    || !Array.isArray(data.sellers)
    || !Array.isArray(data.products)
    || !Array.isArray(data.purchase_records)
    || data.sellers.length === 0
    || data.products.length === 0
    || data.purchase_records.length === 0
  ) {
    throw new Error('Некорректные входные данные');
  }

// Проверка наличия опций
const { calculateRevenue, calculateBonus } = options || {};

if (typeof calculateRevenue !== 'function' || typeof calculateBonus !== 'function') {
  throw new Error('Отсутствуют обязательные опции');
}

// Подготовка промежуточных данных для сбора статистики
const sellerStats = data.sellers.map(seller => ({
  id: seller.id,
  name: `${seller.first_name} ${seller.last_name}`,
  revenue: 0,
  profit: 0,
  sales_count: 0,
  products_sold: {}
}));

// Индексация продавцов и товаров для быстрого доступа
const sellerIndex = {};
  sellerStats.forEach(seller => {
    sellerIndex[seller.id] = seller;
});

const productIndex = {};
  data.products.forEach(product => {
    productIndex[product.sku] = product;
});

// Расчет выручки и прибыли для каждого продавца
data.purchase_records.forEach(record => {
  const seller = sellerIndex[record.seller_id];

  seller.sales_count += 1;
  seller.revenue += record.total_amount;

  record.items.forEach(item => {
    const product = productIndex[item.sku];

    const itemCost = product.purchase_price * item.quantity;
    const itemRevenue = calculateRevenue(item, product);
    const itemProfit = itemRevenue - itemCost;

    seller.profit += itemProfit;

    if (!seller.products_sold[item.sku]) {
      seller.products_sold[item.sku] = 0;
    }
    seller.products_sold[item.sku] += item.quantity;
  });
});

  // @TODO: Сортировка продавцов по прибыли
  // @TODO: Назначение премий на основе ранжирования
  // @TODO: Подготовка итоговой коллекции с нужными полями
}
