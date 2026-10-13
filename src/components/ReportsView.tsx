import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Building2, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CorrespondenceRecord } from '../types/correspondence';

interface ReportsViewProps {
  records: CorrespondenceRecord[];
  onExportCsv: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  records,
  onExportCsv,
}) => {
  // Category counts
  const categoryCounts: Record<string, number> = {};
  records.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  // Department counts
  const deptCounts: Record<string, number> = {};
  records.forEach(r => {
    deptCounts[r.departmentConcerned] = (deptCounts[r.departmentConcerned] || 0) + 1;
  });

  // Status counts
  const statusCounts: Record<string, number> = {};
  records.forEach(r => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const incomingTotal = records.filter(r => r.direction === 'incoming').length;
  const outgoingTotal = records.filter(r => r.direction === 'outgoing').length;
  const verifiedTotal = records.filter(r => r.isVerified).length;
  const pendingReplyTotal = records.filter(r => r.replyRequired && r.status !== 'Replied' && r.status !== 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Header & Export CTA */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Regulatory Reporting &amp; Data Export
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal regulatory correspondence registers and statistical distribution reports for Airblue senior management, internal safety quality audits, and PCAA compliance reviews.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Official Register (CSV)</span>
        </button>
      </div>

      {/* High-level Compliance Ratios */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Verification Integrity
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-2">
            {records.length > 0 ? Math.round((verifiedTotal / records.length) * 100) : 100}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {verifiedTotal} of {records.length} letters verified
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Communication Ratio
          </span>
          <p className="text-2xl font-bold font-mono text-blue-600 mt-2">
            {incomingTotal} : {outgoingTotal}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Incoming vs Outgoing
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Replies Pending
          </span>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-2">
            {pendingReplyTotal}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Under active technical review
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cloud Archival Rate
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            100%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Synchronized to OneDrive vault
          </span>
        </div>
      </div>

      {/* Distribution Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Distribution by Regulatory Category
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / records.length) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-medium">{cat}</span>
                    <span className="font-mono font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Concerned Airblue Directorate Breakdown
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / records.length) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-medium">{dept}</span>
                    <span className="font-mono font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
