import { SERVICE_CATEGORIES } from "@/lib/services";
import { CATEGORY_COLORS } from "@/lib/projects";

export default function LoQueHacemosDetalle() {
  return (
    <section className="flex min-h-dvh flex-col justify-center bg-ink px-6 py-20 md:justify-start md:px-12 md:pt-[331px] md:pb-24">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-12">
        <h2 className="shrink-0 font-display text-[2.75rem] leading-[0.92] text-paper sm:text-[3.5rem] md:text-[5rem] xl:text-[6rem]">
          <span className="block">Si manguareamos mucho explicando</span>
          <span className="block">hacemos esto:</span>
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 md:pb-3">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.key}>
              <p
                className="font-body text-[10px] leading-[0.95] uppercase"
                style={{ color: CATEGORY_COLORS[category.key] }}
              >
                {category.title}
              </p>
              <ul className="mt-3 space-y-1 md:mt-4">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="font-body text-[10px] leading-[0.95] text-paper uppercase"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
