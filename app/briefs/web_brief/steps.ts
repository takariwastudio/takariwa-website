// Fuente única de verdad del Brief de Proyecto Web.
// Agregar/quitar/reordenar un campo se hace solo aquí — el formulario público
// y la vista de administración leen de este mismo archivo.

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "checkbox-group"
  | "radio-group";

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: string[];
  required?: boolean;
}

export interface StepDef {
  id: string;
  number: string;
  title: string;
  description?: string;
  fields: FieldDef[];
}

export const STEPS: StepDef[] = [
  {
    id: "cliente",
    number: "01",
    title: "Quiénes son",
    description: "Para saber a quién le escribimos.",
    fields: [
      { id: "empresa", label: "Nombre de la empresa / marca", type: "text", required: true },
      { id: "contacto", label: "Persona de contacto", type: "text", required: true },
      { id: "cargo", label: "Cargo", type: "text" },
      { id: "email", label: "Correo electrónico", type: "email", required: true },
      { id: "telefono", label: "Teléfono / WhatsApp", type: "tel" },
      { id: "sitio_actual", label: "Sitio web actual (si aplica)", type: "text" },
      { id: "redes", label: "Redes sociales", type: "text" },
    ],
  },
  {
    id: "proyecto",
    number: "02",
    title: "El porqué del proyecto",
    fields: [
      {
        id: "tipo_sitio",
        label: "¿Qué tipo de sitio necesitas?",
        type: "checkbox-group",
        options: [
          "Landing page",
          "Sitio institucional / corporativo",
          "E-commerce (tienda online)",
          "Blog / medio de contenido",
          "Plataforma web a medida / app web",
          "Rediseño de sitio existente",
        ],
      },
      { id: "objetivo_principal", label: "¿Cuál es el objetivo principal del sitio?", type: "textarea", hint: "vender, generar leads, informar, reservar, etc." },
      { id: "motivacion", label: "¿Por qué están haciendo este proyecto ahora?", type: "textarea" },
      { id: "exito", label: "¿Cómo se ve el éxito a los 6 meses de lanzado?", type: "textarea" },
    ],
  },
  {
    id: "publico",
    number: "03",
    title: "A quién le hablan",
    fields: [
      { id: "usuario_ideal", label: "Describe a tu cliente / usuario ideal", type: "textarea", hint: "edad, ubicación, intereses, comportamiento online" },
      { id: "problema_resuelto", label: "¿Qué problema le resuelve tu marca a esta persona?", type: "textarea" },
      { id: "canal_llegada", label: "¿Cómo llega hoy este público a ustedes?", type: "textarea", hint: "redes, buscadores, referidos, publicidad" },
    ],
  },
  {
    id: "competencia",
    number: "04",
    title: "La competencia (y a quién no quieren parecerse)",
    fields: [
      { id: "competidores", label: "3 competidores directos o indirectos (nombre + sitio web)", type: "textarea" },
      { id: "referencias_gusto", label: "Sitios web que les gustan y por qué", type: "textarea" },
      { id: "referencias_rechazo", label: "Sitios que definitivamente no quieren parecer", type: "textarea" },
    ],
  },
  {
    id: "contenido",
    number: "05",
    title: "El contenido",
    fields: [
      { id: "paginas", label: "Páginas / secciones que necesita el sitio", type: "textarea", hint: "inicio, nosotros, servicios, productos, contacto, blog" },
      { id: "proveedor_contenido", label: "¿Quién provee el contenido (textos, fotos, videos)?", type: "radio-group", options: ["El cliente lo entrega", "Takariwa redacta / produce", "Combinación de ambos"] },
      { id: "material_visual", label: "¿Tienen fotografía / video profesional disponible?", type: "radio-group", options: ["Sí, ya lo tenemos", "No, hay que producirlo o usar stock", "Parcialmente"] },
      { id: "idiomas", label: "¿Necesitan el sitio en más de un idioma?", type: "text" },
    ],
  },
  {
    id: "funcionalidades",
    number: "06",
    title: "Lo técnico",
    fields: [
      {
        id: "funcionalidades",
        label: "Funcionalidades requeridas",
        type: "checkbox-group",
        options: [
          "Formulario de contacto",
          "Tienda / carrito de compras",
          "Pasarela de pago",
          "Blog con gestor de contenido",
          "Reservas / citas online",
          "Área de usuario / login",
          "Multi-idioma",
          "Integración con CRM o email marketing",
          "Chat / WhatsApp integrado",
        ],
      },
      { id: "plataforma_preferida", label: "Plataforma o CMS preferido", type: "text", hint: "WordPress, Shopify, Next.js, sin preferencia" },
      { id: "dominio_hosting", label: "¿Tienen dominio y hosting ya contratados?", type: "radio-group", options: ["Sí, ambos", "Solo dominio", "Ninguno, hay que gestionarlos"] },
      { id: "migracion", label: "¿Necesitan migrar contenido de un sitio anterior?", type: "text" },
      { id: "integraciones", label: "¿Requieren integraciones específicas?", type: "textarea", hint: "ERP, inventario, herramientas internas, etc." },
    ],
  },
  {
    id: "diseno",
    number: "07",
    title: "Cómo se debe ver y sentir",
    fields: [
      { id: "manual_marca", label: "¿Cuentan con manual de marca / identidad visual definida?", type: "radio-group", options: ["Sí, tenemos manual de marca", "Tenemos logo pero no manual", "No tenemos nada definido"] },
      { id: "palabras_sitio", label: "3 palabras que describan cómo debe sentirse el sitio", type: "text", hint: "ej. moderno, cálido, atrevido" },
      { id: "elementos_visuales", label: "Colores, tipografías o elementos que deben mantenerse", type: "textarea" },
    ],
  },
  {
    id: "presupuesto",
    number: "08",
    title: "Plata y tiempo",
    fields: [
      { id: "presupuesto", label: "Rango de presupuesto estimado", type: "text" },
      { id: "fecha_lanzamiento", label: "Fecha ideal de lanzamiento", type: "date" },
      { id: "hito_dependiente", label: "¿Existe algún hito o evento que dependa de este lanzamiento?", type: "text" },
      { id: "aprobadores", label: "¿Quién(es) dan la aprobación final en cada etapa?", type: "textarea" },
      { id: "canal_comunicacion", label: "Canal de comunicación preferido durante el proyecto", type: "checkbox-group", options: ["Correo", "WhatsApp", "Slack / herramienta de gestión", "Reuniones periódicas"] },
    ],
  },
  {
    id: "notas",
    number: "09",
    title: "Últimos detalles",
    fields: [{ id: "notas", label: "Cualquier otro detalle que debamos saber", type: "textarea" }],
  },
];

export type BriefFormData = Record<string, string | string[]>;

export const emptyFormData = (): BriefFormData =>
  STEPS.flatMap((s) => s.fields).reduce((acc, f) => {
    acc[f.id] = f.type === "checkbox-group" ? [] : "";
    return acc;
  }, {} as BriefFormData);
