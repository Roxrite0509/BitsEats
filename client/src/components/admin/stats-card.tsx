import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  subtitle?: string;
  iconColor?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection, 
  subtitle,
  iconColor = "text-primary"
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-3xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
          </div>
          <div className={`w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center`}>
            <i className={`${icon} ${iconColor}`}></i>
          </div>
        </div>
        
        {trend && trendDirection && (
          <div className="flex items-center space-x-1 text-sm mt-2">
            <i className={`fas fa-arrow-${trendDirection} ${
              trendDirection === 'up' ? 'text-green-400' : 'text-red-400'
            }`}></i>
            <span className={trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}>
              {trend}
            </span>
            <span className="text-muted-foreground">vs yesterday</span>
          </div>
        )}
        
        {subtitle && (
          <div className="text-sm text-muted-foreground mt-2">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
