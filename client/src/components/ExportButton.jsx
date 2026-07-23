import React, { useState } from 'react';
import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExportButton({ leads = [], city }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!leads || leads.length === 0) return;
    setIsExporting(true);

    const cleanCity = (city || 'City').trim().replace(/\s+/g, '_');
    const filename = `Reel_Makers_${cleanCity}.xlsx`;

    const apiBaseUrl = import.meta.env.VITE_API_URL || '';

    try {
      // 1. Try Express Server Export Endpoint
      const response = await fetch(`${apiBaseUrl}/api/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads, city })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setIsExporting(false);
        return;
      }
    } catch (err) {
      // Fallback to client-side SheetJS generation if API is offline
    }

    // 2. Client-side SheetJS Fallback
    try {
      const dataRows = leads.map(l => {
        let cleanPhone = l.phone ? l.phone.replace(/\D/g, '') : '';
        if (cleanPhone.startsWith('91') && cleanPhone.length > 10) {
          cleanPhone = cleanPhone.replace(/^91/, '');
        }

        return {
          'Name': l.fullName || '',
          'Company': l.companyName || '',
          'Designation': l.designation || '',
          'City': l.city || city || '',
          'Instagram': l.instagramUrl || '',
          'Website': l.websiteUrl || '',
          'Phone': cleanPhone,
          'Email': l.email || '',
          'Portfolio': l.portfolioUrl || ''
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reel Makers Leads');
      XLSX.writeFile(workbook, filename);
    } catch (err) {
      console.error('Client Excel export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || leads.length === 0}
      className="px-4 py-2 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2 transition duration-200"
      title="Export to Excel (.xlsx)"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating Excel...</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
          <span>Export Excel ({leads.length})</span>
        </>
      )}
    </button>
  );
}
