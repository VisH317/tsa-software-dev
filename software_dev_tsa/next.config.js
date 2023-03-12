/** @type {import('next').NextConfig} */

const rewrites = [
  {
    source: "/auth",
    destination: "http://localhost:5000"
  }
]

const nextConfig = {
  reactStrictMode: true,
  rewrites
}

module.exports = nextConfig
