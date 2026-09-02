import type { ProjectCategory } from "./projects";

export type ServiceCategory = {
  key: ProjectCategory;
  title: string;
  items: string[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: "diseño",
    title: "Diseño",
    items: [
      "Branding",
      "Sistemas de diseño",
      "Manuales de marca",
      "Refrescamiento de marca",
      "Personalidad de marca",
      "Naming",
      "Papelería e impresos",
      "Social media",
      "Iconografía custom",
      "Key visuals",
    ],
  },
  {
    key: "desarrollo",
    title: "Desarrollo",
    items: [
      "Web corporativa mobile-first",
      "Landing page y e-commerce",
      "UX | UI y animaciones",
      "SEO técnico y accesibilidad A11Y",
      "APIs propias e integración",
      "Autenticación y seguridad",
      "Integración CRM | ERP",
      "Automatización de procesos",
      "Arquitectura de servidores",
      "Mantenimiento y soporte",
    ],
  },
  {
    key: "audiovisual",
    title: "Audiovisual",
    items: [
      "Reels y ads para social media",
      "Video institucional",
      "Video para lanzamientos",
      "Guionización y storytelling",
      "Dirección creativa",
      "Edición de video y colorización",
      "Diseño sonoro",
      "Fotografía de producto",
      "Retrato corporativo",
      "Pauta para eventos",
    ],
  },
];
