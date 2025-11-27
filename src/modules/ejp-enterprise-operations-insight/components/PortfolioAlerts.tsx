import React from 'react';
import Icon from '../../../components/AppIcon';
import { PortfolioAlert } from '../../../types/enterpriseOperations';

interface PortfolioAlertsProps {
  alerts: PortfolioAlert[];
}

const PortfolioAlerts: React.FC<PortfolioAlertsProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'over-concentration':
        return 'AlertTriangle';
      case 'portfolio-drift':
        return 'TrendingDown';
      case 'coverage-gap':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'bad':
      case 'high':
        return 'border-red-500 bg-red-50 text-red-900';
      case 'moderate':
      case 'medium':
        return 'border-amber-500 bg-amber-50 text-amber-900';
      case 'good':
      case 'low':
        return 'border-blue-500 bg-blue-50 text-blue-900';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 flex flex-col shadow-sm" style={{ height: '600px' }}>
      <div className="mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Alerts</h3>
        <p className="text-sm text-muted-foreground">
          Automated alerts about your portfolio: concentration risks, adoption patterns, and service coverage gaps
        </p>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <Icon
                name={getAlertIcon(alert.type)}
                size={20}
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                <p className="text-sm opacity-90 mb-2">{alert.message}</p>
                <div className="flex items-center gap-2 text-xs opacity-75">
                  <Icon name="Clock" size={12} />
                  <span>{formatTimestamp(alert.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="CheckCircle" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioAlerts;

