import XLSX from 'xlsx';

/**
 * Generate Excel Buffer for Reel Makers Leads
 * Columns: Name | Company | Designation | City | Instagram | Website | Phone | Email | LinkedIn | Portfolio | Specialization
 */
export function generateExcelBuffer(leads, city) {
  const cleanCity = city || 'TargetCity';

  // Format array into rows matching requested columns
  const dataRows = leads.map(l => {
    let cleanPhone = l.phone ? l.phone.replace(/\D/g, '') : '';
    if (cleanPhone.startsWith('91') && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.replace(/^91/, '');
    }

    return {
      'Name': l.fullName || '',
      'Company': l.companyName || '',
      'Designation': l.designation || '',
      'City': l.city || cleanCity,
      'Instagram': l.instagramUrl || '',
      'Website': l.websiteUrl || '',
      'Phone': cleanPhone,
      'Email': l.email || '',
      'Portfolio': l.portfolioUrl || ''
    };
  });

  // Create sheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(dataRows);

  // Set column widths for polished presentation
  const colWidths = [
    { wch: 22 }, // Name
    { wch: 26 }, // Company
    { wch: 24 }, // Designation
    { wch: 15 }, // City
    { wch: 35 }, // Instagram
    { wch: 30 }, // Website
    { wch: 18 }, // Phone (digits only)
    { wch: 28 }, // Email
    { wch: 30 }  // Portfolio
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reel Makers Leads');

  // Return binary buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  return excelBuffer;
}
