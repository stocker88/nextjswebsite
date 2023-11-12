module.exports = {
  async redirects() {
    return [
      {
        source: '/posts/how_to_be_a_millionnaire',
        destination: '/posts/compoundinterest',
        permanent: true
      },
      {
        source: '/posts/attribution_profit_drivers',
        destination: '/posts/stockstobuy',
        permanent: true
      },
    ]
  },
}
