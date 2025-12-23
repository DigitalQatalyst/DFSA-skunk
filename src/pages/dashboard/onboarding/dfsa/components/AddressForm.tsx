/**
 * AddressForm Component
 * Reusable address input group for business and mailing addresses
 *
 * Features:
 * - Standardized address fields (line1, line2, city, state, postal code, country)
 * - React Hook Form integration
 * - Country dropdown with common options
 * - Validation feedback per field
 * - Optional line2 field
 *
 * Used throughout the onboarding form for various address inputs
 */

import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'

interface AddressFormProps {
  /**
   * Field name prefix (e.g., 'businessAddress', 'mailingAddress')
   */
  fieldPrefix: string

  /**
   * Display label for the address section
   */
  label: string

  /**
   * Optional help text
   */
  helpText?: string

  /**
   * Disable all fields
   */
  disabled?: boolean
}

/**
 * Common countries in the DIFC/MENA region
 */
const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'IE', name: 'Ireland' },
  { code: 'JE', name: 'Jersey' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'VG', name: 'British Virgin Islands' },
  // Add separator
  { code: '', name: '──────────' },
  // All other countries alphabetically
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KR', name: 'Korea, South' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MT', name: 'Malta' },
  { code: 'MX', name: 'Mexico' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MA', name: 'Morocco' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NO', name: 'Norway' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
]

export const AddressForm: React.FC<AddressFormProps> = ({
  fieldPrefix,
  label,
  helpText,
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<DFSAOnboardingFormData>()

  // Get nested errors for this address group
  const getFieldError = (fieldName: string) => {
    const parts = `${fieldPrefix}.${fieldName}`.split('.')
    let error: any = errors

    for (const part of parts) {
      if (error && error[part]) {
        error = error[part]
      } else {
        return undefined
      }
    }

    return error
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-gray-900">{label}</h3>
        {helpText && <p className="text-sm text-gray-600 mt-1">{helpText}</p>}
      </div>

      {/* Address Line 1 */}
      <div>
        <label
          htmlFor={`${fieldPrefix}.line1`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <Controller
          name={`${fieldPrefix}.line1` as any}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={`${fieldPrefix}.line1`}
              type="text"
              disabled={disabled}
              placeholder="Street address, building name, floor"
              className={`
                w-full px-3 py-2 border rounded-md text-sm
                focus:ring-2 focus:ring-primary focus:border-transparent
                ${getFieldError('line1') ? 'border-red-500' : 'border-gray-300'}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
              `}
            />
          )}
        />
        {getFieldError('line1') && (
          <p className="text-xs text-red-500 mt-1">{getFieldError('line1')?.message}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label
          htmlFor={`${fieldPrefix}.line2`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Address Line 2 <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <Controller
          name={`${fieldPrefix}.line2` as any}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={`${fieldPrefix}.line2`}
              type="text"
              disabled={disabled}
              placeholder="Suite, unit, apartment"
              className={`
                w-full px-3 py-2 border rounded-md text-sm
                focus:ring-2 focus:ring-primary focus:border-transparent
                ${getFieldError('line2') ? 'border-red-500' : 'border-gray-300'}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
              `}
            />
          )}
        />
        {getFieldError('line2') && (
          <p className="text-xs text-red-500 mt-1">{getFieldError('line2')?.message}</p>
        )}
      </div>

      {/* City and State */}
      <div className="grid grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label
            htmlFor={`${fieldPrefix}.city`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            City <span className="text-red-500">*</span>
          </label>
          <Controller
            name={`${fieldPrefix}.city` as any}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={`${fieldPrefix}.city`}
                type="text"
                disabled={disabled}
                placeholder="Dubai"
                className={`
                  w-full px-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${getFieldError('city') ? 'border-red-500' : 'border-gray-300'}
                  ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
              />
            )}
          />
          {getFieldError('city') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('city')?.message}</p>
          )}
        </div>

        {/* State/Province */}
        <div>
          <label
            htmlFor={`${fieldPrefix}.state`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            State/Province <span className="text-red-500">*</span>
          </label>
          <Controller
            name={`${fieldPrefix}.state` as any}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={`${fieldPrefix}.state`}
                type="text"
                disabled={disabled}
                placeholder="Dubai"
                className={`
                  w-full px-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${getFieldError('state') ? 'border-red-500' : 'border-gray-300'}
                  ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
              />
            )}
          />
          {getFieldError('state') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('state')?.message}</p>
          )}
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-2 gap-4">
        {/* Postal Code */}
        <div>
          <label
            htmlFor={`${fieldPrefix}.postalCode`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Postal Code <span className="text-red-500">*</span>
          </label>
          <Controller
            name={`${fieldPrefix}.postalCode` as any}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={`${fieldPrefix}.postalCode`}
                type="text"
                disabled={disabled}
                placeholder="12345"
                className={`
                  w-full px-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${getFieldError('postalCode') ? 'border-red-500' : 'border-gray-300'}
                  ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
              />
            )}
          />
          {getFieldError('postalCode') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('postalCode')?.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor={`${fieldPrefix}.country`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country <span className="text-red-500">*</span>
          </label>
          <Controller
            name={`${fieldPrefix}.country` as any}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id={`${fieldPrefix}.country`}
                disabled={disabled}
                className={`
                  w-full px-3 py-2 border rounded-md text-sm
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${getFieldError('country') ? 'border-red-500' : 'border-gray-300'}
                  ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((country, index) =>
                  country.code === '' ? (
                    <option key={`separator-${index}`} disabled>
                      {country.name}
                    </option>
                  ) : (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  )
                )}
              </select>
            )}
          />
          {getFieldError('country') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('country')?.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
