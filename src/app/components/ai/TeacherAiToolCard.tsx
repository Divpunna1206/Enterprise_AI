import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export function TeacherAiToolCard({
  title,
  description,
  onSelect,
}: {
  title: string;
  description: string;
  onSelect?: () => void;
}) {
  return (
    <Card className="rounded-3xl border-white/70 bg-white">
      <CardHeader>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="outline" onClick={onSelect}>
          Open Tool
        </Button>
      </CardContent>
    </Card>
  );
}

