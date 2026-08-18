import { Resend } from "resend";
import type { BriefFormData, BriefType } from "@/app/briefs/_shared/types";
import { BRIEF_TYPE_LABEL } from "@/app/briefs/_shared/types";

const SITE_URL = "https://takariwa.studio";

export async function notifyNewBrief(
  type: BriefType,
  id: string,
  empresa: string,
  contacto: string,
  email: string,
  data: BriefFormData,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;

  if (!apiKey || !to) {
    console.warn(
      "RESEND_API_KEY o NOTIFY_EMAIL no configurados — se omite la notificación por correo.",
    );
    return;
  }

  const resend = new Resend(apiKey);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const adminUrl = `${SITE_URL}/admin/briefs/${id}`;
  const label = BRIEF_TYPE_LABEL[type];

  const preview =
    type === "web"
      ? String(data.objetivo_principal ?? "")
      : type === "diseno"
        ? String(data.origen_marca ?? data.alma_marca ?? "")
        : type === "social"
          ? String(data.a_que_se_dedican ?? "")
          : String(data.mensaje_clave ?? data.objetivo_principal ?? "");

  try {
    await resend.emails.send({
      from:
        process.env.NOTIFY_FROM ?? "Briefs Takariwa <onboarding@resend.dev>",
      to,
      ...(isValidEmail ? { replyTo: email } : {}),
      subject: `Nuevo brief de ${label.toLowerCase()}: ${empresa}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p style="font-size: 12px; letter-spacing: 0.1em; color: #f48115; text-transform: uppercase; margin: 0 0 4px;">
            Nuevo brief de ${label.toLowerCase()}
          </p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">${empresa}</h1>
          <p style="margin: 4px 0;"><strong>Contacto:</strong> ${contacto || "—"} ${email ? `(${email})` : ""}</p>
          ${preview ? `<p style="margin: 4px 0;"><strong>Vistazo:</strong> ${preview}</p>` : ""}
          <p style="margin: 20px 0;">
            <a href="${adminUrl}" style="background: #f48115; color: #131313; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 600;">
              Ver brief completo
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Error enviando notificación de brief:", err);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function notifyNewContact(
  nombre: string,
  telefono: string,
  email: string,
  mensaje: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;

  if (!apiKey || !to) {
    console.warn(
      "RESEND_API_KEY o NOTIFY_EMAIL no configurados — se omite la notificación por correo.",
    );
    return { sent: false };
  }

  const resend = new Resend(apiKey);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const safeNombre = escapeHtml(nombre);
  const safeTelefono = escapeHtml(telefono);
  const safeEmail = escapeHtml(email);
  const safeMensaje = escapeHtml(mensaje);

  try {
    await resend.emails.send({
      from:
        process.env.NOTIFY_FROM ?? "Briefs Takariwa <onboarding@resend.dev>",
      to,
      ...(isValidEmail ? { replyTo: email } : {}),
      subject: `Nuevo contacto desde la web: ${nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p style="font-size: 12px; letter-spacing: 0.1em; color: #f48115; text-transform: uppercase; margin: 0 0 4px;">
            Nuevo contacto desde la web
          </p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">${safeNombre}</h1>
          <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${safeTelefono || "—"}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${safeEmail || "—"}</p>
          <p style="margin: 20px 0 4px;"><strong>Mensaje:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${safeMensaje}</p>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    console.error("Error enviando notificación de contacto:", err);
    return { sent: false };
  }
}
