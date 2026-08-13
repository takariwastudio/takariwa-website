import type { Metadata } from "next";
import BriefForm from "../_shared/BriefForm";
import { STEPS, INTRO, DONE, BRIEF_TYPE } from "./steps";

export const metadata: Metadata = {
  title: "Brief de diseño de marca",
  description: "Cuéntanos sobre tu marca para empezar a trabajar en su imagen.",
};

export default function DesignBriefPage() {
  return (
    <BriefForm briefType={BRIEF_TYPE} steps={STEPS} intro={INTRO} done={DONE} />
  );
}
