import { FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function AiCitationCard({ citation }: { citation: string }) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white">
      <CardContent className="flex items-start gap-3 p-4 text-sm text-slate-700">
        <FileText className="mt-0.5 h-4 w-4 text-primary" />
        <span>{citation}</span>
      </CardContent>
    </Card>
  );
}

