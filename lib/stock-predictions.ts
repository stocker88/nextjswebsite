import {stocks} from './stocks';
export const predictionName = (stock: (typeof stocks)[number]) => stock.ticker === 'GOOGL' ? 'Google (Alphabet)' : stock.name;
export const predictionSlug = (stock: (typeof stocks)[number]) => (stock.ticker === 'GOOGL' ? 'google' : stock.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) + '-stock-price-prediction';
export const predictionPath = (stock: (typeof stocks)[number]) => '/prediction/' + predictionSlug(stock);
