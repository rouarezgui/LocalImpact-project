import { MapPin, type LucideIcon } from "lucide-react";

type ReportCardProps = {
  category: string;
  title: string;
  location: string;
  status: string;
  color: string;
  icon: LucideIcon;
};

export default function ReportCard({
  category,
  title,
  location,
  status,
  color,
  icon: Icon,
}: ReportCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Icon size={23} className="text-blue-600" />
        </span>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}
        >
          {status}
        </span>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-blue-600">
        {category}
      </p>

      <h3 className="mt-2 text-lg font-bold leading-7">{title}</h3>

      <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
        <MapPin size={16} className="shrink-0" />
        {location}
      </p>
    </article>
  );
}

