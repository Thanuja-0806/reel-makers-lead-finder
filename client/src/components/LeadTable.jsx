import React from 'react';
import { ExternalLink, Instagram, Globe, Linkedin, Mail, Phone, Video } from 'lucide-react';

export default function LeadTable({ leads }) {
  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Name & Company</th>
              <th className="py-3.5 px-4">Designation</th>
              <th className="py-3.5 px-4">City</th>
              <th className="py-3.5 px-4">Contact Details</th>
              <th className="py-3.5 px-4">Social & Links</th>
              <th className="py-3.5 px-4">Specialization</th>
              <th className="py-3.5 px-4 text-center">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead, index) => (
              <tr key={index} className="hover:bg-purple-500/5 transition">
                
                {/* Name & Company */}
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-sm">{lead.fullName || 'Videographer'}</div>
                  <div className="text-purple-300 text-xs">{lead.companyName || 'Independent Creator'}</div>
                </td>

                {/* Designation */}
                <td className="py-3 px-4 text-slate-300">
                  {lead.designation || 'Short-Form Video Agency'}
                </td>

                {/* City */}
                <td className="py-3 px-4 text-slate-300 font-medium">
                  {lead.city}
                </td>

                {/* Contact Details */}
                <td className="py-3 px-4 space-y-1">
                  {lead.email && (
                    <div className="flex items-center space-x-1.5 text-amber-300">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[160px]">{lead.email}</span>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center space-x-1.5 text-cyan-300">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {!lead.email && !lead.phone && <span className="text-slate-600 italic">No direct phone/email</span>}
                </td>

                {/* Links */}
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {lead.instagramUrl && (
                      <a href={lead.instagramUrl} target="_blank" rel="noreferrer" className="text-pink-400 hover:text-pink-300" title="Instagram">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {lead.websiteUrl && (
                      <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300" title="Website">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {lead.linkedinUrl && (
                      <a href={lead.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300" title="LinkedIn">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {lead.portfolioUrl && (
                      <a href={lead.portfolioUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300" title="Portfolio">
                        <Video className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>

                {/* Specialization */}
                <td className="py-3 px-4">
                  <span className="text-slate-300 max-w-[180px] truncate block" title={lead.specialization}>
                    {lead.specialization}
                  </span>
                </td>

                {/* Confidence */}
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    lead.confidenceScore === 'High'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : lead.confidenceScore === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-700/40 text-slate-400'
                  }`}>
                    {lead.confidenceScore}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
