import type { StepDef, IntroConfig, DoneConfig } from "../_shared/types";

export const BRIEF_TYPE = "diseno" as const;

export const STEPS: StepDef[] = [
  {
    id: "datos",
    number: "01",
    title: "Tus datos importantes",
    fields: [
      {
        id: "nombre_marca",
        label: "Nombre de tu marca",
        type: "text",
        required: true,
      },
      {
        id: "responsable",
        label: "Nombre del responsable del proyecto",
        type: "text",
        required: true,
      },
      {
        id: "telefono",
        label: "Teléfono de contacto",
        type: "tel",
        required: true,
      },
      {
        id: "email",
        label: "Correo electrónico",
        type: "email",
        required: true,
        hint: "es solo para escribirte, nada más",
      },
      {
        id: "presupuesto_num",
        label: "Número de presupuesto (en caso de que tengas uno)",
        type: "text",
      },
      {
        id: "horario_atencion",
        label: "¿Cuál es tu horario de atención?",
        type: "text",
      },
      {
        id: "direccion",
        label: "Dirección completa (incluyendo código postal)",
        type: "textarea",
      },
      {
        id: "sitio_web",
        label: "Dirección de página web (en caso de tener una)",
        type: "text",
      },
      {
        id: "redes_sociales",
        label: "Nombre de las redes sociales con las que cuentas",
        type: "text",
      },
    ],
  },
  {
    id: "historia",
    number: "02",
    title: "Un poco de tu historia",
    fields: [
      {
        id: "origen_marca",
        label: "¿Por qué empezaste con tu marca?",
        type: "textarea",
      },
      {
        id: "eleccion_imagen",
        label:
          "¿Qué fue lo que te llevó a elegir la imagen que tienes actualmente?",
        type: "textarea",
      },
      {
        id: "renovacion_previa",
        label: "¿Has tenido alguna renovación de imagen previa a esta?",
        type: "textarea",
      },
      {
        id: "personalidad_dos_palabras",
        label: "¿Cuál es la personalidad de tu marca en dos palabras?",
        type: "text",
      },
      {
        id: "alma_marca",
        label:
          "Describe en una frase el alma de tu marca (el valor diferencial)",
        type: "textarea",
      },
      {
        id: "trayectoria",
        label: "Cuéntanos la trayectoria de tu marca",
        type: "textarea",
        hint: "¿fue rápidamente reconocida? ¿inició en casa/local? ¿ha pasado por crisis o cambios de diseño?",
      },
      {
        id: "infraestructura_inicial",
        label: "¿Con qué tipo de infraestructura contaste desde un inicio?",
        type: "text",
        hint: "una casa, un local, etc.",
      },
      {
        id: "crisis_marca",
        label: "¿Tu marca ha pasado por una crisis? ¿Cómo la superaron?",
        type: "textarea",
      },
      {
        id: "situacion_actual",
        label: "¿Cuál es la situación actual de tu marca?",
        type: "textarea",
      },
      {
        id: "servicios_productos",
        label: "Describe qué tipo de servicios y/o productos ofrece o produce",
        type: "textarea",
      },
    ],
  },
  {
    id: "cliente_ideal",
    number: "03",
    title: "El cliente ideal",
    fields: [
      {
        id: "publico_objetivo",
        label: "¿Cuál es el público objetivo de tu marca?",
        type: "textarea",
      },
      {
        id: "rango_edad",
        label: "¿Cuál es el rango de edad óptimo de tu público objetivo?",
        type: "text",
      },
      {
        id: "valores_destacar",
        label: "¿Qué valores te gustaría que ellos destacaran de tu marca?",
        type: "textarea",
      },
      {
        id: "razon_compra",
        label:
          "En tu opinión, ¿por qué tu público objetivo compraría tus servicios/productos?",
        type: "textarea",
      },
      {
        id: "vision_clientes",
        label: "¿Cómo te gustaría ser visto por tus clientes?",
        type: "textarea",
      },
      {
        id: "mensajes_si",
        label: "¿Qué mensajes debe transmitir tu marca?",
        type: "textarea",
      },
      {
        id: "mensajes_no",
        label: "¿Qué mensajes no debe transmitir tu marca?",
        type: "textarea",
      },
    ],
  },
  {
    id: "competencia",
    number: "04",
    title: "La competencia",
    fields: [
      {
        id: "mala_experiencia_competencia",
        label:
          "Como usuario, ¿has tenido alguna mala experiencia con tu competencia directa?",
        type: "textarea",
      },
      {
        id: "mala_experiencia_marca",
        label:
          "¿Has tenido alguna mala experiencia con la imagen actual de tu marca?",
        type: "textarea",
        hint: "ej. mal informa, crea expectativas equivocadas, etc.",
      },
      {
        id: "material_compartir",
        label:
          "¿Cuentas con material pasado y/o actual que nos puedas compartir?",
        type: "textarea",
        hint: "físico o digital, cuéntanos qué es, coordinamos cómo enviarlo",
      },
      {
        id: "planes_expansion",
        label:
          "¿Tienes planes de expansión o de desarrollar nuevos productos/servicios a corto plazo?",
        type: "textarea",
      },
      {
        id: "competidor_admirado",
        label: "¿Existe algún competidor que admires? ¿Cuál y por qué?",
        type: "textarea",
      },
      {
        id: "look_feel_competencia",
        label:
          "A nivel de look & feel, ¿qué te agrada y desagrada de tus competidores?",
        type: "textarea",
      },
    ],
  },
  {
    id: "marca",
    number: "05",
    title: "Un poco de tu marca",
    fields: [
      { id: "tipo_marca", label: "¿Qué tipo de marca es?", type: "text" },
      {
        id: "motivacion_imagen",
        label: "¿Qué te motivó a realizar esta imagen de marca?",
        type: "textarea",
      },
      {
        id: "objetivos_diseno",
        label:
          "¿Qué objetivos deseas alcanzar con el diseño de imagen de marca?",
        type: "textarea",
      },
    ],
  },
  {
    id: "otras",
    number: "06",
    title: "Otras preguntas",
    fields: [
      {
        id: "animal_marca",
        label: "Si tu marca fuera un animal, ¿qué animal sería?",
        type: "text",
      },
      {
        id: "persona_marca",
        label: "Si tu marca fuera una persona, ¿cómo sería?",
        type: "text",
      },
      {
        id: "auto_marca",
        label: "Si tu marca fuera un auto, ¿qué auto sería?",
        type: "text",
      },
      {
        id: "tono_voz",
        label: "Si tu marca hablara, ¿qué tono de voz tendría?",
        type: "text",
      },
    ],
  },
  {
    id: "personalizacion",
    number: "07",
    title: "Personalización de la marca",
    fields: [
      {
        id: "tiene_slogan",
        label: "¿Cuentas con un slogan o tagline?",
        type: "radio-group",
        options: ["Sí", "No"],
      },
      {
        id: "quiere_slogan",
        label: "¿Te gustaría contar con un slogan o tagline?",
        type: "radio-group",
        options: ["Sí", "No"],
      },
      {
        id: "inspiracion_slogan",
        label: "¿Tienes algún tipo de inspiración para esto?",
        type: "textarea",
      },
      {
        id: "imagen_proyectar",
        label: "¿Qué imagen quieres proyectar con tu marca?",
        type: "text",
        hint: "ej. elegante, juvenil, minimalista y moderna",
      },
      {
        id: "elemento_conservar",
        label:
          "¿Hay algún elemento que te gustaría conservar de tu marca actual?",
        type: "textarea",
      },
      {
        id: "elemento_no_incluir",
        label:
          "¿Hay algún elemento del diseño anterior que no debamos incluir?",
        type: "textarea",
      },
      {
        id: "referencias_visuales",
        label:
          "Comparte hasta 3 ejemplos visuales que te inspiraron para tu nueva imagen",
        type: "file",
        maxFiles: 3,
      },
      {
        id: "referencia_web",
        label:
          "Comparte un ejemplo (web, video o red social) cuya imagen se parezca a lo que buscas",
        type: "text",
      },
      {
        id: "razon_inspiracion",
        label: "¿Por qué te inspiraron las referencias que nos compartiste?",
        type: "textarea",
      },
      {
        id: "que_te_gusta_referencias",
        label: "¿Qué te gusta de cada una de ellas?",
        type: "textarea",
      },
      {
        id: "info_extra",
        label: "¿Tienes alguna información extra que te gustaría compartirnos?",
        type: "textarea",
      },
    ],
  },
];

export const INTRO: IntroConfig = {
  eyebrow: "Brief de diseño de marca",
  headline: "Vamos a darle.",
  paragraphs: [
    "Sé honesto. No nos sirve la respuesta que suena bien, sino la que es verdad.",
    "Cuanto más claro seas aquí, más rápido dejamos de preguntar y empezamos a trabajar.",
  ],
  ctaLabel: "Vamos a darle →",
};

export const DONE: DoneConfig = {
  eyebrow: "Brief recibido",
  headline: "Piezas en movimiento.",
  body: "Ya empezamos a mover las piezas de tu proyecto. Si nos trabamos en algo o necesitamos una respuesta rápida, te escribimos a {{email}}. Sobre la plata: el equipo se activa apenas caiga el depósito inicial, sin eso, la máquina no arranca.",
};
