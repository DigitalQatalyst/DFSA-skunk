import { useEffect, useState } from 'react';
import { getNonFinancialSupabase } from '../lib/supabase/nonFinancialClient';
import { Link } from 'react-router-dom';

export default function TestSchemas() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = getNonFinancialSupabase();

      const { data: schemasData } = await supabase
        .from('service_form_schemas')
        .select('service_id, service_name, metadata')
        .order('service_name');

      const { data: servicesData } = await supabase
        .from('non_financial_services')
        .select('id, slug, name')
        .order('name');

      setSchemas(schemasData || []);
      setServices(servicesData || []);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Schema Verification</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Schemas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Form Schemas ({schemas.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {schemas.map((schema) => (
                <div key={schema.service_id} className="p-3 border rounded">
                  <div className="font-medium text-sm">{schema.service_name}</div>
                  <div className="text-xs text-gray-500">ID: {schema.service_id}</div>
                  {schema.metadata?.required_documents && (
                    <div className="text-xs text-green-600 mt-1">
                      {schema.metadata.required_documents.length} documents
                    </div>
                  )}
                  <span className="text-xs text-gray-400 mt-1 inline-block">
                    Form deprecated
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Services ({services.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {services.map((service) => {
                const hasSchema = schemas.some(
                  s => s.service_id === service.slug ||
                       s.service_id === service.id ||
                       service.slug.includes(s.service_id)
                );

                return (
                  <div key={service.id} className="p-3 border rounded">
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500">Slug: {service.slug}</div>
                    <div className={`text-xs mt-1 ${hasSchema ? 'text-green-600' : 'text-red-600'}`}>
                      {hasSchema ? '✓ Schema Found' : '✗ No Schema'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Test Links */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Test Links</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {schemas.slice(0, 6).map((schema) => (
              <div
                key={schema.service_id}
                className="p-4 border rounded bg-gray-50 opacity-60"
              >
                <div className="font-medium text-sm">{schema.service_name}</div>
                <div className="text-xs text-gray-400 mt-2">Form deprecated</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
