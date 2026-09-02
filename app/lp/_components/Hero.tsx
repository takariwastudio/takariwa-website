import SocialLinksBar from "../../_components/SocialLinksBar";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-ink px-6 pt-6 pb-6 md:px-12 md:pt-10 md:pb-10"
    >
      <video
        src="/Hiro.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/60" />

      <header className="relative flex justify-center md:justify-end md:pr-25">
        <img
          src="/logo.svg"
          alt="Takariwa Studio"
          className="h-10 w-auto md:h-14"
        />
      </header>

      <div className="relative flex flex-1 flex-col justify-end gap-6 pt-16 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-8">
        <h1 className="font-display text-[2.75rem] leading-[0.92] text-paper sm:text-[3.5rem] md:text-[5rem] xl:text-[6rem] xl:leading-[0.92]">
          <span className="block">Más que un estudio.</span>
          <span className="block">Somos lo que necesitas</span>
        </h1>

        <p className="max-w-xs font-body text-sm leading-snug text-paper uppercase md:pb-2 md:text-base">
          Diseñamos marcas con alma, plataformas que funcionan y contenido que
          deja huella. Creatividad con visión pura y elocuente, desde Maracay
          para proyectar negocios sin fronteras.
        </p>
      </div>

      <footer className="relative mt-8 border-t border-paper/20 pt-4">
        <SocialLinksBar />
      </footer>
    </section>
  );
}
