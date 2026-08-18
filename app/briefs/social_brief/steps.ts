import type { StepDef, IntroConfig, DoneConfig } from "../_shared/types";

export const BRIEF_TYPE = "social" as const;

export const STEPS: StepDef[] = [
  {
    id: "contacto",
    number: "01",
    title: "Contacto",
    fields: [
      {
        id: "nombre_marca",
        label: "Nombre de la marca / negocio",
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
    id: "marca",
    number: "02",
    title: "La marca",
    fields: [
      { id: "a_que_se_dedican", label: "¿A qué se dedican?", type: "textarea" },
      {
        id: "tiempo_creada",
        label: "¿Cuánto tiempo tiene creada la marca?",
        type: "text",
      },
      {
        id: "historia_mision_vision",
        label: "Cuéntanos la historia, misión y visión de la empresa",
        type: "textarea",
      },
      {
        id: "manual_marca",
        label: "¿Cuentan con manual de marca / identidad visual?",
        type: "radio-group",
        options: [
          "Sí, tenemos manual de marca",
          "Tenemos logo pero no manual",
          "No tenemos nada definido",
        ],
      },
      {
        id: "propuesta_valor",
        label: "¿Cuál es su propuesta de valor o ventaja competitiva?",
        type: "textarea",
        hint: "¿qué ofrecen que la competencia no pueda igualar?",
      },
      {
        id: "areas_mejora",
        label:
          "¿Cuáles consideran que son sus mayores debilidades en percepción pública?",
        type: "textarea",
      },
    ],
  },
  {
    id: "ecosistema",
    number: "03",
    title: "Ecosistema digital",
    fields: [
      {
        id: "redes_links",
        label: "Enlaces a todas sus redes sociales (activas o inactivas)",
        type: "textarea",
      },
      {
        id: "redes_que_funcionan",
        label: "¿Cómo evalúan su comunicación actual en redes?",
        type: "textarea",
        hint: "¿alguna red funciona mejor que otra, o alguna no funciona para nada?",
      },
    ],
  },
  {
    id: "publico",
    number: "04",
    title: "Público objetivo",
    fields: [
      {
        id: "publico_objetivo",
        label: "Describan a su cliente ideal (buyer persona)",
        type: "textarea",
        required: true,
        hint: "edad, ubicación, nivel socioeconómico, intereses, estilo de vida",
      },
      {
        id: "cliente_ideal_frase",
        label: "Describe a tu cliente ideal en una frase",
        type: "text",
      },
      {
        id: "cliente_no_atraer",
        label: "¿Cuál es el cliente que NO quieres atraer?",
        type: "textarea",
      },
      {
        id: "problema_resuelto",
        label: "¿Qué necesidad o problema le resuelve tu marca a esta persona?",
        type: "textarea",
      },
      {
        id: "comportamiento_consumo",
        label:
          "¿En qué plataformas pasa más tiempo tu audiencia, y qué tono de comunicación prefiere?",
        type: "textarea",
        hint: "formal, educativo, de entretenimiento...",
      },
    ],
  },
  {
    id: "competencia",
    number: "05",
    title: "Competencia y referencias",
    fields: [
      {
        id: "competidores",
        label: "Competidores directos e indirectos",
        type: "textarea",
        hint: "nombre + link de sus redes, 2-3 está bien",
      },
      {
        id: "que_hacen_bien_competencia",
        label:
          "¿Qué creen que están haciendo bien, y en qué su marca los supera?",
        type: "textarea",
      },
      {
        id: "cuentas_admiradas",
        label: "Cuentas o marcas que admiran (dentro o fuera de su industria)",
        type: "textarea",
        hint: "estética visual, calidad audiovisual o tono que les gustaría tomar como referencia — comparte los links",
      },
      {
        id: "no_quiere_parecerse",
        label: "¿Hay algo a lo que definitivamente no quieran parecerse?",
        type: "textarea",
      },
    ],
  },
  {
    id: "personalidad",
    number: "06",
    title: "Personalidad y tono",
    fields: [
      {
        id: "adjetivos_marca",
        label:
          "Si tuvieran que definir la marca con 3 adjetivos, ¿cuáles serían?",
        type: "text",
        hint: "ej. innovadora, cercana, exclusiva",
      },
      {
        id: "si_fuera_persona",
        label: "Si la marca fuera una persona, ¿cómo hablaría?",
        type: "textarea",
      },
      {
        id: "frases_evitar",
        label: "¿Hay frases o estilos que debamos evitar totalmente?",
        type: "textarea",
      },
      {
        id: "estilo_contenido",
        label:
          "¿Prefieres el contenido editorial y cuidado, o algo más auténtico y crudo?",
        type: "radio-group",
        options: [
          "Editorial y cuidado",
          "Auténtico y crudo",
          "Un balance entre ambos",
        ],
      },
    ],
  },
  {
    id: "recursos",
    number: "07",
    title: "Contenido y recursos",
    fields: [
      {
        id: "banco_contenido",
        label: "¿Tienen banco de fotos/videos propios?",
        type: "radio-group",
        options: [
          "Sí, banco propio de buena calidad",
          "Tenemos, pero hay que renovarlo",
          "No tenemos, hay que producir todo de cero",
        ],
      },
      {
        id: "quien_produce_dia_a_dia",
        label: "¿Quién toma las fotos/videos en el día a día?",
        type: "text",
      },
      {
        id: "frecuencia_contenido",
        label: "¿Con qué frecuencia pueden generar contenido nuevo?",
        type: "text",
      },
    ],
  },
  {
    id: "objetivos",
    number: "08",
    title: "Objetivos y métricas",
    fields: [
      {
        id: "objetivo_principal",
        label: "¿Qué esperan lograr con esta estrategia?",
        type: "checkbox-group",
        required: true,
        options: [
          "Posicionamiento de marca / brand awareness",
          "Generación de leads",
          "Aumento de ventas directas",
          "Fidelización de clientes",
          "Gestión de crisis",
        ],
      },
      {
        id: "como_medir_exito",
        label: "¿Cómo vamos a medir que funcionó?",
        type: "textarea",
      },
      {
        id: "fechas_eventos",
        label: "¿Hay fechas o eventos importantes que debamos tener en cuenta?",
        type: "textarea",
      },
      {
        id: "fecha_inicio_proyecto",
        label: "¿Fecha estimada para arrancar el proyecto?",
        type: "date",
      },
    ],
  },
  {
    id: "operacion",
    number: "09",
    title: "Operación y logística",
    fields: [
      {
        id: "quien_aprueba",
        label: "¿Quién aprueba el contenido antes de publicar?",
        type: "text",
      },
      {
        id: "quien_publica",
        label: "¿Quién publica?",
        type: "radio-group",
        options: ["Ustedes (Takariwa)", "Nosotros", "Ambos"],
      },
      {
        id: "presupuesto_pautas",
        label:
          "¿Tienen presupuesto definido para pautas, o solo producen contenido orgánico?",
        type: "text",
      },
      {
        id: "restricciones_legales",
        label: "¿Hay restricciones legales que debamos conocer?",
        type: "textarea",
      },
    ],
  },
  {
    id: "bonus",
    number: "10",
    title: "Últimos detalles",
    fields: [
      {
        id: "nunca_preguntado",
        label:
          "¿Qué sientes que nunca te han preguntado sobre tu marca y deberíamos saber?",
        type: "textarea",
      },
      {
        id: "no_quieren_que_hagamos",
        label: "¿Hay algo que definitivamente NO quieran que hagamos?",
        type: "textarea",
      },
    ],
  },
];

export const INTRO: IntroConfig = {
  eyebrow: "Antes de hacer ruido",
  headline: "Que no puedan ignorarte, empieza aquí.",
  paragraphs: [
    '"El Ruido" es como llamamos a todo lo que hacemos en redes, contenido con un solo objetivo: que no puedan ignorarte. Pero antes de producir una sola pieza, necesitamos entender tu marca por dentro.',
    `Son ${STEPS.flatMap((s) => s.fields).length} preguntas, una a la vez. Mientras más honesto seas, menos vamos a tener que adivinar.`,
  ],
  ctaLabel: "Empecemos →",
};

export const DONE: DoneConfig = {
  eyebrow: "Brief recibido",
  headline: "A producir.",
  body: "Ya tenemos lo que necesitamos para empezar a mover piezas. El equipo lo revisa y te escribe a {{email}} con los próximos pasos.",
};
