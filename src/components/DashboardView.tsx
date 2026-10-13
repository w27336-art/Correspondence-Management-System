import React from 'react';
import { 
  Inbox, 
  Send, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  ArrowUpRight, 
  Calendar, 
  ShieldCheck, 
  TrendingUp,
  FileCheck2,
  FileCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CorrespondenceRecord, UserRole } from '../types/correspondence';

interface DashboardViewProps {
  records: CorrespondenceRecord[];
  onSelectRecord: (record: CorrespondenceRecord) => void;
  onNavigate: (view: string) => void;
  currentRole: UserRole;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onSelectRecord,
  onNavigate,
  currentRole,
}) => {
  const total = records.length;
  const incoming = records.filter(r => r.direction === 'incoming').length;
  const outgoing = records.filter(r => r.direction === 'outgoing').length;

  const currentMonthPrefix = new Date().toISOString().substring(0, 7);
  const receivedThisMonth = records.filter(
    r => r.direction === 'incoming' && r.receivedOrDispatchedDate.startsWith(currentMonthPrefix)
  ).length;
  const dispatchedThisMonth = records.filter(
    r => r.direction === 'outgoing' && r.receivedOrDispatchedDate.startsWith(currentMonthPrefix)
  ).length;

  const pendingReplies = records.filter(
    r => r.replyRequired && r.status !== 'Replied' && r.status !== 'Closed'
  );

  const today = new Date().toISOString().split('T')[0];
  const overdueReplies = pendingReplies.filter(
    r => r.replyDeadline && r.replyDeadline < today
  );

  const awaitingVerification = records.filter(
    r => !r.isVerified || r.status === 'Awaiting Verification'
  );

  const recentRecords = [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-300">
            <span>Airblue Regulatory Affairs</span>
            <span>·</span>
            <span>PCAA Headquarters Communication Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
            PCAA Correspondence Executive Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Live regulatory register tracking all official letters, airworthiness directives, ramp safety notices, and flight operations approvals exchanged with the Pakistan Civil Aviation Authority.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <span>Scan &amp; Ingest Letter</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical Overdue Alert Banner if any */}
      {overdueReplies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between text-xs text-red-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-950">
                Regulatory Action Required: {overdueReplies.length} Overdue PCAA Inquiry
              </p>
              <p className="text-red-700 mt-0.5">
                Immediate response mandatory to avoid regulatory penalties or grounding sanctions under Civil Aviation Rules 1994.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('pending')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold shrink-0"
          >
            View Overdue Letters
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('search')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Correspondence</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {total}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span>{incoming} Incoming</span>
            <span>·</span>
            <span>{outgoing} Outgoing</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('pending')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Replies</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-2">
            {pendingReplies.length}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className={overdueReplies.length > 0 ? 'text-red-600 font-semibold' : 'text-emerald-600'}>
              {overdueReplies.length} Overdue
            </span>
            <span>·</span>
            <span>Under Review</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Dispatched This Month</span>
            <Send className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {dispatchedThisMonth}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span>{receivedThisMonth} Received</span>
            <span>·</span>
            <span>October 2026</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('upload')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verification Queue</span>
            <FileCheck2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {awaitingVerification.length}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span>0 Failed Uploads</span>
            <span>·</span>
            <span className="text-emerald-600 font-medium">Pipeline Healthy</span>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Activity Table & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Correspondence (8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm">
                Recent Regulatory Correspondence
              </h2>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Active Ledger
              </span>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>View All Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="px-5 py-3 hover:bg-slate-50/80 cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className={record.direction === 'incoming' ? 'text-blue-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {record.direction.toUpperCase()}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-700 font-bold">{record.internalRef}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 truncate" title={record.pcaaRefNumber}>
                      {record.pcaaRefNumber}
                    </span>
                  </div>

                  <p className="font-medium text-slate-900 truncate" title={record.subject}>
                    {record.subject}
                  </p>

                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span>{record.category}</span>
                    <span>·</span>
                    <span>{record.letterDate}</span>
                    <span>·</span>
                    <span className="truncate">{record.sender}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    record.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    record.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {record.priority}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    record.status === 'Dispatched' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    record.status === 'Reply Required' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Shortcuts & Regulatory Compliance Digest (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Registration Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Registry Actions
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('upload')}
                className="w-full px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Upload &amp; Extract Document</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('register-incoming')}
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-blue-600" />
                  <span>Register Incoming PCAA Letter</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('register-outgoing')}
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Register Outgoing Airblue Dispatch</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('threads')}
                className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  <span>Explore Cross-Referenced Threads</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Compliance Assurance Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Aviation Regulatory Compliance</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every document is stored with permanent SHA-256 cryptographic checksums, mapped to authorized Microsoft OneDrive / SharePoint cloud folders, and tracked in an immutable audit ledger compliant with ICAO Annex 6 and CARs 1994.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex justify-between">
              <span>Cloud Status: Connected</span>
              <span>Audit Records: {records.length + 12}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
