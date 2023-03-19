/** @type {import('next').NextConfig} */

const rewrites = () => { 
  return [
    {
      source: "/auth/:path*",
      destination: "http://localhost:5000/auth/:path*"
    }
  ]
}

const nextConfig = {
  reactStrictMode: true,
  rewrites
}

module.exports = nextConfig
