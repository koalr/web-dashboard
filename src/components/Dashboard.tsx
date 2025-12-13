import React, { useState, useEffect } from 'react';

interface DashboardProps {
  organizationId: string;
  teamId?: string;
}

interface MetricData {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export function Dashboard({ organizationId, teamId }: DashboardProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const params = new URLSearchParams({ orgId: organizationId });
        if (teamId) params.set('teamId', teamId);
        const res = await fetch(`/api/metrics?${params}`);
        const data = await res.json();
        setMetrics(data.metrics);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [organizationId, teamId]);

  if (loading) return <div>Loading metrics...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.name} className="rounded-lg border p-4">
          <h3 className="text-sm text-muted-foreground">{metric.name}</h3>
          <p className="text-2xl font-bold">{metric.value}</p>
          <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </span>
        </div>
      ))}
    </div>
  );
}
