/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        defaultLocale: "ru",
        locales: ["en", "ru", "kz"]
    },
    images: {
        domains: ['probody.kz']
    }
}

export default nextConfig
