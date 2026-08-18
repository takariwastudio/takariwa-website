import type { Metadata } from "next";
import BriefForm from "../_shared/BriefForm";
import { STEPS, INTRO, DONE, BRIEF_TYPE } from "./steps";

export const metadata: Metadata = {
  title: "Brief Audiovisual",
  description:
    "Cuéntanos sobre tu proyecto para alinear al equipo de dirección, cámara y postproducción.",
};

export default function AudiovisualBriefPage() {
  return (
    <BriefForm briefType={BRIEF_TYPE} steps={STEPS} intro={INTRO} done={DONE} />
  );
}
