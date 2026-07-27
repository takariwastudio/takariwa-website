import { Fragment } from "react";

type MarqueeItem = {
  text: string;
  color: string;
};

const MARQUEE_ITEMS: MarqueeItem[] = [
  { text: "AÚN ARMANDO EL DESORDEN", color: "var(--color-yellow)" },
  { text: "CASI LISTO (LO JURAMOS POR EL CAFÉ)", color: "var(--color-orange)" },
  { text: "PIXEL POR PIXEL, CAOS POR CAOS", color: "var(--color-magenta)" },
  { text: "DISTURBIO CREATIVO EN PROGRESO", color: "var(--color-purple)" },
  { text: "PACIENCIA, ESTO VALE LA PENA", color: "var(--color-blue)" },
];

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.37-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
        fill="currentColor"
      />
      <path
        d="M12.03 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.19-1.36a9.94 9.94 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.53 2 12.03 2Zm0 18.2h-.01a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.08.81.82-3-.2-.31a8.28 8.28 0 1 1 6.97 3.83Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.5 6.5 12 12.75l8.5-6.25"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.75"
        y="2.75"
        width="18.5"
        height="18.5"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7.6 10.2v6.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="7.6" cy="7.4" r="1.15" fill="currentColor" />
      <path
        d="M10.9 16.8v-4.1c0-1.4.85-2.5 2.25-2.5 1.35 0 2.15.9 2.15 2.55v4.05"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9 10.2v6.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MarqueeTrack() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-track flex w-max items-center gap-4 md:gap-5">
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap font-display text-[0.95rem] tracking-[0.04em] text-ink md:text-lg md:tracking-[0.05em]">
            {item.text}
          </span>
          <span
            className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ background: item.color }}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/logo-fondo.svg"
          alt=""
          className="absolute -bottom-[18%] -right-[32%] w-[130vw] max-w-none opacity-90 md:-bottom-[14%] md:-right-[12%] md:w-[62vw] xl:-bottom-[20%] xl:-right-[6%] xl:w-[48vw]"
        />
      </div>

      <header className="relative z-20 flex shrink-0 justify-center pt-4 md:pt-6">
        <img
          src="/logo.svg"
          alt="Takariwa Studio"
          className="h-8 w-auto md:h-20"
        />
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center md:gap-6">
        <span className="font-body text-[0.7rem] tracking-[0.24em] text-yellow uppercase md:text-xs md:tracking-[0.28em]">
          Aviso oficial (más o menos)
        </span>

        <h1 className="headline font-display text-[2.75rem] leading-[0.92] text-paper sm:text-[4.5rem] md:text-[7rem] xl:text-[9rem]">
          <span data-text="Próximamente">Próximamente</span>
        </h1>

        <p className="max-w-[28rem] font-body text-[0.85rem] leading-snug text-paper/80 md:max-w-[34rem] md:text-lg md:leading-relaxed">
          Estamos puliendo pixeles, discutiendo tipografías y fingiendo que el
          café no entra en el presupuesto.{" "}
          <strong className="font-semibold text-paper">
            La página ya viene
          </strong>
          , pero mientras tanto no te vamos a dejar con las ganas: cuéntanos qué
          se te ocurrió.
        </p>

        <nav
          className="mt-1 grid w-full max-w-xs grid-cols-2 gap-2 sm:max-w-none sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2.5"
          aria-label="Formas de contacto"
        >
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow px-4 py-3 font-body text-[0.8rem] font-semibold text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-paper focus-visible:outline-offset-2 md:px-5 md:py-3.5 md:text-sm [&_svg]:h-[1.1rem] [&_svg]:w-[1.1rem]"
            href="https://wa.me/584226340416"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            Hablemos
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-4 py-3 font-body text-[0.8rem] font-semibold text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-paper focus-visible:outline-offset-2 md:px-5 md:py-3.5 md:text-sm [&_svg]:h-[1.1rem] [&_svg]:w-[1.1rem]"
            href="mailto:hola@takariwa.studio"
          >
            <MailIcon />
            Escríbenos
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-magenta px-4 py-3 font-body text-[0.8rem] font-semibold text-paper transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-paper focus-visible:outline-offset-2 md:px-5 md:py-3.5 md:text-sm [&_svg]:h-[1.1rem] [&_svg]:w-[1.1rem]"
            href="https://www.instagram.com/takariwa.studio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            Ve el caos
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-4 py-3 font-body text-[0.8rem] font-semibold text-paper transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-paper focus-visible:outline-offset-2 md:px-5 md:py-3.5 md:text-sm [&_svg]:h-[1.1rem] [&_svg]:w-[1.1rem]"
            href="https://www.linkedin.com/company/takariwa-studio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            Lo formal
          </a>
        </nav>
      </main>

      <div
        className="marquee relative z-20 shrink-0 overflow-hidden border-t border-ink/10 bg-paper py-2"
        aria-hidden="true"
      >
        <MarqueeTrack />
      </div>
    </div>
  );
}
