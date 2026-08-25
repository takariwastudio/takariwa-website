import {
  BRIEF_TYPE_LABEL,
  BRIEF_TYPE_COLOR_HEX,
  type BriefFormData,
  type BriefType,
} from "@/app/briefs/_shared/types";
import { statusLabel } from "@/lib/brief-status";
import { SITE_URL } from "@/lib/site";

function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields: { name: string; value: string; inline: boolean }[];
  url: string;
}

async function postToDiscord(webhookUrl: string, embed: DiscordEmbed) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            ...embed,
            footer: { text: "Takariwa Studio, disturbio creativo" },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (err) {
    console.error("Error enviando notificación a Discord:", err);
  }
}

export async function notifyDiscordBrief(
  type: BriefType,
  id: string,
  empresa: string,
  contacto: string,
  email: string,
  data: BriefFormData,
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "DISCORD_WEBHOOK_URL no configurado, se omite la notificación de Discord.",
    );
    return;
  }

  const label = BRIEF_TYPE_LABEL[type];
  const adminUrl = `${SITE_URL}/admin/briefs/${id}`;

  const preview =
    type === "web"
      ? String(data.objetivo_principal ?? "")
      : type === "diseno"
        ? String(data.origen_marca ?? data.alma_marca ?? "")
        : type === "social"
          ? String(data.a_que_se_dedican ?? "")
          : String(data.mensaje_clave ?? data.objetivo_principal ?? "");

  const fields = [
    { name: "Empresa / marca", value: empresa || "—", inline: true },
    { name: "Contacto", value: contacto || "—", inline: true },
  ];
  if (email) fields.push({ name: "Correo", value: email, inline: true });
  if (preview)
    fields.push({
      name: "Vistazo",
      value: preview.slice(0, 200),
      inline: false,
    });

  await postToDiscord(webhookUrl, {
    title: `Nuevo brief de ${label}`,
    description: `**${contacto || "Alguien"}**, de **${empresa}**, llenó el brief de ${label.toLowerCase()}.`,
    color: hexToDecimal(BRIEF_TYPE_COLOR_HEX[type]),
    fields,
    url: adminUrl,
  });
}

/**
 * Notifica un cambio de estado desde el admin (no un brief nuevo). Usa el
 * mismo canal que las alertas de brief nuevo (DISCORD_WEBHOOK_URL) salvo que
 * se defina DISCORD_STATUS_WEBHOOK_URL aparte — así se puede separar a otro
 * canal el día que haga falta, sin tocar código.
 */
export async function notifyDiscordStatusChange(
  type: BriefType,
  id: string,
  empresa: string,
  contacto: string,
  fromStatus: string,
  toStatus: string,
) {
  const webhookUrl =
    process.env.DISCORD_STATUS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "DISCORD_WEBHOOK_URL no configurado, se omite la notificación de cambio de estado.",
    );
    return;
  }

  const adminUrl = `${SITE_URL}/admin/briefs/${id}`;

  await postToDiscord(webhookUrl, {
    title: "Cambio de estado",
    description: `**${empresa}**${contacto ? ` (${contacto})` : ""} pasó de estado.`,
    color: hexToDecimal(BRIEF_TYPE_COLOR_HEX[type]),
    fields: [
      {
        name: "Estado",
        value: `${statusLabel(fromStatus)} → **${statusLabel(toStatus)}**`,
        inline: false,
      },
    ],
    url: adminUrl,
  });
}
