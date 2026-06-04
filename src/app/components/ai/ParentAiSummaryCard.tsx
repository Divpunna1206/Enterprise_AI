import { Card, CardContent, CardTitle } from '../ui/Card';

export function ParentAiSummaryCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-3xl border-white/70 bg-white">
      <CardContent className="p-5">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

