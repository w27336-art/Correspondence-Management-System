import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowRight, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Inbox, 
  Send, 
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { CorrespondenceRecord } from '../types/correspondence';

interface ThreadTimelineViewProps {
  records: CorrespondenceRecord[];
  onSelectRecord: (record: CorrespondenceRecord) => void;
}

export const ThreadTimelineView: React.FC<ThreadTimelineViewProps> = ({
  records,
  onSelectRecord,
}) => {
  // Group records by threadId
  const threadsMap = new Map<string, CorrespondenceRecord[]>();

  records.forEach(r => {
    const tid = r.threadId || `thread-standalone-${r.id}`;
    if (!threadsMap.has(tid)) {
      threadsMap.set(tid, []);
    }
    threadsMap.get(tid)!.push(r);
  });

  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({
    'thread-fsd-audit-cvr': true,
    'thread-airworthiness-cfm56': true,
  });

  const toggleThread = (threadId: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [threadId]: !prev[threadId],
    }));
  };

  const threadList = Array.from(threadsMap.entries()).map(([threadId, items]) => {
    // Sort items chronologically
    items.sort((a, b) => new Date(a.letterDate).getTime() - new Date(b.letterDate).getTime());
    const rootLetter = items[0];
    const latestLetter = items[items.length - 1];
    const hasPendingReply = items.some(r => r.replyRequired && r.status !== 'Replied' && r.status !== 'Closed');

    return {
      threadId,
      rootLetter,
      latestLetter,
      count: items.length,
      hasPendingReply,
      items,
    };
  });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <GitFork className="w-5 h-5 text-purple-600" />
          <h1 className="text-xl font-bold text-slate-900">
            Regulatory Correspondence Threads &amp; Timeline History
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Trace the complete chronological evolution of regulatory investigations, inquiries, Airblue interim replies, and official PCAA closure approvals.
        </p>
      </div>

      <div className="space-y-4">
        {threadList.map(({ threadId, rootLetter, latestLetter, count, hasPendingReply, items }) => {
          const isExpanded = expandedThreads[threadId] ?? false;

          return (
            <div
              key={threadId}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Thread Group Header */}
              <div
                onClick={() => toggleThread(threadId)}
                className="px-5 py-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition-colors flex items-center justify-between gap-4 border-b border-slate-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button className="text-slate-400 hover:text-slate-600">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-slate-900">{rootLetter.pcaaRefNumber}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600">{rootLetter.category}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.2 rounded font-semibold text-[10px]">
                        {count} {count === 1 ? 'Letter' : 'Connected Letters'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm truncate" title={rootLetter.subject}>
                      {rootLetter.subject}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  {hasPendingReply ? (
                    <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reply Pending</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Thread In Order</span>
                    </span>
                  )}
                  <span className="font-mono text-slate-400 text-[11px]">
                    {rootLetter.letterDate} → {latestLetter.letterDate}
                  </span>
                </div>
              </div>

              {/* Chronological Timeline Nodes */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/20">
                  <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
                    {items.map((letter, idx) => (
                      <div key={letter.id} className="relative group">
                        {/* Timeline Bullet */}
                        <div className={`absolute -left-[33px] top-1.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                          letter.direction === 'incoming'
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {letter.direction === 'incoming' ? (
                            <Inbox className="w-3 h-3" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                        </div>

                        {/* Letter Card */}
                        <div
                          onClick={() => onSelectRecord(letter)}
                          className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 shadow-xs transition-all cursor-pointer space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 font-mono">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                letter.direction === 'incoming' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {letter.direction === 'incoming' ? 'INCOMING (PCAA)' : 'OUTGOING (AIRBLUE)'}
                              </span>
                              <span className="font-bold text-slate-900">{letter.internalRef}</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-600">{letter.pcaaRefNumber}</span>
                            </div>

                            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{letter.letterDate}</span>
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-900 text-xs">
                            {letter.subject}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {letter.aiSummary || letter.extractedText.substring(0, 140) + '...'}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <div>
                              <span>From: <strong>{letter.sender}</strong></span>
                              <span className="mx-2">·</span>
                              <span>To: <strong>{letter.recipient}</strong></span>
                            </div>

                            <span className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                              <span>Inspect Document</span>
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
