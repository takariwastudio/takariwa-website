import ContactForm from "./ContactForm";
import SocialLinksBar from "../../_components/SocialLinksBar";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "./icons";

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="relative bg-ink px-6 pt-16 pb-8 md:px-12 md:pt-24"
    >
      <div className="flex justify-center md:justify-end md:pr-36">
        <img
          src="/logo.svg"
          alt="Takariwa Studio"
          className="h-10 w-auto md:h-14"
        />
      </div>

      <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-start md:gap-16 md:pr-[10%]">
        <h2 className="font-display text-[2.75rem] leading-[0.92] text-paper sm:text-[3.5rem] md:mt-auto md:text-[5rem] xl:text-[6rem]">
          <span className="block">Que tu marca empiece</span>
          <span className="block">a hacer ruido</span>
        </h2>

        <div className="flex w-full flex-col items-start gap-4 md:w-auto md:items-end">
          <ContactForm />

          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="font-body text-[10px] text-paper uppercase">
              O si prefieres escríbenos directamente a:
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                className="inline-flex items-center gap-1.5 bg-magenta px-2.5 py-1.5 font-body text-[10px] text-paper uppercase transition-opacity hover:opacity-90"
                href="https://www.instagram.com/takariwa.studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="h-3 w-3" />
                Instagram ›
              </a>
              <a
                className="inline-flex items-center gap-1.5 bg-yellow px-2.5 py-1.5 font-body text-[10px] text-ink uppercase transition-opacity hover:opacity-90"
                href="https://wa.me/584226340416"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-3 w-3" />
                WhatsApp ›
              </a>
              <a
                className="inline-flex items-center gap-1.5 bg-orange px-2.5 py-1.5 font-body text-[10px] text-ink uppercase transition-opacity hover:opacity-90"
                href="mailto:hola@takariwa.studio"
              >
                <MailIcon className="h-3 w-3" />
                Email ›
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-paper/20 pt-4 md:mt-24">
        <SocialLinksBar />
      </div>
    </footer>
  );
}
