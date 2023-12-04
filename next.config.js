// next.config.js

module.exports = {
  async headers() {
    return [
      {
        // Define caching headers for _next/static directory
        source: "/_next/static/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
