/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**.reliefweb.int" },
      { protocol: "https", hostname: "reliefweb.int" },
      { protocol: "https", hostname: "**.unicef.org" },
      { protocol: "https", hostname: "unicef.org" },
      { protocol: "https", hostname: "**.unocha.org" },
      { protocol: "https", hostname: "reports.unocha.org" },
      { protocol: "https", hostname: "**.unhcr.org" },
      { protocol: "https", hostname: "**" },
    ],
  },
  env: {
    NEXT_PUBLIC_ZENO_STREAM_URL: process.env.NEXT_PUBLIC_ZENO_STREAM_URL,
  },
};

export default nextConfig;
