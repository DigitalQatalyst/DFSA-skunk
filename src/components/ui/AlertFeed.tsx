import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { Button } from '../ui/button';
import { Alert } from '../../types';

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertFilter, setAlertFilter] = useState('all'); // all, critical, warning, info

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
      },
      {
        id: 6,
        type: 'info',
        title: 'New Partner Onboarded',
        message: 'Emirates Development Bank successfully integrated into financing services',
        partner: 'Emirates Development Bank',
        service: 'Financing & Loans',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        action: 'Welcome package sent',
        status: 'acknowledged'
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

      setAlerts(prev => [newAlert, ...prev?.slice(0, 9)]); // Keep only 10 latest alerts
    }, 45000); // New alert every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
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

  const getAlertBg = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'acknowledged':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp) => {
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

  const filteredAlerts = alerts?.filter(alert => 
    alertFilter === 'all' || alert?.type === alertFilter
  );

  const alertCounts = {
    all: alerts?.length,
    critical: alerts?.filter(a => a?.type === 'critical')?.length,
    warning: alerts?.filter(a => a?.type === 'warning')?.length,
    info: alerts?.filter(a => a?.type === 'info')?.length
  };

  const handleAlertAction = (alertId, action) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'in-progress' }
        : alert
    ));
  };

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-card-foreground truncate">Real-time Partner Alerts</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">Live monitoring of partner service delivery issues</p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Live</span>
        </div>
      </div>

      {/* Alert Filter Tabs with Horizontal Scroll */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg min-w-fit">
          {[
            { key: 'all', label: 'All', count: alertCounts?.all },
            { key: 'critical', label: 'Critical', count: alertCounts?.critical },
            { key: 'warning', label: 'Warning', count: alertCounts?.warning },
            { key: 'info', label: 'Info', count: alertCounts?.info }
          ]?.map(filter => (
            <button
              key={filter?.key}
              onClick={() => setAlertFilter(filter?.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                alertFilter === filter?.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter?.label}
              {filter?.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs flex-shrink-0 ${
                  filter?.key === 'critical' ? 'bg-red-100 text-red-800' :
                  filter?.key === 'warning' ? 'bg-amber-100 text-amber-800' :
                  filter?.key === 'info'? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {filter?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List with Vertical Scroll */}
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredAlerts?.length > 0 ? (
          filteredAlerts?.map((alert) => {
            const alertIcon = getAlertIcon(alert?.type);
            
            return (
              <div
                key={alert?.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${getAlertBg(alert?.type)}`}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Icon name={alertIcon?.name} size={16} className={`${alertIcon?.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-card-foreground truncate flex-1">
                          {alert?.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusBadge(alert?.status)}`}>
                          {alert?.status?.replace('-', ' ')?.replace(/^\w/, c => c?.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {alert?.message}
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 mt-0.5">
                    {formatTimeAgo(alert?.timestamp)}
                  </span>
                </div>

                {/* Alert Details with Horizontal Scroll */}
                <div className="overflow-x-auto scrollbar-hide mb-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground min-w-fit">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Icon name="Users" size={12} className="flex-shrink-0" />
                      <span>{alert?.partner}</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Icon name="Tag" size={12} className="flex-shrink-0" />
                      <span>{alert?.service}</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Icon name="Activity" size={12} className="flex-shrink-0" />
                      <span>{alert?.action}</span>
                    </div>
                  </div>
                </div>

                {/* Alert Actions */}
                {alert?.status === 'active' && (
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAlertAction(alert?.id, 'acknowledge')}
                      className="text-xs py-1 px-2 whitespace-nowrap flex-shrink-0"
                    >
                      Acknowledge
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAlertAction(alert?.id, 'escalate')}
                      className="text-xs py-1 px-2 whitespace-nowrap flex-shrink-0"
                    >
                      Escalate
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="CheckCircle" size={32} className="text-emerald-500 mb-3" />
            <p className="text-sm font-medium text-card-foreground mb-1">No active alerts</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {alertFilter !== 'all' 
                ? `No ${alertFilter} alerts at this time`
                : 'All partner services operating within normal parameters'
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer with Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground min-w-fit">
          <div className="flex items-center gap-4 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Icon name="Activity" size={12} className="flex-shrink-0" />
              <span>247 partners monitored</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={12} className="flex-shrink-0" />
              <span>Real-time updates</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap flex-shrink-0">
            View All Alerts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAlerts;