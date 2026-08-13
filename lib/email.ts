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
      : String(data.origen_marca ?? data.alma_marca ?? "");

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
