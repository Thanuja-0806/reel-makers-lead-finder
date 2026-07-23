import React, { useState } from 'react';
import { 
  Instagram, Globe, Phone, Mail, Linkedin, ExternalLink, 
  MapPin, ShieldCheck, ShieldAlert, Copy, Check, Video, User 
} from 'lucide-react';

export default function LeadCard({ lead }) {
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const getConfidenceBadge = (score) => {
    switch (score) {
      case 'High':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>High Confidence</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Medium</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30 flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Low</span>
          </span>
        );
    }
  };

  const specsList = lead.specialization
    ? lead.specialization.split(',').map(s => s.trim())
    : ['Reel Creation'];

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-white/10 relative group">
      
      {/* Top Card Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-lg text-purple-300 uppercase">
                {lead.fullName ? lead.fullName.charAt(0) : 'V'}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition leading-snug">
                {lead.fullName || 'Videographer'}
              </h3>
              <p className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <span>{lead.companyName || 'Independent Creator'}</span>
              </p>
              <span className="inline-block text-[11px] font-medium text-slate-400 mt-0.5">
                {lead.designation || 'Short-Form Video Agency'}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            {getConfidenceBadge(lead.confidenceScore)}
          </div>
        </div>

        {/* City Badge */}
        <div className="flex items-center space-x-1 text-xs text-slate-400 mb-4 bg-slate-900/60 px-2.5 py-1 rounded-lg w-fit border border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>{lead.city || 'City Unknown'}</span>
        </div>

        {/* Specialization Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specsList.map((spec, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Contact Info List */}
        <div className="space-y-2 text-xs border-t border-white/5 pt-3 mb-4">
          
          {/* Email */}
          <div className="flex items-center justify-between text-slate-300 group/row">
            <div className="flex items-center space-x-2 truncate">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{lead.email || 'Email not available'}</span>
            </div>
            {lead.email && (
              <button
                onClick={() => copyToClipboard(lead.email, 'email')}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition shrink-0"
                title="Copy Email"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between text-slate-300 group/row">
            <div className="flex items-center space-x-2 truncate">
              <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{lead.phone || 'Phone not available'}</span>
            </div>
            {lead.phone && (
              <button
                onClick={() => copyToClipboard(lead.phone, 'phone')}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition shrink-0"
                title="Copy Phone"
              >
                {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Social & Web Link Buttons Footer */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/5">
        {lead.instagramUrl ? (
          <a
            href={lead.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition group/btn"
            title="Instagram Profile"
          >
            <Instagram className="w-4 h-4 group-hover/btn:scale-110 transition" />
          </a>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-xl bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed" title="No Instagram">
            <Instagram className="w-4 h-4" />
          </div>
        )}

        {lead.websiteUrl ? (
          <a
            href={lead.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition group/btn"
            title="Website"
          >
            <Globe className="w-4 h-4 group-hover/btn:scale-110 transition" />
          </a>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-xl bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed" title="No Website">
            <Globe className="w-4 h-4" />
          </div>
        )}

        {lead.linkedinUrl ? (
          <a
            href={lead.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition group/btn"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4 group-hover/btn:scale-110 transition" />
          </a>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-xl bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed" title="No LinkedIn">
            <Linkedin className="w-4 h-4" />
          </div>
        )}

        {lead.portfolioUrl ? (
          <a
            href={lead.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition group/btn"
            title="Portfolio Website"
          >
            <Video className="w-4 h-4 group-hover/btn:scale-110 transition" />
          </a>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-xl bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed" title="No Portfolio">
            <Video className="w-4 h-4" />
          </div>
        )}
      </div>

    </div>
  );
}
