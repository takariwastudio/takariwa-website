import type { StepDef, IntroConfig, DoneConfig } from "../_shared/types";

export const BRIEF_TYPE = "audiovisual" as const;

export const STEPS: StepDef[] = [
  {
    id: "contacto",
    number: "01",
    title: "Contacto",
    fields: [
      {
        id: "nombre_marca",
        label: "Nombre de la marca / empresa",
        type: "text",
        required: true,
      },
      {
        id: "responsable",
        label: "Nombre del responsable del proyecto",
        type: "text",
        required: true,
      },
      { id: "telefono", label: "Teléfono de contacto", type: "tel" },
      {
        id: "email",
        label: "Correo electrónico",
        type: "email",
        required: true,
      },
    ],
  },
  {
    id: "proyecto",
    number: "02",
    title: "El proyecto y el mensaje central",
    fields: [
      {
        id: "naturaleza_proyecto",
        label: "¿De qué trata esta producción?",
        type: "checkbox-group",
        required: true,
        options: [
          "Video corporativo institucional",
          "Comercial publicitario",
          "Cobertura de un evento",
          "Cápsulas para redes sociales",
          "Documental de marca",
        ],
      },
      {
        id: "objetivo_principal",
        label:
          "¿Qué acción o emoción quieren generar en el espectador al terminar de verlo?",
        type: "textarea",
        required: true,
        hint: "ej. comprar un producto, sentir confianza en la empresa, informarse sobre un servicio",
      },
      {
        id: "mensaje_clave",
        label:
          "Si la audiencia solo pudiera recordar una sola idea después de ver el video, ¿cuál sería?",
        type: "textarea",
        hint: 'el "takeaway"',
      },
    ],
  },
  {
    id: "audiencia",
    number: "03",
    title: "Audiencia y plataformas de distribución",
    fields: [
      {
        id: "publico_objetivo",
        label: "¿A quién le estamos hablando en esta pieza específica?",
        type: "textarea",
        hint: "rango de edad, perfil profesional, intereses",
      },
      {
        id: "canales_difusion",
        label: "¿Dónde va a vivir este video?",
        type: "checkbox-group",
        hint: "esto define formato de grabación, relación de aspecto y ritmo del montaje",
        options: [
          "Página web",
          "YouTube",
          "Pauta en Instagram / TikTok",
          "Pantallas en eventos",
          "Televisión",
        ],
      },
    ],
  },
  {
    id: "direccion_arte",
    number: "04",
    title: "Dirección de arte, estilo y tono",
    fields: [
      {
        id: "tono_comunicacion",
        label: "¿Cómo visualizan el espíritu del video?",
        type: "radio-group",
        options: [
          "Dinámico y rápido",
          "Emotivo y cinematográfico",
          "Serio y corporativo",
          "Humorístico",
        ],
      },
      {
        id: "referencias_visuales",
        label: "Referencias visuales (moodboard)",
        type: "textarea",
        hint: "2-3 links de videos, películas o comerciales con la estética, iluminación o ritmo de edición que buscan",
      },
      {
        id: "elementos_graficos",
        label:
          "¿El video requiere motion graphics, animación de logotipo o subtitulado especial?",
        type: "checkbox-group",
        options: [
          "Motion graphics",
          "Animación de logotipo",
          "Subtitulado especial",
          "Ninguno por ahora",
        ],
      },
    ],
  },
  {
    id: "logistica",
    number: "05",
    title: "Necesidades técnicas y logística",
    fields: [
      {
        id: "locaciones",
        label: "¿Tienen locación definida para la grabación?",
        type: "radio-group",
        options: [
          "Sí, ya tenemos locación (oficinas/instalaciones propias)",
          "No, necesitamos que ustedes hagan scouting",
          "Aún no lo sabemos",
        ],
      },
      {
        id: "talento_camara",
        label: "¿Quién va frente a cámara?",
        type: "radio-group",
        options: [
          "Voceros internos de la empresa",
          "Necesitamos casting (actores, modelos, presentadores)",
          "Combinación de ambos",
        ],
      },
      {
        id: "locucion_audio",
        label:
          "¿El audiovisual llevará locución, testimonios, o será puramente musical/visual?",
        type: "radio-group",
        options: [
          "Voz en off profesional",
          "Testimonios en cámara",
          "Puramente musical / visual",
          "Combinación de las anteriores",
        ],
      },
    ],
  },
  {
    id: "entregables",
    number: "06",
    title: "Entregables y tiempos de ejecución",
    fields: [
      {
        id: "duracion_estimada",
        label: "¿Cuánto tiempo estiman que debe durar la pieza principal?",
        type: "text",
      },
      {
        id: "desglose_entregables",
        label:
          '¿Necesitan solo el video "master", o también adaptaciones más cortas?',
        type: "textarea",
        hint: "ej. video principal de 1 minuto + tres píldoras de 15 segundos para redes",
      },
      {
        id: "fecha_limite",
        label: "¿Tienen una fecha límite inamovible para el lanzamiento?",
        type: "date",
      },
    ],
  },
  {
    id: "notas",
    number: "07",
    title: "Notas adicionales",
    fields: [
      {
        id: "notas",
        label: "Cualquier otro detalle que debamos saber",
        type: "textarea",
      },
    ],
  },
];

export const INTRO: IntroConfig = {
  eyebrow: "Antes de rodar",
  headline: "Un video no es una secuencia de imágenes.",
  paragraphs: [
    "Es la herramienta más poderosa para materializar tu marca y generar un impacto real. Antes de que dirección, cámara y postproducción se pongan en marcha, necesitamos alinear expectativas.",
    `Son ${STEPS.flatMap((s) => s.fields).length} preguntas, una a la vez. Esto es el mapa de ruta del equipo, mientras más detalle nos des, menos vamos a tener que suponer.`,
  ],
  ctaLabel: "Empecemos →",
};

export const DONE: DoneConfig = {
  eyebrow: "Brief recibido",
  headline: "Luces, cámara…",
  body: "Ya tenemos el mapa de ruta. El equipo de dirección y producción lo revisa y te escribe a {{email}} con los próximos pasos.",
};
