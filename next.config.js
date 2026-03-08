const headers = require('./headers');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return headers;
  },
};

module.exports = nextConfig;
