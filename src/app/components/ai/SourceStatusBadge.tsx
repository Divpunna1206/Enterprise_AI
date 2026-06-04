import { Badge } from '../ui/Badge';

export function SourceStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const variant =
    normalized === 'indexed'
      ? 'success'
      : normalized === 'failed'
        ? 'destructive'
        : normalized === 'embedding' || normalized === 'chunking' || normalized === 'extracting'
          ? 'warning'
          : 'muted';

  return <Badge variant={variant}>{status}</Badge>;
}

