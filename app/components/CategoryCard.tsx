
import { ArrowRight, type LucideIcon } from "lucide-react";

type CategoryCardProps = {
  icon: LucideIcon;
  name: string;
  count: string;
  onClick: () => void;
};

export default function CategoryCard({
  icon: Icon,
  name,
  count,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-100">
        <Icon
          size={25}
          strokeWidth={1.8}
          className="text-blue-600"
        />
      </span>

      <h3 className="mt-5 font-bold">{name}</h3>

      <p className="mt-2 text-sm text-slate-500">{count}</p>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
        En savoir plus
        <ArrowRight size={16} />
      </span>
    </button>
  );
}
