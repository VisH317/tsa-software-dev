/** @type {import('next').NextConfig} */

const rewrites = () => { 
  return [
    {
      source: "/auth/:path*",
      destination: "http://127.0.0.1:5000/auth/:path*"
    },
    {
      source: "/api/:path*",
      destination: "http://127.0.0.1:5001/api/:path*"
    }
  ]
}

const nextConfig = {
  reactStrictMode: true,
  rewrites
}

module.exports = nextConfig
