import { Resend } from "resend";
import type { BriefFormData } from "@/app/briefs/web_brief/steps";

const SITE_URL = "https://takariwa.studio";

export async function notifyNewBrief(id: string, data: BriefFormData) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;

  // Si no hay API key configurada, no rompemos el envío del brief —
  // solo se omite la notificación (útil en desarrollo local sin Resend).
  if (!apiKey || !to) {
    console.warn(
      "RESEND_API_KEY o NOTIFY_EMAIL no configurados — se omite la notificación por correo.",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const empresa = String(data.empresa ?? "Sin nombre");
  const contacto = String(data.contacto ?? "");
  const email = String(data.email ?? "");
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const tipoSitio = Array.isArray(data.tipo_sitio)
    ? data.tipo_sitio.join(", ")
    : "";
  const objetivo = String(data.objetivo_principal ?? "");
  const adminUrl = `${SITE_URL}/admin/briefs/${id}`;

  try {
    await resend.emails.send({
      from:
        process.env.NOTIFY_FROM ?? "Briefs Takariwa <onboarding@resend.dev>",
      to,
      // Resend rechaza el envío completo si reply_to no tiene formato válido —
      // mejor omitirlo que perder la notificación por un typo del cliente.
      ...(isValidEmail ? { replyTo: email } : {}),
      subject: `Nuevo brief: ${empresa}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p style="font-size: 12px; letter-spacing: 0.1em; color: #f48115; text-transform: uppercase; margin: 0 0 4px;">
            Nuevo brief de proyecto web
          </p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">${empresa}</h1>
          <p style="margin: 4px 0;"><strong>Contacto:</strong> ${contacto} (${email})</p>
          ${tipoSitio ? `<p style="margin: 4px 0;"><strong>Tipo de sitio:</strong> ${tipoSitio}</p>` : ""}
          ${objetivo ? `<p style="margin: 4px 0;"><strong>Objetivo:</strong> ${objetivo}</p>` : ""}
          <p style="margin: 20px 0;">
            <a href="${adminUrl}" style="background: #f48115; color: #131313; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 600;">
              Ver brief completo
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    // Un fallo en el correo nunca debe tumbar el envío del brief — ya está
    // guardado en Supabase, que es lo que importa. Solo lo logueamos.
    console.error("Error enviando notificación de brief:", err);
  }
}
