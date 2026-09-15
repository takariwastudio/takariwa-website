import SiteNav from "./_components/SiteNav";
import Hero from "./lp/_components/Hero";
import LoQueHacemos from "./lp/_components/LoQueHacemos";
import LoQueHacemosDetalle from "./lp/_components/LoQueHacemosDetalle";
import Clientes from "./lp/_components/Clientes";
import Trabajos from "./lp/_components/Trabajos";
import QuienesSomos from "./lp/_components/QuienesSomos";
import Footer from "./lp/_components/Footer";

export default function Homepage() {
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
