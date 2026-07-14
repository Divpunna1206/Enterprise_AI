export interface DashboardMetric {
  key: string;
  label: string;
  value: string | number | null;
}

export interface DashboardChart {
  key?: string;
  label?: string;
  [key: string]: unknown;
}

export interface DashboardTable {
  key: string;
  label: string;
  rows: Array<Record<string, unknown>>;
}

export interface DashboardRecentActivity {
  type: string;
  title: string;
  timestamp: string | null;
}

export interface DashboardQuickAction {
  label: string;
  path: string;
}

export interface DashboardPayload {
  metrics: DashboardMetric[];
  charts: DashboardChart[];
  tables: DashboardTable[];
  recentActivities: DashboardRecentActivity[];
  quickActions: DashboardQuickAction[];
}

