module.exports = {
  async redirects() {
    return [
      {
        source: '/how_to_be_a_millionaire',
        destination: '/compoundinterest',
        permanent: true
      },
      {
        source: '/attribution_profit_drivers',
        destination: '/attribution_profit_drivers',
        permanent: true
      },
    ]
  },
}
