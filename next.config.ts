import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default es 1MB — muy poco para subir varias imágenes de galería a
      // la vez (hero + gallery uploads en /admin/trabajos). 20MB da
      // margen para un lote de varias fotos sin exagerar.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
