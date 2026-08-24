import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin | Takariwa Studio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // flex-col en mobile: la barra superior (dentro de AdminSidebar) queda
    // arriba y el contenido debajo, apilados. md:flex-row: layout de
    // columna normal, sidebar a la izquierda, contenido a la derecha.
    <div className="admin flex min-h-dvh flex-col bg-background text-foreground md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
