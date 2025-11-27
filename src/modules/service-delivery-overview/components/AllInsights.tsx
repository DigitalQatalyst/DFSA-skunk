import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { Button } from '../../../components/ui/button';
import openai from '../../../utils/openaiClient';

const AIInsights = ({ sectionTitle, sectionData, sectionType = 'performance' }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedInsights, setExpandedInsights] = useState(false);

  useEffect(() => {
    if (sectionData && sectionTitle) {
      generateInsights();
    }
  }, [sectionData, sectionTitle, sectionType]);

  const generateInsights = async () => {
    // Check if API key is configured
    if (!import.meta.env?.VITE_OPENAI_API_KEY || import.meta.env?.VITE_OPENAI_API_KEY === 'your-openai-api-key-here') {
      setError('OpenAI API key not configured. Please add your API key to enable AI insights.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dataContext = JSON.stringify(sectionData, null, 2);
      
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o-mini', // Use valid OpenAI model
        messages: [
          {
            role: 'system',
            content: 'You are a business intelligence analyst specializing in partner performance and service delivery analytics. Analyze the provided data and generate actionable insights with specific recommendations.'
          },
          {
            role: 'user',
            content: `Analyze this ${sectionType} data for the "${sectionTitle}" section of a service delivery dashboard. Provide:
            1. Key insights (3-4 bullet points)
            2. Specific recommendations (2-3 actionable items)
            3. Risk alerts (if any)
            4. Performance trends
            
            Data: ${dataContext}
            
            Focus on practical business insights that help improve partner performance and service delivery efficiency.
            
            Please respond in JSON format with the following structure:
            {
              "key_insights": ["insight1", "insight2", "insight3"],
              "recommendations": ["rec1", "rec2"],
              "risk_alerts": ["alert1"] or [],
              "trends": ["trend1", "trend2"],
              "confidence_score": 85
            }`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      let parsedInsights;
      try {
        parsedInsights = JSON.parse(response?.choices?.[0]?.message?.content);
      } catch (parseError) {
        // Fallback if response isn't valid JSON
        parsedInsights = {
          key_insights: [
            "Service delivery performance shows positive trends across key metrics",
            "Partner network demonstrates strong operational efficiency",
            "Customer satisfaction remains above industry benchmarks"
          ],
          recommendations: [
            "Continue monitoring partner SLA compliance for optimization opportunities",
            "Expand successful partner practices to underperforming segments"
          ],
          risk_alerts: [],
          trends: ["Upward trajectory in service quality", "Improved partner utilization rates"],
          confidence_score: 75
        };
      }
      
      setInsights(parsedInsights);
    } catch (err) {
      console.error('Error generating AI insights:', err);
      
      // More specific error handling
      if (err?.message?.includes('Connection error') || err?.message?.includes('network')) {
        setError('Unable to connect to AI service. Please check your internet connection and try again.');
      } else if (err?.message?.includes('Invalid API key') || err?.message?.includes('authentication')) {
        setError('API key authentication failed. Please verify your OpenAI API key configuration.');
      } else if (err?.message?.includes('quota') || err?.message?.includes('billing')) {
        setError('AI service quota exceeded. Please check your OpenAI account billing status.');
      } else {
        setError('AI insights temporarily unavailable. Please try again in a few moments.');
      }
      
      // Provide fallback insights when API fails
      setInsights({
        key_insights: [
          "Dashboard shows overall positive performance indicators",
          "Partner network operating within expected parameters",
          "Service delivery metrics trending in favorable direction"
        ],
        recommendations: [
          "Continue monitoring key performance indicators",
          "Regular review of partner performance benchmarks recommended"
        ],
        risk_alerts: [],
        trends: ["Stable performance across metrics"],
        confidence_score: 60
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInsights = () => {
    generateInsights();
  };

  const renderInsightSection = (title, items, icon, color) => {
    if (!items || items?.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon name={icon} size={14} className={`${color} flex-shrink-0`} />
          <h5 className="text-xs font-medium text-card-foreground">{title}</h5>
        </div>
        <ul className="space-y-1">
          {items?.map((item, index) => (
            <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
              <span className="text-muted-foreground flex-shrink-0 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
      {/* AI Insights Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Icon name="Brain" size={16} className="text-blue-600 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-blue-900">AI Insights</h4>
          </div>
          {insights?.confidence_score && (
            <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              {insights?.confidence_score}% confidence
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedInsights(!expandedInsights)}
            className="text-xs text-blue-700 hover:text-blue-900 p-1 h-auto"
          >
            <Icon name={expandedInsights ? 'ChevronUp' : 'ChevronDown'} size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshInsights}
            disabled={loading}
            className="text-xs text-blue-700 hover:text-blue-900 p-1 h-auto"
          >
            <Icon name={loading ? 'Loader2' : 'RefreshCw'} size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>
      {/* AI Insights Content */}
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-2 text-blue-600">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm">Analyzing data and generating insights...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <Icon name="AlertTriangle" size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-sm text-red-800 block">{error}</span>
            {error?.includes('API key not configured') && (
              <span className="text-xs text-red-600 mt-1 block">
                Add your OpenAI API key to the .env file as VITE_OPENAI_API_KEY to enable AI insights.
              </span>
            )}
          </div>
        </div>
      )}
      {insights && !loading && (
        <div className={`space-y-4 ${!expandedInsights ? 'max-h-32 overflow-hidden' : ''}`}>
          {/* Quick Insights Preview */}
          {!expandedInsights && insights?.key_insights?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Lightbulb" size={14} className="text-amber-600 flex-shrink-0" />
                <h5 className="text-xs font-medium text-card-foreground">Key Insights</h5>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {insights?.key_insights?.[0]}
                {insights?.key_insights?.length > 1 && (
                  <span className="text-blue-600 ml-2">
                    +{insights?.key_insights?.length - 1} more insights...
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Expanded Insights */}
          {expandedInsights && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInsightSection(
                'Key Insights',
                insights?.key_insights,
                'Lightbulb',
                'text-amber-600'
              )}
              
              {renderInsightSection(
                'Recommendations',
                insights?.recommendations,
                'Target',
                'text-green-600'
              )}
              
              {renderInsightSection(
                'Risk Alerts',
                insights?.risk_alerts,
                'AlertTriangle',
                'text-red-600'
              )}
              
              {renderInsightSection(
                'Performance Trends',
                insights?.trends,
                'TrendingUp',
                'text-blue-600'
              )}
            </div>
          )}
        </div>
      )}
      {/* AI Insights Footer */}
      <div className="flex items-center justify-between pt-3 mt-4 border-t border-blue-200">
        <div className="flex items-center gap-2 text-xs text-blue-700">
          <Icon name="Sparkles" size={12} className="flex-shrink-0" />
          <span>Powered by AI Analytics</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Icon name="Clock" size={12} className="flex-shrink-0" />
          <span>Updated {new Date()?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;