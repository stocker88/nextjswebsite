const stocks = require('./data/stocks.json');
module.exports = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  async redirects() {return [{source:'/stocks-to-buy-now/:path*',destination:'/stock-market-news/:path*',permanent:true}, ...stocks.map(stock=>({source:`/web-app/financial/${stock.ticker}`,destination:`/stocks/${stock.slug}`,permanent:true}))];},
}
