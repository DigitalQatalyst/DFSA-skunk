/**
 * Test Suite for Platform Data Validation Standards
 * 
 * Tests all validation rules according to:
 * - Min/max behavior
 * - Invalid characters
 * - HTML injection attempts
 * - Incorrect data types
 * - Edge cases
 * 
 * To run these tests, install Vitest:
 *   npm install -D vitest @vitest/ui
 * 
 * Add to package.json scripts:
 *   "test": "vitest",
 *   "test:ui": "vitest --ui"
 * 
 * Configure vitest.config.ts:
 *   import { defineConfig } from 'vitest/config'
 *   export default defineConfig({
 *     test: {
 *       globals: true,
 *       environment: 'jsdom',
 *     },
 *   })
 */

import { describe, test, expect } from 'vitest';
import {
  validateFirstName,
  validateLastName,
  validateFullName,
  validateEmail,
  validatePhone,
  validateWebsiteUrl,
  validateTextSingleLine,
  validateTextMultiLineSmall,
  validateTextMultiLineLarge,
  validateAddress,
  validateCity,
  validateState,
  validateZipPostalCode,
  validatePassportNumber,
  validateDateWithConstraints,
  validateDateRange,
  rejectHTML,
  VALIDATION_PATTERNS,
  LENGTH_CONSTRAINTS,
} from '../formValidationStandards';

describe('Platform Data Validation Standards', () => {
  
  describe('HTML Injection Prevention', () => {
    test('should reject HTML symbols < >', () => {
      expect(rejectHTML('<script>alert("xss")</script>')).toEqual({
        isValid: false,
        error: expect.stringContaining('HTML characters')
      });
      
      expect(rejectHTML('Hello <world>')).toEqual({
        isValid: false,
        error: expect.stringContaining('HTML characters')
      });
      
      expect(rejectHTML('Valid text')).toEqual({ isValid: true });
    });

    test('should reject HTML in all text fields', () => {
      const htmlInput = 'Test<script>alert("xss")</script>';
      
      expect(validateFirstName(htmlInput).isValid).toBe(false);
      expect(validateEmail(htmlInput).isValid).toBe(false);
      expect(validateTextSingleLine(htmlInput).isValid).toBe(false);
    });
  });

  describe('First Name Validation', () => {
    test('should validate min/max length', () => {
      // Too short
      expect(validateFirstName('')).toEqual({
        isValid: false,
        error: expect.stringContaining('required')
      });

      // Too long (>100 chars)
      const longName = 'A'.repeat(101);
      expect(validateFirstName(longName)).toEqual({
        isValid: false,
        error: expect.stringContaining('100')
      });

      // Valid length
      expect(validateFirstName('John')).toEqual({ isValid: true });
      expect(validateFirstName('A'.repeat(100))).toEqual({ isValid: true });
    });

    test('should reject invalid characters', () => {
      expect(validateFirstName('John123')).toEqual({
        isValid: false,
        error: expect.stringContaining('letters')
      });
      
      expect(validateFirstName('John@Doe')).toEqual({
        isValid: false,
        error: expect.stringContaining('letters')
      });
    });

    test('should accept valid characters', () => {
      expect(validateFirstName("John")).toEqual({ isValid: true });
      expect(validateFirstName("Mary-Jane")).toEqual({ isValid: true });
      expect(validateFirstName("O'Brien")).toEqual({ isValid: true });
      expect(validateFirstName("José")).toEqual({ isValid: true });
      expect(validateFirstName("François")).toEqual({ isValid: true });
    });

    test('should handle incorrect data types', () => {
      expect(validateFirstName(null as any)).toEqual({
        isValid: false,
        error: expect.stringContaining('required')
      });
      
      expect(validateFirstName(123 as any)).toEqual({
        isValid: false,
        error: expect.stringContaining('required')
      });
    });
  });

  describe('Email Validation', () => {
    test('should validate min/max length', () => {
      // Too short (<5 chars)
      expect(validateEmail('a@b')).toEqual({
        isValid: false,
        error: expect.stringContaining('5')
      });

      // Too long (>254 chars)
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toEqual({
        isValid: false,
        error: expect.stringContaining('254')
      });

      // Valid length
      expect(validateEmail('test@example.com')).toEqual({ isValid: true });
    });

    test('should reject invalid formats', () => {
      expect(validateEmail('invalid')).toEqual({
        isValid: false,
        error: expect.stringContaining('valid email')
      });
      
      expect(validateEmail('invalid@')).toEqual({
        isValid: false,
        error: expect.stringContaining('valid email')
      });
      
      expect(validateEmail('@example.com')).toEqual({
        isValid: false,
        error: expect.stringContaining('valid email')
      });
    });

    test('should accept valid formats', () => {
      expect(validateEmail('user@example.com')).toEqual({ isValid: true });
      expect(validateEmail('user.name@example.co.uk')).toEqual({ isValid: true });
      expect(validateEmail('user_name@example-domain.com')).toEqual({ isValid: true });
    });

    test('should normalize to lowercase', () => {
      const result = validateEmail('TEST@EXAMPLE.COM');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Phone Number Validation', () => {
    test('should validate digit count (7-15)', () => {
      // Too few digits (<7)
      expect(validatePhone('123456')).toEqual({
        isValid: false,
        error: expect.stringContaining('7')
      });

      // Too many digits (>15)
      const longPhone = '+1234567890123456';
      expect(validatePhone(longPhone)).toEqual({
        isValid: false,
        error: expect.stringContaining('15')
      });

      // Valid digit count
      expect(validatePhone('+1234567890')).toEqual({ isValid: true });
    });

    test('should accept formatting characters', () => {
      expect(validatePhone('+1 (234) 567-8901')).toEqual({ isValid: true });
      expect(validatePhone('+971-50-123-4567')).toEqual({ isValid: true });
      expect(validatePhone('1234567890')).toEqual({ isValid: true });
    });

    test('should reject invalid characters', () => {
      expect(validatePhone('abc123')).toEqual({
        isValid: false,
        error: expect.stringContaining('invalid')
      });
    });
  });

  describe('Date Validation with Constraints', () => {
    test('should validate notFuture constraint', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      expect(validateDateWithConstraints(tomorrowStr, { notFuture: true })).toEqual({
        isValid: false,
        error: expect.stringContaining('future')
      });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      expect(validateDateWithConstraints(yesterdayStr, { notFuture: true })).toEqual({
        isValid: true
      });
    });

    test('should validate notPast constraint', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      expect(validateDateWithConstraints(yesterdayStr, { notPast: true })).toEqual({
        isValid: false,
        error: expect.stringContaining('past')
      });
    });

    test('should validate minAge constraint (for DOB)', () => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 17);
      const dobStr = eighteenYearsAgo.toISOString().split('T')[0];

      expect(validateDateWithConstraints(dobStr, { minAge: 18 })).toEqual({
        isValid: false,
        error: expect.stringContaining('18')
      });

      const nineteenYearsAgo = new Date();
      nineteenYearsAgo.setFullYear(nineteenYearsAgo.getFullYear() - 19);
      const validDobStr = nineteenYearsAgo.toISOString().split('T')[0];

      expect(validateDateWithConstraints(validDobStr, { minAge: 18 })).toEqual({
        isValid: true
      });
    });

    test('should validate date range', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-02';

      expect(validateDateRange(startDate, endDate)).toEqual({ isValid: true });
      
      expect(validateDateRange(endDate, startDate)).toEqual({
        isValid: false,
        error: expect.stringContaining('before')
      });
    });

    test('should validate date format', () => {
      expect(validateDateWithConstraints('invalid-date')).toEqual({
        isValid: false,
        error: expect.stringContaining('YYYY-MM-DD')
      });

      expect(validateDateWithConstraints('2024-01-01')).toEqual({
        isValid: true
      });
    });
  });

  describe('Text Field Validation', () => {
    test('should validate single-line text length (1-255)', () => {
      expect(validateTextSingleLine('')).toEqual({
        isValid: false,
        error: expect.stringContaining('required')
      });

      const longText = 'A'.repeat(256);
      expect(validateTextSingleLine(longText)).toEqual({
        isValid: false,
        error: expect.stringContaining('255')
      });

      expect(validateTextSingleLine('Valid text')).toEqual({ isValid: true });
    });

    test('should validate multi-line small text length (1-750)', () => {
      const longText = 'A'.repeat(751);
      expect(validateTextMultiLineSmall(longText)).toEqual({
        isValid: false,
        error: expect.stringContaining('750')
      });
    });

    test('should validate multi-line large text length (1-2000)', () => {
      const longText = 'A'.repeat(2001);
      expect(validateTextMultiLineLarge(longText)).toEqual({
        isValid: false,
        error: expect.stringContaining('2000')
      });
    });
  });

  describe('Address Validation', () => {
    test('should accept valid address characters', () => {
      expect(validateAddress('123 Main St., Apt 4B')).toEqual({ isValid: true });
      expect(validateAddress('Building 5/Unit 10')).toEqual({ isValid: true });
      expect(validateAddress('123 Main St - Suite 200')).toEqual({ isValid: true });
    });

    test('should reject invalid characters', () => {
      expect(validateAddress('123 Main St <script>')).toEqual({
        isValid: false,
        error: expect.stringContaining('HTML')
      });
    });
  });

  describe('Passport Number Validation', () => {
    test('should validate length (5-10)', () => {
      expect(validatePassportNumber('1234')).toEqual({
        isValid: false,
        error: expect.stringContaining('5')
      });

      const longPassport = 'A'.repeat(11);
      expect(validatePassportNumber(longPassport)).toEqual({
        isValid: false,
        error: expect.stringContaining('10')
      });
    });

    test('should accept alphanumeric only', () => {
      expect(validatePassportNumber('AB123456')).toEqual({ isValid: true });
      expect(validatePassportNumber('12345678')).toEqual({ isValid: true });
      
      expect(validatePassportNumber('AB-123456')).toEqual({
        isValid: false,
        error: expect.stringContaining('letters and numbers')
      });
    });
  });

  describe('Last Name Validation', () => {
    test('should validate max length (200)', () => {
      const longName = 'A'.repeat(201);
      expect(validateLastName(longName)).toEqual({
        isValid: false,
        error: expect.stringContaining('200')
      });

      expect(validateLastName('A'.repeat(200))).toEqual({ isValid: true });
    });
  });

  describe('Full Name Validation', () => {
    test('should validate max length (255)', () => {
      const longName = 'A'.repeat(256);
      expect(validateFullName(longName)).toEqual({
        isValid: false,
        error: expect.stringContaining('255')
      });

      expect(validateFullName('A'.repeat(255))).toEqual({ isValid: true });
    });
  });

  describe('Website URL Validation', () => {
    test('should validate length (5-2048)', () => {
      expect(validateWebsiteUrl('http')).toEqual({
        isValid: false,
        error: expect.stringContaining('5')
      });

      const longUrl = 'http://' + 'a'.repeat(2042) + '.com';
      expect(validateWebsiteUrl(longUrl)).toEqual({
        isValid: false,
        error: expect.stringContaining('2048')
      });
    });

    test('should accept valid URLs', () => {
      expect(validateWebsiteUrl('https://example.com')).toEqual({ isValid: true });
      expect(validateWebsiteUrl('http://example.com/path')).toEqual({ isValid: true });
    });
  });

  describe('City/District Validation', () => {
    test('should validate max length (100)', () => {
      const longCity = 'A'.repeat(101);
      expect(validateCity(longCity)).toEqual({
        isValid: false,
        error: expect.stringContaining('100')
      });
    });
  });

  describe('State/Province Validation', () => {
    test('should validate max length (100)', () => {
      const longState = 'A'.repeat(101);
      expect(validateState(longState)).toEqual({
        isValid: false,
        error: expect.stringContaining('100')
      });
    });
  });

  describe('ZIP/Postal Code Validation', () => {
    test('should validate max length (20)', () => {
      const longZip = 'A'.repeat(21);
      expect(validateZipPostalCode(longZip)).toEqual({
        isValid: false,
        error: expect.stringContaining('20')
      });
    });

    test('should accept alphanumeric only', () => {
      expect(validateZipPostalCode('12345')).toEqual({ isValid: true });
      expect(validateZipPostalCode('SW1A1AA')).toEqual({ isValid: true });
      
      expect(validateZipPostalCode('12345-6789')).toEqual({
        isValid: false,
        error: expect.stringContaining('letters and numbers')
      });
    });
  });

  describe('API Payload Tampering Prevention', () => {
    test('should handle null/undefined values', () => {
      expect(validateEmail(null as any).isValid).toBe(false);
      expect(validateEmail(undefined as any).isValid).toBe(false);
    });

    test('should handle non-string types', () => {
      expect(validateEmail(123 as any).isValid).toBe(false);
      expect(validatePhone({} as any).isValid).toBe(false);
    });

    test('should handle empty strings', () => {
      expect(validateFirstName('   ').isValid).toBe(false);
      expect(validateEmail('   ').isValid).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle whitespace-only strings', () => {
      expect(validateFirstName('   ').isValid).toBe(false);
      expect(validateEmail('   ').isValid).toBe(false);
    });

    test('should handle special characters in names', () => {
      expect(validateFirstName("Jean-Pierre")).toEqual({ isValid: true });
      expect(validateFirstName("Mary O'Brien")).toEqual({ isValid: true });
      expect(validateFirstName("José María")).toEqual({ isValid: true });
    });

    test('should handle international phone formats', () => {
      expect(validatePhone('+971501234567')).toEqual({ isValid: true });
      expect(validatePhone('+1-234-567-8901')).toEqual({ isValid: true });
      expect(validatePhone('(234) 567-8901')).toEqual({ isValid: true });
    });
  });
});

