import { deviconUrl, skillClusters, skillIcons } from "@/data/portfolio"
import { SectionHeader } from "./SectionHeader"

// Wider cells for the groups with the most items; soft skills (no logos) span the rest.
const SPAN: Record<string, string> = {
  Frontend: "lg:col-span-2",
  Backend: "lg:col-span-2",
  "Dev Tools": "lg:col-span-2",
  "App Development": "lg:col-span-2",
  "Soft Skills": "md:col-span-2 lg:col-span-4",
}

/** Toolkit: every group visible at once in one solid grid, logos where they exist. */
export function Skills() {
  const total = skillClusters.reduce((n, c) => n + c.items.length, 0)

  return (
    <section id="skills" className="relative px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Tools I build with" aside={<>{total} languages, frameworks, tools and habits.</>} />

        {/* gap-px over a rule-coloured background draws crisp hairlines between cells. */}
        <div className="grid gap-px overflow-hidden rounded-[24px] bg-rule md:grid-cols-2 lg:grid-cols-6">
          {skillClusters.map((cluster) => (
            <div key={cluster.title} className={`bg-artboard p-6 md:p-8 ${SPAN[cluster.title] ?? "lg:col-span-2"}`}>
              <h3 className="mb-5 flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl font-semibold tracking-tight">{cluster.title}</span>
                <span className="text-sm tabular-nums text-muted">{cluster.items.length}</span>
              </h3>

              {cluster.title === "Soft Skills" ? (
                <ul className="flex flex-wrap gap-2">
                  {cluster.items.map((item) => (
                    <li key={item} className="rounded-full bg-artboard-alt px-4 py-2 text-sm font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {cluster.items.map((item) => {
                    const icon = skillIcons[item]
                    return (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-artboard-alt">
                          {icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={deviconUrl(icon.slug)}
                              alt=""
                              width={22}
                              height={22}
                              loading="lazy"
                              className={icon.invert ? "dark:invert" : ""}
                            />
                          ) : (
                            <span className="h-2.5 w-2.5 rounded-full bg-select" aria-hidden="true" />
                          )}
                        </span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
