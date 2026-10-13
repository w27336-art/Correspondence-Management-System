import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Calendar, 
  User, 
  Building, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { CorrespondenceRecord } from '../types/correspondence';

interface PendingRepliesViewProps {
  records: CorrespondenceRecord[];
  onSelectRecord: (record: CorrespondenceRecord) => void;
  onDraftReply: (parentRecord: CorrespondenceRecord) => void;
}

export const PendingRepliesView: React.FC<PendingRepliesViewProps> = ({
  records,
  onSelectRecord,
  onDraftReply,
}) => {
  const pendingRecords = records.filter(
    r => r.replyRequired && r.status !== 'Replied' && r.status !== 'Closed'
  );

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const getDaysDiff = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sort by earliest deadline first
  const sortedPending = [...pendingRecords].sort((a, b) => {
    const da = a.replyDeadline ? new Date(a.replyDeadline).getTime() : Infinity;
    const db = b.replyDeadline ? new Date(b.replyDeadline).getTime() : Infinity;
    return da - db;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-slate-900">
            Pending Regulatory Responses &amp; Deadlines
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Active correspondence awaiting official formal replies to the Pakistan Civil Aviation Authority. Maintain compliance by dispatching verified responses prior to regulatory due dates.
        </p>
      </div>

      {sortedPending.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">All regulatory replies are up to date</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are currently no outstanding letters requiring a response to the PCAA.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPending.map((record) => {
            const daysRemaining = getDaysDiff(record.replyDeadline);
            const isOverdue = daysRemaining !== null && daysRemaining < 0;
            const isNearDeadline = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 3;

            return (
              <div
                key={record.id}
                className={`bg-white border rounded-xl p-4 shadow-xs transition-all ${
                  isOverdue ? 'border-red-300 bg-red-50/20' :
                  isNearDeadline ? 'border-amber-300 bg-amber-50/20' :
                  'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-900">
                        {record.internalRef}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-slate-600 font-medium">
                        PCAA Ref: {record.pcaaRefNumber}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{record.category}</span>
                      <span className="text-slate-300">·</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        record.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        record.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {record.priority}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectRecord(record)}
                      className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {record.subject}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Action Owner: <strong>{record.responsibleOfficer || 'Unassigned'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Concerned: {record.departmentConcerned}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Letter Date: {record.letterDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Deadline Badge & Action */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Due Date
                      </div>
                      <div className={`font-mono font-bold text-sm ${
                        isOverdue ? 'text-red-600' : isNearDeadline ? 'text-amber-600' : 'text-slate-800'
                      }`}>
                        {record.replyDeadline || 'No date set'}
                      </div>
                      <div className={`text-[11px] font-semibold mt-0.5 ${
                        isOverdue ? 'text-red-600 font-bold' : isNearDeadline ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {isOverdue ? `OVERDUE BY ${Math.abs(daysRemaining!)} DAYS` :
                         daysRemaining === 0 ? 'DUE TODAY' :
                         `${daysRemaining} days remaining`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectRecord(record)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        Inspect Letter
                      </button>
                      <button
                        onClick={() => onDraftReply(record)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Draft Outgoing Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
