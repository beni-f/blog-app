// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.unsplash.com", "ui.aceternity.com", "blog-app-mryd.onrender.com", "https://blog-app-mryd.onrender.com"],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig;
