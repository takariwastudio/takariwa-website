import { SITE_RIF } from "@/lib/site";

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/takariwa.studio", label: "Instagram" },
  { href: "https://www.linkedin.com/company/takariwa-studio/", label: "LinkedIn" },
  { href: "https://www.facebook.com/takariwa.studio", label: "Facebook" },
  { href: "https://wa.me/584226340416", label: "WhatsApp" },
];

/**
 * Footer canónico — 3 columnas: Takariwa a la izquierda, RIF centrado, links a la derecha.
 * Reemplaza el uso suelto de SocialLinksBar en páginas internas para mantener el orden original.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-col gap-4 border-t border-paper/20 pt-4 md:mt-24 md:flex-row md:items-center md:justify-between">
      {/* Izquierda — como en SocialLinksBar original */}
      <div className="font-body text-center text-[10px] leading-tight text-paper uppercase md:flex-1 md:text-left">
        <p>Takariwa • Estudio creativo</p>
        <p>Maracay - Aragua</p>
      </div>

      {/* Centro — RIF */}
      <p className="font-body order-first text-center text-[10px] tracking-[0.14em] text-paper/60 uppercase md:order-none md:flex-none">
        RIF {SITE_RIF}
      </p>

      {/* Derecha — links */}
      <nav
        className="flex flex-1 flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end"
        aria-label="Redes sociales"
      >
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
