export default function SocialLinksBar() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="font-body text-[10px] leading-tight text-paper uppercase">
        <p>Takariwa • Estudio creativo</p>
        <p>Maracay - Aragua</p>
      </div>

      <nav
        className="flex flex-wrap gap-x-6 gap-y-2"
        aria-label="Redes sociales"
      >
        <a
          className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
          href="https://www.instagram.com/takariwa.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
          href="https://www.linkedin.com/company/takariwa-studio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
          href="https://www.facebook.com/takariwa.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a
          className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
          href="https://wa.me/584226340416"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </nav>
    </div>
  );
}
