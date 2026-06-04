export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  inverse = false
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-black uppercase tracking-[0.24em] text-burger-red">{eyebrow}</p>
      <h2
        className={`mt-3 font-display text-5xl uppercase leading-[0.92] tracking-normal sm:text-7xl ${
          inverse ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>
      {copy && <p className={`mt-5 text-lg leading-8 ${inverse ? "text-white/68" : "text-black/68"}`}>{copy}</p>}
    </div>
  );
}
