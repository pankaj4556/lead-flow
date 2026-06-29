/**
 * Helper to escape and double-quote strings for CSV format compliance
 */
const escapeCSV = (val) => {
  if (val === null || val === undefined) return '""';
  let stringVal = String(val);
  // Replace double quotes with escaped double quotes
  stringVal = stringVal.replace(/"/g, '""');
  // Wrap in quotes if it contains commas, quotes, or newlines
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n') || stringVal.includes('\r')) {
    return `"${stringVal}"`;
  }
  return `"${stringVal}"`;
};

/**
 * Generates and triggers browser download of CSV containing appointments list
 */
export function exportLeadsToCSV(appointments) {
  if (!appointments || appointments.length === 0) {
    alert('No records available to export.');
    return;
  }

  // Define column headers
  const headers = ['Ref ID', 'Name', 'Phone', 'Email', 'Age', 'Service', 'Appointment Date', 'Time Slot', 'Message Notes', 'Lead Status', 'Created At'];
  
  // Map records to rows
  const rows = appointments.map(apt => [
    apt.id,
    apt.name,
    apt.phone,
    apt.email,
    apt.age,
    apt.service,
    apt.date,
    apt.time,
    apt.message || '',
    apt.status,
    apt.created_at
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.map(h => escapeCSV(h)).join(','),
    ...rows.map(row => row.map(cell => escapeCSV(cell)).join(','))
  ].join('\r\n');

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_export_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL object
  URL.revokeObjectURL(url);
}
