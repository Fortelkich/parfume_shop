import clsx from "clsx";
import Link from "next/link";

export function Section({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10">
      <div className="mb-6">
        <p className="text-ivory-300 text-sm uppercase tracking-[0.3em]">{subtitle}</p>
        <h2 className="font-display text-3xl md:text-4xl mt-2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-noir-850/70 p-5 shadow-soft backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
  className,
  prefetch = false
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  prefetch?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition cursor-pointer";
  const styles = {
    primary: "bg-cacao-600 text-ivory-100 hover:bg-cacao-500 shadow-glow",
    ghost: "border border-cacao-600 text-ivory-100 hover:bg-cacao-600/20"
  };

  if (href) {
    return (
      <Link href={href} prefetch={prefetch} className={clsx(base, styles[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={clsx(base, styles[variant], className)}>
      {children}
    </button>
  );
}

export function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-ivory-300">
      <span>{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-noir-900 px-4 py-3 text-ivory-100 outline-none focus:border-cacao-600"
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

export function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-ivory-300">
      <span>{label}</span>
      <textarea
        className="min-h-[120px] rounded-xl border border-white/10 bg-noir-900 px-4 py-3 text-ivory-100 outline-none focus:border-cacao-600"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
