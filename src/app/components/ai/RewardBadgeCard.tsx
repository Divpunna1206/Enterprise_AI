import { Trophy } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function RewardBadgeCard({ badge, earned }: { badge: string; earned?: boolean }) {
  return (
    <Card className={`rounded-3xl ${earned ? 'border-warning/30 bg-warning/5' : 'border-slate-200 bg-white'}`}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`rounded-2xl p-2 ${earned ? 'bg-warning/15 text-warning' : 'bg-slate-100 text-slate-500'}`}>
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{badge}</p>
          <p className="text-xs text-slate-500">{earned ? 'Earned badge' : 'Next unlockable badge'}</p>
        </div>
      </CardContent>
    </Card>
  );
}

