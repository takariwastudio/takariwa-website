import { getClients } from "@/lib/clients";
import ClientesMarquee from "./ClientesMarquee";

export default async function Clientes() {
  const clients = await getClients();

  return (
    <section
      id="clientes"
      className="flex min-h-dvh flex-col justify-center gap-10 bg-ink py-20 md:justify-start md:py-0 md:pt-[401px]"
    >
      <div className="px-6 md:px-12">
        <p className="font-body text-xl text-yellow uppercase md:text-2xl">
          Nuestros clientes
        </p>
        <div className="mt-3 border-t border-yellow/40 md:mt-4" />
      </div>

      <ClientesMarquee clients={clients} />
    </section>
  );
}
