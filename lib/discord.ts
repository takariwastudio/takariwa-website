import {
  BRIEF_TYPE_LABEL,
  type BriefFormData,
  type BriefType,
} from "@/app/briefs/_shared/types";

const SITE_URL = "https://takariwa.studio";

const TYPE_COLOR_HEX: Record<BriefType, string> = {
  web: "281c64", // azul
  diseno: "ed2b5d", // magenta
  social: "a01789", // púrpura
  audiovisual: "f48115", // naranja
};

function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
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

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: `Nuevo brief de ${label}`,
            description: `**${contacto || "Alguien"}**, de **${empresa}**, llenó el brief de ${label.toLowerCase()}.`,
            color: hexToDecimal(TYPE_COLOR_HEX[type]),
            fields,
            url: adminUrl,
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
