import { Bell, Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface TopNavProps {
  title: string;
  showSearch?: boolean;
}

export function TopNav({ title, showSearch = true }: TopNavProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 h-9"
            />
          </div>
        )}

        <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </button>
      </div>
    </div>
  );
}
