import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { Alert } from '../../../types';

interface RealTimeAlertsProps {
  description?: string;
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ 
  description = 'Live monitoring of partner service delivery issues' 
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Simulate real-time alerts
  useEffect(() => {
    const initialAlerts = [
      {
        id: 1,
        type: 'critical',
        title: 'SLA Breach Alert',
        message: 'RAKBANK financing service for SME-2847 exceeded 10-day SLA limit',
        partner: 'RAKBANK',
        service: 'Financing & Loans',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        action: 'Partner Manager contacted',
        status: 'active'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Quality Score Drop',
        message: 'AUB advisory services dropped below 4.0 satisfaction threshold',
        partner: 'AUB',
        service: 'Advisory & Mentorship',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        action: 'Quality review scheduled',
        status: 'active'
      },
      {
        id: 3,
        type: 'critical',
        title: 'Partner Capacity Alert',
        message: 'Flat6Labs incubation program reached 95% capacity limit',
        partner: 'Flat6Labs',
        service: 'Incubation/Acceleration',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        action: 'Escalated to partner manager',
        status: 'active'
      },
      {
        id: 4,
        type: 'info',
        title: 'Performance Milestone',
        message: 'ADCB achieved 100% SLA compliance for credit enablement services',
        partner: 'ADCB',
        service: 'Credit Enablement',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        action: 'Recognition sent',
        status: 'acknowledged'
      },
      {
        id: 5,
        type: 'warning',
        title: 'Service Backlog Alert',
        message: 'ADCCI market access services have 48-hour processing backlog',
        partner: 'ADCCI',
        service: 'Market Access',
        timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
        action: 'Additional resources allocated',
        status: 'in-progress'
      }
    ];

    setAlerts(initialAlerts);

    // Simulate new alerts
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'warning' : 'info',
        title: 'New Alert Generated',
        message: 'Real-time monitoring detected an event requiring attention',
        partner: ['ADCB', 'FAB', 'Flat6Labs', 'ADCCI', 'AUB']?.[Math.floor(Math.random() * 5)],
        service: ['Financing & Loans', 'Advisory & Mentorship', 'Training & Capacity']?.[Math.floor(Math.random() * 3)],
        timestamp: new Date(),
        action: 'Under review',
        status: 'active'
      };

      setAlerts(prev => [newAlert, ...prev?.slice(0, 4)]); // Keep only 5 latest alerts
    }, 45000); // New alert every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return { name: 'AlertTriangle', color: 'text-red-600' };
      case 'warning':
        return { name: 'AlertCircle', color: 'text-amber-600' };
      case 'info':
        return { name: 'Info', color: 'text-blue-600' };
      default:
        return { name: 'Bell', color: 'text-gray-600' };
    }
  };

  const getAlertBorder = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-amber-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return timestamp?.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-card border border-border rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-card-foreground truncate">Real-time Alerts</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Live</span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {alerts?.length > 0 ? (
          alerts?.map((alert) => {
            const alertIcon = getAlertIcon(alert?.type);
            
            return (
              <div
                key={alert?.id}
                className={`p-3 rounded-lg border-l-4 bg-background border transition-all duration-200 hover:shadow-sm ${getAlertBorder(alert?.type)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon name={alertIcon?.name} size={16} className={`${alertIcon?.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-card-foreground">
                        {alert?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {formatTimeAgo(alert?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alert?.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="CheckCircle" size={32} className="text-emerald-500 mb-3" />
            <p className="text-sm font-medium text-card-foreground mb-1">No active alerts</p>
            <p className="text-xs text-muted-foreground">
              All partner services operating within normal parameters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeAlerts;
