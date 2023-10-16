/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/graphql",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://www.amaktala.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,OPTIONS,DELETE,PUT",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
