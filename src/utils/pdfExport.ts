import jsPDF from 'jspdf';

export interface FormFieldData {
  label: string;
  value: string;
  group?: string;
}

/**
 * Generate a PDF document from form data
 * @param formData - The form data object
 * @param schema - The form schema
 * @param formTitle - Title of the form
 * @returns PDF blob
 */
export function generateFormPDF(
  formData: any,
  fields: FormFieldData[],
  formTitle: string = 'Form Submission'
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(formTitle, margin, yPosition);
  yPosition += 10;

  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${currentDate}`, margin, yPosition);
  yPosition += 15;

  // Group fields by group title
  const groupedFields = fields.reduce((acc, field) => {
    const groupName = field.group || 'Other Information';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(field);
    return acc;
  }, {} as Record<string, FormFieldData[]>);

  // Add content
  doc.setTextColor(0, 0, 0);
  Object.entries(groupedFields).forEach(([groupTitle, groupFields]) => {
    // Add group title
    checkPageBreak(15);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text(groupTitle, margin, yPosition);
    yPosition += 8;

    // Add fields in this group
    groupFields.forEach((field) => {
      checkPageBreak(20);

      // Field label
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const labelLines = doc.splitTextToSize(field.label, maxWidth - 10);
      doc.text(labelLines, margin + 5, yPosition);
      yPosition += labelLines.length * 6;

      // Field value
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const valueLines = doc.splitTextToSize(String(field.value || 'Not provided'), maxWidth - 10);
      doc.text(valueLines, margin + 10, yPosition);
      yPosition += valueLines.length * 5 + 3;
    });

    yPosition += 5; // Space between groups
  });

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${formTitle.replace(/\s+/g, '_')}_${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
}

/**
 * Format field value for PDF display
 */
export function formatFieldValueForPDF(field: any, value: any): string {
  if (!value && value !== 0 && value !== false) return 'Not provided';

  switch (field.type) {
    case 'checkbox-group':
    case 'multiselect':
      return Array.isArray(value) ? value.join(', ') : String(value);
    case 'radio':
    case 'select': {
      const options = field.options || [];
      const selectedOption = options.find((opt: any) => opt.value === value);
      return selectedOption ? selectedOption.label : String(value);
    }
    case 'checkbox':
    case 'consent':
      return value ? 'Yes' : 'No';
    case 'file':
    case 'image-upload':
      // Handle FileWithId or File object
      if (value?.name) return value.name;
      if (value?.file?.name) return value.file.name;
      return 'File uploaded';
    case 'multi-file':
      // Handle FileWithId array
      if (Array.isArray(value)) {
        if (value.length === 0) return 'No files uploaded';
        // Check if it's FileWithId array
        if (value[0]?.id && value[0]?.name) {
          return value.map((f: any) => f.name || f.file?.name || 'Unknown').join(', ');
        }
        // Legacy File array
        return value.map((f: File) => f.name || 'Unknown').join(', ');
      }
      return 'No files uploaded';
    case 'table':
      return Array.isArray(value)
        ? `${value.length} item(s) selected`
        : 'No items selected';
    case 'currency': {
      const currencySymbol = field.currency === 'USD' ? '$' : field.currency || '$';
      return `${currencySymbol}${Number(value).toLocaleString()}`;
    }
    case 'date':
      return value ? new Date(value).toLocaleDateString() : 'Not provided';
    default:
      return String(value);
  }
}

