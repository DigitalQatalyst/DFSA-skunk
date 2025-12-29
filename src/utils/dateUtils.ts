// Check if a date is valid
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Format date to a human-readable format
export const formatDate = (date: Date): string => {
  if (!isValidDate(date)) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

// Format time to a human-readable format
export const formatTime = (date: Date): string => {
  if (!isValidDate(date)) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
}
// Format date and time together
export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`
}
// Generate ICS file content for calendar
export const generateICSContent = (event: {
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  location?: string
}): string => {
  const startDate = new Date(event.startDateTime)
  const endDate = new Date(event.endDateTime)
  // Format dates for ICS
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '')
  }
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    event.location ? `LOCATION:${event.location}` : '',
    `UID:${Math.random().toString(36).substring(2)}@example.com`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return icsContent
}
// Download ICS file
export const downloadICSFile = (event: {
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  location?: string
}): void => {
  const icsContent = generateICSContent(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  // Create a link and trigger download
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', `${event.title.replace(/\s+/g, '-')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}