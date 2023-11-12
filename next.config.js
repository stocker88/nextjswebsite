module.exports = {
  async redirects() {
    return [
      {
        source: '/how_to_be_a_millionnaire',
        destination: '/compoundinterest',
        permanent: true
      },
      {
        source: '/attribution_profit_drivers',
        destination: '/stockstobuy',
        permanent: true
      },
    ]
  },
}
