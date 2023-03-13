/** @type {import('next').NextConfig} */

const rewrites = () => { 
  return [
    {
      source: "/auth/google",
      destination: "http://localhost:5000/auth/google"
    },
    {
      source: "/auth/google/callback",
      destination: "http://localhost:5000/auth/google/callback"
    },
    {
      source: "/auth/local",
      destination: "http://localhost:5000/auth/local"
    },
    {
      source: "/auth/current_user",
      destination: "http://localhost:5000/auth/current_user"
    }
  ]
}

const nextConfig = {
  reactStrictMode: true,
  rewrites
}

module.exports = nextConfig
