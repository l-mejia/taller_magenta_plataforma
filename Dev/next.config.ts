import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // permite abrir `npm run dev` desde el celular en la misma red WiFi (http://<IP-de-la-PC>:3000)
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*"],
};

export default nextConfig;
