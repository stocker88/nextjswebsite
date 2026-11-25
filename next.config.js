const stocks = require('./data/stocks.json');
module.exports = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  async redirects() {return [{source:'/tools',destination:'/trading-tools/',permanent:true},{source:'/guides/stocks-to-buy-now-canada',destination:'/guides/investing-across-countries/',permanent:true},{source:'/guides/stocks-to-buy-now-ai-review',destination:'/guides/stocks-to-buy-now-research-review/',permanent:true},{source:'/stocks-to-buy-now/:path*',destination:'/stock-market-news/:path*',permanent:true}, ...stocks.map(stock=>({source:`/web-app/financial/${stock.ticker}`,destination:`/stocks/${stock.slug}`,permanent:true}))];},
}
