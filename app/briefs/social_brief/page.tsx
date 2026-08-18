import type { Metadata } from "next";
import BriefForm from "../_shared/BriefForm";
import { STEPS, INTRO, DONE, BRIEF_TYPE } from "./steps";

export const metadata: Metadata = {
  title: "Brief de Social Media",
  description: "Cuéntanos sobre tu marca para armar la estrategia de redes.",
};

export default function SocialBriefPage() {
  return (
    <BriefForm briefType={BRIEF_TYPE} steps={STEPS} intro={INTRO} done={DONE} />
  );
}
