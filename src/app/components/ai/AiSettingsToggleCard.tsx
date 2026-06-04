import { Card, CardContent } from '../ui/Card';

export function AiSettingsToggleCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Card className="rounded-3xl border-white/70 bg-white">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 rounded border border-slate-300 accent-[var(--color-primary)]"
        />
      </CardContent>
    </Card>
  );
}

