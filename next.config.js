// next.config.js
module.exports = {
  async headers() {
    return [
      {
        // Cache-Control for immutable assets (JavaScript, CSS, images, etc.)
        source: "/_next/static/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache-Control for Server-Side Rendered (SSR) pages
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=1, stale-while-revalidate",
          },
        ],
      },
      // Add more header configurations if needed
    ];
  },
};
