import type { Metadata } from "next";
import BriefForm from "./BriefForm";

export const metadata: Metadata = {
  title: "Brief de proyecto web",
  description: "Cuéntanos sobre tu proyecto web para empezar a trabajar.",
};

export default function WebBriefPage() {
  return <BriefForm />;
}
