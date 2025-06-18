
import { useRealtimeStatus } from '@/hooks/useRealtimeStatus';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export function RealtimeIndicator() {
  const { isConnected, connectionCount } = useRealtimeStatus();

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isConnected ? "default" : "secondary"}
        className={`flex items-center gap-1 ${
          isConnected 
            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-gray-100 text-gray-600 border-gray-200"
        }`}
      >
        {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
        {isConnected ? 'Live' : 'Offline'}
      </Badge>
      {isConnected && connectionCount > 0 && (
        <span className="text-xs text-muted-foreground">
          {connectionCount} viewer{connectionCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
