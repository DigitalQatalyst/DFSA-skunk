/**
 * DFSA Step 2-7: Sales & Trading
 *
 * Activity-specific step for dealing in investments activities
 * Requirements: 1.3, 7.3
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Info, ArrowLeftRight, Building2, Shield, BarChart } from 'lucide-react';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormCheckbox } from '../FormCheckbox';
import { FSApplicationFormData } from '../../../../types/dfsa';

export interface Step2_7Props {
  formData: FSApplicationFormData;
  updateFormData: (updates: Partial<FSApplicationFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isReadOnly?: boolean;
}

// Trading types
const TRADING_TYPES = [
  { id: 'principal', label: 'Dealing as Principal' },
  { id: 'agent', label: 'Dealing as Agent' },
  { id: 'market_maker', label: 'Market Making' },
  { id: 'matched_principal', label: 'Matched Principal Trading' }
];

// Product types
const PRODUCT_TYPES = [
  { id: 'equities', label: 'Equities' },
  { id: 'fixed_income', label: 'Fixed Income/Bonds' },
  { id: 'fx', label: 'Foreign Exchange' },
  { id: 'derivatives', label: 'Derivatives' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'structured', label: 'Structured Products' },
  { id: 'etfs', label: 'ETFs' }
];

// Execution venues
const EXECUTION_VENUES = [
  { value: 'exchange', label: 'Regulated Exchanges' },
  { value: 'otc', label: 'OTC Markets' },
  { value: 'mtf', label: 'Multilateral Trading Facilities' },
  { value: 'mixed', label: 'Multiple Venues' }
];

export const Step2_7_SalesTrading: React.FC<Step2_7Props> = ({
  formData,
  updateFormData,
  errors,
  isReadOnly = false
}) => {
  const tradingData = (formData as any).salesTrading || {};

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({
      ...formData,
      salesTrading: {
        ...tradingData,
        [field]: value
      }
    } as any);
  };

  const handleToggle = (field: string, itemId: string, checked: boolean) => {
    const currentItems = tradingData[field] || [];
    const updatedItems = checked
      ? [...currentItems, itemId]
      : currentItems.filter((i: string) => i !== itemId);
    handleFieldChange(field, updatedItems);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This section collects information about your sales and trading activities.
          Please provide details about the types of dealing you will conduct and your execution arrangements.
        </AlertDescription>
      </Alert>

      {/* Trading Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Trading Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the types of dealing activities you will conduct:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TRADING_TYPES.map((type) => (
              <FormCheckbox
                key={type.id}
                id={`trading_${type.id}`}
                label={type.label}
                checked={(tradingData.tradingTypes || []).includes(type.id)}
                onChange={(checked) => handleToggle('tradingTypes', type.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>

          <FormTextArea
            id="tradingDescription"
            label="Description of Trading Activities"
            value={tradingData.tradingDescription || ''}
            onChange={(value) => handleFieldChange('tradingDescription', value)}
            placeholder="Describe your trading activities in detail..."
            rows={4}
            error={errors['salesTrading.tradingDescription']}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Products & Instruments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the products you will trade:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRODUCT_TYPES.map((product) => (
              <FormCheckbox
                key={product.id}
                id={`product_${product.id}`}
                label={product.label}
                checked={(tradingData.products || []).includes(product.id)}
                onChange={(checked) => handleToggle('products', product.id, checked)}
                disabled={isReadOnly}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Execution Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            id="primaryExecutionVenue"
            label="Primary Execution Venue"
            value={tradingData.primaryExecutionVenue || ''}
            onChange={(value) => handleFieldChange('primaryExecutionVenue', value)}
            options={EXECUTION_VENUES}
            required
            error={errors['salesTrading.primaryExecutionVenue']}
            placeholder="Select execution venue"
            disabled={isReadOnly}
          />

          <FormInput
            id="primeBroker"
            label="Prime Broker (if applicable)"
            value={tradingData.primeBroker || ''}
            onChange={(value) => handleFieldChange('primeBroker', value)}
            placeholder="Enter prime broker name"
            error={errors['salesTrading.primeBroker']}
            disabled={isReadOnly}
          />

          <FormInput
            id="clearingBroker"
            label="Clearing Broker (if applicable)"
            value={tradingData.clearingBroker || ''}
            onChange={(value) => handleFieldChange('clearingBroker', value)}
            placeholder="Enter clearing broker name"
            error={errors['salesTrading.clearingBroker']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasBestExecutionPolicy"
            label="The firm has a Best Execution Policy"
            checked={tradingData.hasBestExecutionPolicy || false}
            onChange={(checked) => handleFieldChange('hasBestExecutionPolicy', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Risk Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="tradingLimits"
            label="Daily Trading Limits (USD)"
            value={tradingData.tradingLimits || ''}
            onChange={(value) => handleFieldChange('tradingLimits', value)}
            placeholder="Enter daily trading limits"
            error={errors['salesTrading.tradingLimits']}
            disabled={isReadOnly}
          />

          <FormTextArea
            id="riskControls"
            label="Trading Risk Controls"
            value={tradingData.riskControls || ''}
            onChange={(value) => handleFieldChange('riskControls', value)}
            placeholder="Describe your trading risk controls..."
            rows={4}
            error={errors['salesTrading.riskControls']}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasPreTradeControls"
            label="Pre-trade risk controls are in place"
            checked={tradingData.hasPreTradeControls || false}
            onChange={(checked) => handleFieldChange('hasPreTradeControls', checked)}
            disabled={isReadOnly}
          />

          <FormCheckbox
            id="hasPostTradeMonitoring"
            label="Post-trade monitoring and surveillance is conducted"
            checked={tradingData.hasPostTradeMonitoring || false}
            onChange={(checked) => handleFieldChange('hasPostTradeMonitoring', checked)}
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};
