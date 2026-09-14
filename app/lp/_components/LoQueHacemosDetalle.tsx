import { SERVICE_CATEGORIES } from "@/lib/services";
import { CATEGORY_COLORS } from "@/lib/projects";

export default function LoQueHacemosDetalle() {
  return (
    <section className="flex flex-col justify-center bg-ink px-6 py-20 md:min-h-dvh md:justify-start md:px-12 md:pt-[331px] md:pb-24">
      <div className="flex flex-col gap-10 md:gap-14">
        <h2 className="font-display text-[2.75rem] leading-[0.92] text-paper sm:text-[3.5rem] md:text-[5rem] xl:text-[6rem]">
          <span className="block">Si manguareamos mucho explicando</span>
          <span className="block">hacemos esto:</span>
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
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
