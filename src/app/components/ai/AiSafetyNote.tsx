import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function AiSafetyNote({ lines }: { lines: string[] }) {
  return (
    <Card className="rounded-3xl border-primary/10 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div className="space-y-1 text-sm text-slate-700">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

