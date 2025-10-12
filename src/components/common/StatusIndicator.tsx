'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface StatusIndicatorProps {
  connectionStatus?: 'online' | 'offline';
  systemStatus?: 'normal' | 'warning' | 'error';
  systemStatusText?: string;
  onRefresh?: () => Promise<void> | void;
  showLastUpdate?: boolean;
  className?: string;
}

export function StatusIndicator({
  connectionStatus: initialConnectionStatus = 'online',
  systemStatus = 'normal',
  systemStatusText,
  onRefresh,
  showLastUpdate = true,
  className
}: StatusIndicatorProps) {
  const [connectionStatus] = useState<'online' | 'offline'>(initialConnectionStatus);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Initialize the date only on client side to avoid hydration mismatch
    setLastUpdate(new Date());
    
    if (!showLastUpdate) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [showLastUpdate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Default refresh behavior
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setLastUpdate(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const getSystemStatusConfig = () => {
    switch (systemStatus) {
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 text-yellow-800',
          text: systemStatusText || 'Ada Peringatan'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-100 text-red-800',
          text: systemStatusText || 'Ada Gangguan'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100 text-green-800',
          text: systemStatusText || 'Sistem Normal'
        };
    }
  };

  const systemConfig = getSystemStatusConfig();
  const SystemIcon = systemConfig.icon;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {connectionStatus === 'online' ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              <Badge 
                variant={connectionStatus === 'online' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {connectionStatus === 'online' ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2">
              <SystemIcon className={`w-4 h-4 ${systemConfig.color}`} />
              <Badge variant="secondary" className={`text-xs ${systemConfig.bgColor}`}>
                {systemConfig.text}
              </Badge>
            </div>

            {/* Last Update */}
            {showLastUpdate && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  Update: {lastUpdate ? lastUpdate.toLocaleTimeString('id-ID') : '--:--:--'}
                </span>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:block">Refresh</span>
          </Button>
        </div>

        {/* Mobile Last Update */}
        {showLastUpdate && (
          <div className="md:hidden mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              Terakhir update: {lastUpdate ? lastUpdate.toLocaleTimeString('id-ID') : '--:--:--'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}