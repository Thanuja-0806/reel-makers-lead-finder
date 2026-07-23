import React from 'react';
import { Users, ShieldCheck, Instagram, Mail, Phone } from 'lucide-react';

export default function StatsOverview({ leads = [], city }) {
  const total = leads.length;
  const highConfidence = leads.filter(l => l.confidenceScore === 'High').length;
  const withInstagram = leads.filter(l => Boolean(l.instagramUrl)).length;
  const withEmail = leads.filter(l => Boolean(l.email)).length;
  const withPhone = leads.filter(l => Boolean(l.phone)).length;

  const stats = [
    {
      label: 'Total Creators Discovered',
      value: total,
      subText: `Reel makers in ${city || 'selected city'}`,
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
    },
    {
      label: 'High Confidence Leads',
      value: highConfidence,
      subText: `${Math.round((highConfidence / (total || 1)) * 100)}% complete profiles`,
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
    },
    {
      label: 'Has Instagram Handle',
      value: withInstagram,
      subText: 'Direct profile / portfolio link',
      icon: Instagram,
      color: 'from-pink-500 to-rose-500',
      badgeColor: 'bg-pink-500/10 text-pink-300 border-pink-500/20'
    },
    {
      label: 'Verified Email Addresses',
      value: withEmail,
      subText: 'Crawled from site / contact page',
      icon: Mail,
      color: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
    },
    {
      label: 'Contact Numbers',
      value: withPhone,
      subText: 'Phone / WhatsApp available',
      icon: Phone,
      color: 'from-cyan-500 to-blue-500',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="glass-card rounded-2xl p-4 flex flex-col justify-between border border-white/10 hover:border-purple-500/40 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-white tracking-tight font-sans">
                {stat.value}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 tracking-wide mt-1">
              {stat.subText}
            </p>
          </div>
        );
      })}
    </div>
  );
}
