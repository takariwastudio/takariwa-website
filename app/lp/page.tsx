import Clientes from "./_components/Clientes";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import LoQueHacemos from "./_components/LoQueHacemos";
import LoQueHacemosDetalle from "./_components/LoQueHacemosDetalle";
import QuienesSomos from "./_components/QuienesSomos";
import SiteNav from "../_components/SiteNav";
import Trabajos from "./_components/Trabajos";

export default function HomepagePreview() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <LoQueHacemos />
        <LoQueHacemosDetalle />
        <Clientes />
        <Trabajos />
        <QuienesSomos />
        <Footer />
      </main>
    </>
  );
}
