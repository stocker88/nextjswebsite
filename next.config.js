const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase) => {
  const isProduction = phase === PHASE_PRODUCTION_BUILD;

  return {
    assetPrefix: isProduction ? 'https://www.hellostocker.com/' : '', // Replace with your CDN URL
    generateBuildId: async () => {
      // Custom build ID to include a content hash
      if (isProduction) {
        return require('crypto').randomBytes(16).toString('hex');
      }
    },
    // Other Next.js configurations...
  };
};
