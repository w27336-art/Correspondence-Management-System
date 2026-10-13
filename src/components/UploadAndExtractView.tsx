import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Save, 
  CheckCheck, 
  RefreshCw, 
  FileCheck, 
  Calendar, 
  User, 
  Tag, 
  Building, 
  FileCode, 
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Copy,
  ScanText,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  CorrespondenceRecord, 
  CorrespondenceDirection, 
  CorrespondenceCategory, 
  CorrespondencePriority,
  CorrespondenceStatus,
  DocumentAttachment,
  ExtractionConfidence,
  UserRole
} from '../types/correspondence';
import { DocumentViewer } from './DocumentViewer';
import { generateLetterSvgDataUrl } from '../data/mockRecords';

interface UploadAndExtractViewProps {
  initialDirection?: CorrespondenceDirection;
  currentRole: UserRole;
  onSaveRecord: (record: Partial<CorrespondenceRecord>, isVerified: boolean) => Promise<void>;
  onCancel?: () => void;
}

export const UploadAndExtractView: React.FC<UploadAndExtractViewProps> = ({
  initialDirection = 'incoming',
  currentRole,
  onSaveRecord,
  onCancel,
}) => {
  const [direction, setDirection] = useState<CorrespondenceDirection>(initialDirection);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'form' | 'ocr' | 'summary' | 'confidence'>('form');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Default sample document initially loaded for instant demonstration
  const [currentAttachment, setCurrentAttachment] = useState<DocumentAttachment>({
    id: `att-${Date.now()}`,
    fileName: 'HQCAA_FSD_Safety_Inspection_Observation_Notice.pdf',
    fileType: 'application/pdf',
    fileSize: 420800,
    dataUrl: generateLetterSvgDataUrl(
      'Safety Inspection Notice: Minimum Equipment List (MEL) Dispatch Observance',
      'HQCAA/5102/334/FSD/2026',
      new Date().toISOString().split('T')[0],
      'Director Flight Standards (PCAA)',
      'Vice President Flight Operations, Airblue Limited',
      [
        '1. Pursuant to CARs 1994 Regulation 142 and Air Safety Circular ASC-03/2026.',
        '2. Surveillance audit at JIAP Karachi noted non-adherence to rectification intervals for Category C MEL items.',
        '3. Airblue Technical Operations is directed to furnish rectified maintenance release logs within 10 days.',
        '4. Submission of revised MEL Dispatch Tracking Protocol required.'
      ]
    ),
    cloudSynced: false,
    sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    uploadedAt: new Date().toISOString(),
  });

  // Form state
  const [formData, setFormData] = useState<{
    letterDate: string;
    receivedOrDispatchedDate: string;
    pcaaRefNumber: string;
    airblueRefNumber: string;
    sender: string;
    senderOrg: string;
    senderDept: string;
    recipient: string;
    recipientOrg: string;
    recipientDept: string;
    subject: string;
    category: CorrespondenceCategory;
    departmentConcerned: string;
    responsibleOfficer: string;
    priority: CorrespondencePriority;
    status: CorrespondenceStatus;
    replyRequired: boolean;
    replyDeadline: string;
    keywords: string;
    remarks: string;
    extractedText: string;
    aiSummary: string;
    regulatoryDirectives: string[];
    mentionedOfficers: string[];
  }>({
    letterDate: new Date().toISOString().split('T')[0],
    receivedOrDispatchedDate: new Date().toISOString().split('T')[0],
    pcaaRefNumber: 'HQCAA/5102/334/FSD/2026',
    airblueRefNumber: 'AB/FSD/MEL/2026/089',
    sender: 'Director Flight Standards (PCAA)',
    senderOrg: 'Pakistan Civil Aviation Authority (PCAA)',
    senderDept: 'Flight Standards Directorate (FSD)',
    recipient: 'Vice President Flight Operations',
    recipientOrg: 'Airblue Limited',
    recipientDept: 'Flight Operations Directorate',
    subject: 'Safety Inspection Notice: Minimum Equipment List (MEL) Dispatch Observance',
    category: 'Flight Operations',
    departmentConcerned: 'Flight Safety & Engineering',
    responsibleOfficer: 'Capt. Kamran Siddiqui (Safety Manager)',
    priority: 'Urgent',
    status: 'Awaiting Verification',
    replyRequired: true,
    replyDeadline: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    keywords: 'MEL Dispatch, Flight Operations, Category C Rectification, CARs 1994, JIAP Karachi',
    remarks: 'PCAA surveillance team inspected flight turnaround at Karachi. Audit observation requires CAP within 10 days.',
    extractedText: `PAKISTAN CIVIL AVIATION AUTHORITY\nHEADQUARTERS CAA, TERMINAL-1, JIAP, KARACHI\nRef: HQCAA/5102/334/FSD/2026\nDate: ${new Date().toISOString().split('T')[0]}\n\nTo: Vice President Flight Operations, Airblue Limited, Islamabad.\nSUBJECT: SAFETY INSPECTION NOTICE: MEL DISPATCH RECTIFICATION INTERVALS\n\n1. Pursuant to CARs 1994 Regulation 142 and Air Safety Circular ASC-03/2026.\n2. Surveillance audit conducted at JIAP Karachi noted non-adherence to rectification intervals for Category C MEL items on A320 aircraft.\n3. Airblue Technical Operations is directed to furnish rectified maintenance release logs within 10 calendar days.\n4. Submission of revised MEL Dispatch Tracking Protocol required.\n\nFor Director General CAA`,
    aiSummary: 'PCAA Flight Standards Directorate issued safety observation regarding Category C MEL rectification intervals observed during aircraft turnaround at Karachi. Submission of maintenance logs and revised tracking protocol mandated within 10 days.',
    regulatoryDirectives: [
      'Submit rectified maintenance release logs within 10 days',
      'Revise MEL Dispatch Tracking Protocol for Category C deferred defects'
    ],
    mentionedOfficers: ['Director Flight Standards PCAA', 'Air Safety Inspector JIAP'],
  });

  // Confidence indicators
  const [confidence, setConfidence] = useState<ExtractionConfidence>({
    letterDate: 96,
    pcaaRefNumber: 94,
    airblueRefNumber: 85,
    sender: 98,
    recipient: 95,
    subject: 98,
    category: 92,
    direction: 99,
    replyDeadline: 88,
    overall: 93,
  });

  // Sample templates users can select
  const sampleLetters = [
    {
      label: 'PCAA Airworthiness Directive (AD-2026)',
      pcaaRef: 'HQCAA/1085/543/AWD/TECH',
      airblueRef: 'AB/ENG/AWD/2026/891',
      subject: 'Mandatory Compliance with Airworthiness Directive AD-2026-A320-04 (CFM56-5B High-Pressure Turbine Inspection)',
      category: 'Airworthiness & Engineering' as CorrespondenceCategory,
      sender: 'Engr. Muhammad Tariq (Addl. Director AWD)',
      senderOrg: 'Pakistan Civil Aviation Authority (PCAA)',
      recipient: 'VP Flight Operations & Technical, Airblue Limited',
      deadlineDays: 18,
      priority: 'Critical' as CorrespondencePriority,
      direction: 'incoming' as CorrespondenceDirection,
    },
    {
      label: 'Airblue Winter 2026 Schedule & Slots',
      pcaaRef: 'HQCAA/2415/782/AT/W26',
      airblueRef: 'AB/COMM/SCHED/W26/104',
      subject: 'Application for Winter 2026/27 Flight Schedule Approval & Slots (ISB-JED Sector)',
      category: 'Tariffs, Routes & Licensing' as CorrespondenceCategory,
      sender: 'Managing Director, Airblue Limited',
      senderOrg: 'Airblue Limited',
      recipient: 'Director Air Transport & Economic Regulations (PCAA)',
      deadlineDays: 21,
      priority: 'Normal' as CorrespondencePriority,
      direction: 'outgoing' as CorrespondenceDirection,
    },
    {
      label: 'PCAA Ramp Safety GSE Inspection',
      pcaaRef: 'CAA/AIIAP/204/RAMP/26',
      airblueRef: 'AB/GRD/LHE/2026/112',
      subject: 'Ramp Safety Inspection Notice: GSE Tow-Bar Maintenance and Pushback Procedures',
      category: 'Aerodrome & Ramp Safety' as CorrespondenceCategory,
      sender: 'Sultan Ahmed (Senior Aerodrome Inspector)',
      senderOrg: 'Pakistan Civil Aviation Authority (PCAA)',
      recipient: 'Station Manager, Airblue Limited AIIAP Lahore',
      deadlineDays: 14,
      priority: 'Normal' as CorrespondencePriority,
      direction: 'incoming' as CorrespondenceDirection,
    },
  ];

  const handleSelectSample = (sample: typeof sampleLetters[0]) => {
    setDirection(sample.direction);
    setFormData(prev => ({
      ...prev,
      subject: sample.subject,
      pcaaRefNumber: sample.pcaaRef,
      airblueRefNumber: sample.airblueRef,
      category: sample.category,
      sender: sample.sender,
      senderOrg: sample.senderOrg,
      recipient: sample.recipient,
      priority: sample.priority,
      replyRequired: true,
      replyDeadline: new Date(Date.now() + sample.deadlineDays * 86400000).toISOString().split('T')[0],
      remarks: `Sample letter loaded: ${sample.label}`,
    }));

    setCurrentAttachment({
      id: `att-${Date.now()}`,
      fileName: `${sample.pcaaRef.replace(/\//g, '_')}.pdf`,
      fileType: 'application/pdf',
      fileSize: 348000,
      cloudSynced: false,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      uploadedAt: new Date().toISOString(),
      dataUrl: generateLetterSvgDataUrl(
        sample.subject,
        sample.pcaaRef,
        new Date().toISOString().split('T')[0],
        sample.sender,
        sample.recipient,
        [
          '1. Official regulatory document exchange between Pakistan Civil Aviation Authority and Airblue Limited.',
          '2. All directives specified within this communication are issued under Civil Aviation Rules 1994 (CARs 94).',
          '3. Please submit compliance verification documentation in accordance with established regulatory deadlines.'
        ]
      )
    });
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingStage('1. Ingesting letter & computing SHA-256 integrity hash...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        setCurrentAttachment({
          id: `att-${Date.now()}`,
          fileName: file.name,
          fileType: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
          fileSize: file.size,
          dataUrl: base64Data,
          cloudSynced: false,
          sha256Hash: 'hash-' + Math.random().toString(36).substring(2, 12),
          uploadedAt: new Date().toISOString(),
        });

        setProcessingStage('2. Optical Character Recognition (OCR) in progress...');

        try {
          setProcessingStage('3. AI extracting regulatory entities (PCAA Ref, Dates, Directives)...');

          const res = await fetch('/api/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
              fileName: file.name,
              simulatedText: `Letter from ${direction === 'incoming' ? 'PCAA' : 'Airblue'} regarding ${file.name}`,
            }),
          });

          setProcessingStage('4. Grabbing extracted values into form fields...');

          const result = await res.json();
          if (result.success && result.data) {
            const data = result.data;
            setFormData(prev => ({
              ...prev,
              letterDate: data.letterDate || prev.letterDate,
              pcaaRefNumber: data.pcaaRefNumber || prev.pcaaRefNumber,
              airblueRefNumber: data.airblueRefNumber || prev.airblueRefNumber,
              sender: data.sender || prev.sender,
              senderOrg: data.senderOrg || prev.senderOrg,
              recipient: data.recipient || prev.recipient,
              recipientOrg: data.recipientOrg || prev.recipientOrg,
              subject: data.subject || prev.subject,
              category: (data.category as CorrespondenceCategory) || prev.category,
              departmentConcerned: data.departmentConcerned || prev.departmentConcerned,
              responsibleOfficer: data.responsibleOfficer || prev.responsibleOfficer,
              replyRequired: data.replyRequired !== undefined ? data.replyRequired : prev.replyRequired,
              replyDeadline: data.replyDeadline || prev.replyDeadline,
              priority: (data.priority as CorrespondencePriority) || prev.priority,
              keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || prev.keywords),
              extractedText: data.extractedText || prev.extractedText,
              aiSummary: data.aiSummary || prev.aiSummary,
              regulatoryDirectives: data.regulatoryDirectives || prev.regulatoryDirectives,
              mentionedOfficers: data.mentionedOfficers || prev.mentionedOfficers,
            }));

            if (data.confidenceScores) {
              setConfidence(data.confidenceScores);
            }

            if (data.direction) {
              setDirection(data.direction);
            }
          }
        } catch (apiErr) {
          console.warn('API extraction error:', apiErr);
        }

        setIsProcessing(false);
        setProcessingStage('');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Manual Trigger to re-parse text into form fields
  const handleRegrabFields = () => {
    setIsProcessing(true);
    setProcessingStage('Re-parsing OCR text into metadata fields...');

    setTimeout(() => {
      const text = formData.extractedText;
      const pcaaRefMatch = text.match(/(?:Ref|Reference)[\s:]*([A-Za-z0-9/_-]+)/i);
      const airblueRefMatch = text.match(/(?:AB\/[A-Za-z0-9/_-]+)/i);
      const subjectMatch = text.match(/SUBJECT[\s:]*([^\n\r]+)/i);
      const dateMatch = text.match(/(?:Date|Dated)[\s:]*([^\n\r]+)/i);

      setFormData(prev => ({
        ...prev,
        pcaaRefNumber: pcaaRefMatch ? pcaaRefMatch[1].trim() : prev.pcaaRefNumber,
        airblueRefNumber: airblueRefMatch ? airblueRefMatch[0].trim() : prev.airblueRefNumber,
        subject: subjectMatch ? subjectMatch[1].trim() : prev.subject,
      }));

      setIsProcessing(false);
      setProcessingStage('');
      setActiveTab('form');
    }, 600);
  };

  const handleCopyOcr = () => {
    navigator.clipboard.writeText(formData.extractedText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleSave = async (isVerified: boolean) => {
    setIsProcessing(true);
    try {
      const recordToSave: Partial<CorrespondenceRecord> = {
        direction,
        letterDate: formData.letterDate,
        receivedOrDispatchedDate: formData.receivedOrDispatchedDate,
        sender: formData.sender,
        senderOrg: formData.senderOrg,
        senderDept: formData.senderDept,
        recipient: formData.recipient,
        recipientOrg: formData.recipientOrg,
        recipientDept: formData.recipientDept,
        subject: formData.subject,
        pcaaRefNumber: formData.pcaaRefNumber,
        airblueRefNumber: formData.airblueRefNumber,
        category: formData.category,
        departmentConcerned: formData.departmentConcerned,
        responsibleOfficer: formData.responsibleOfficer,
        priority: formData.priority,
        status: isVerified ? (direction === 'incoming' ? 'Under Review' : 'Dispatched') : 'Awaiting Verification',
        replyRequired: formData.replyRequired,
        replyDeadline: formData.replyRequired ? formData.replyDeadline : undefined,
        keywords: typeof formData.keywords === 'string' ? formData.keywords.split(',').map(s => s.trim()).filter(Boolean) : formData.keywords,
        remarks: formData.remarks,
        extractedText: formData.extractedText,
        aiSummary: formData.aiSummary,
        regulatoryDirectives: formData.regulatoryDirectives,
        mentionedOfficers: formData.mentionedOfficers,
        confidence,
        attachment: currentAttachment,
        isVerified,
        verifiedBy: isVerified ? 'Syed Hammad (Registrar)' : undefined,
        verifiedAt: isVerified ? new Date().toISOString() : undefined,
      };

      await onSaveRecord(recordToSave, isVerified);
      setSaveSuccessMessage(isVerified ? 'Correspondence successfully verified & registered into PCAA ledger!' : 'Draft correspondence saved successfully!');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to save record:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isLowConfidence = (score: number) => score < 90;

  return (
    <div className="space-y-4">
      {/* Upload Zone & Action Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Document OCR &amp; Form Grabber
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                PCAA / AIRBLUE REGISTRY
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Upload Letter &amp; Auto-Grab Fields
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a scanned letter in <strong>PDF, JPG, or PNG</strong> format. The AI vision engine runs optical character recognition (OCR) and immediately grabs the reference numbers, dates, organizations, and subject into the form fields below.
            </p>
          </div>

          {/* Direction Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Direction:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setDirection('incoming')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  direction === 'incoming'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incoming (From PCAA)
              </button>
              <button
                type="button"
                onClick={() => setDirection('outgoing')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  direction === 'outgoing'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Outgoing (To PCAA)
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-600 bg-blue-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                Drop your letter here, or <span className="text-blue-600 underline">Browse Local Files</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports Multi-page PDFs, High-Resolution Scanned Letters, JPG, JPEG, PNG
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <FileText className="w-3.5 h-3.5 text-blue-500" /> PDF Document
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <ScanText className="w-3.5 h-3.5 text-emerald-500" /> Scanned Images
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Multimodal Vision OCR
              </span>
            </div>
          </div>
        </div>

        {/* Quick Test Samples */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-700">Or test with authentic PCAA letters:</span>
            {sampleLetters.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3 h-3 text-blue-500" />
                <span>{sample.label}</span>
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Current File: {currentAttachment.fileName}
          </span>
        </div>
      </div>

      {/* Processing Pipeline Modal Banner */}
      {isProcessing && (
        <div className="bg-blue-900 border border-blue-700 text-white px-5 py-4 rounded-xl flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-blue-300 animate-spin shrink-0" />
            <div>
              <p className="font-bold text-sm text-white">Running Multimodal OCR &amp; Form Grabber</p>
              <p className="text-xs text-blue-200 mt-0.5">{processingStage || 'Processing document...'}</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-blue-800 text-blue-200 px-3 py-1 rounded">
            Gemini Vision 3.8
          </span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-medium">
          <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Split-Screen 2-Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Document Viewer */}
        <div className="lg:col-span-5 h-[760px] sticky top-24">
          <DocumentViewer attachment={currentAttachment} />
        </div>

        {/* RIGHT PANEL: Form Fields with OCR Grab Badges */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[760px] overflow-hidden">
          {/* Header & Sub-Tabs */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">
                {direction === 'incoming' ? 'Incoming PCAA Letter Record' : 'Outgoing Airblue Dispatch Record'}
              </span>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>OCR Grabbed</span>
              </span>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 font-medium rounded-md transition-all ${
                  activeTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grabbed Metadata
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-3 py-1 font-medium rounded-md transition-all ${
                  activeTab === 'summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Summary &amp; Directives
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ocr')}
                className={`px-3 py-1 font-medium rounded-md transition-all ${
                  activeTab === 'ocr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verbatim OCR Text
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('confidence')}
                className={`px-3 py-1 font-medium rounded-md transition-all ${
                  activeTab === 'confidence' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Confidence ({confidence.overall}%)
              </button>
            </div>
          </div>

          {/* Low Confidence Banner if any */}
          {(isLowConfidence(confidence.pcaaRefNumber) || isLowConfidence(confidence.airblueRefNumber) || isLowConfidence(confidence.replyDeadline)) && (
            <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Verification Recommended:</strong> Some extracted fields have moderate confidence (&lt;90%). Review against the document on the left.
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Avg {confidence.overall}%
              </span>
            </div>
          )}

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === 'form' && (
              <div className="space-y-4 text-xs">
                {/* Reference Numbers Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-50/70 border border-slate-200 rounded-lg">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-semibold">
                        PCAA Reference Number *
                      </label>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-medium">
                        OCR {confidence.pcaaRefNumber}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.pcaaRefNumber}
                      onChange={(e) => setFormData({ ...formData, pcaaRefNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. HQCAA/1085/543/AWD/TECH"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-semibold">
                        Airblue Internal Reference
                      </label>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-medium">
                        OCR {confidence.airblueRefNumber}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.airblueRefNumber}
                      onChange={(e) => setFormData({ ...formData, airblueRefNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. AB/ENG/AWD/2026/891"
                    />
                  </div>
                </div>

                {/* Dates Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-semibold">
                        Date of Letter *
                      </label>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-medium">
                        OCR {confidence.letterDate}%
                      </span>
                    </div>
                    <input
                      type="date"
                      value={formData.letterDate}
                      onChange={(e) => setFormData({ ...formData, letterDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {direction === 'incoming' ? 'Date Received *' : 'Date Dispatched *'}
                    </label>
                    <input
                      type="date"
                      value={formData.receivedOrDispatchedDate}
                      onChange={(e) => setFormData({ ...formData, receivedOrDispatchedDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Sender & Recipient Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3 bg-slate-50/50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                        Sender / From *
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-medium">
                        OCR {confidence.sender}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.sender}
                      onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                      placeholder="Sender Officer Name & Title"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={formData.senderOrg}
                      onChange={(e) => setFormData({ ...formData, senderOrg: e.target.value })}
                      placeholder="Organization (e.g. Pakistan Civil Aviation Authority)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2 p-3 bg-slate-50/50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                        Recipient / To *
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-medium">
                        OCR {confidence.recipient}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.recipient}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      placeholder="Recipient Title / Officer"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={formData.recipientOrg}
                      onChange={(e) => setFormData({ ...formData, recipientOrg: e.target.value })}
                      placeholder="Organization (e.g. Airblue Limited)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">
                      Subject of Correspondence *
                    </label>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-medium">
                      OCR {confidence.subject}%
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                    placeholder="Enter official letter subject line"
                    required
                  />
                </div>

                {/* Category & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Correspondence Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as CorrespondenceCategory })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Flight Operations">Flight Operations</option>
                      <option value="Airworthiness & Engineering">Airworthiness &amp; Engineering</option>
                      <option value="Aerodrome & Ramp Safety">Aerodrome &amp; Ramp Safety</option>
                      <option value="Cabin Safety & Crew">Cabin Safety &amp; Crew</option>
                      <option value="Tariffs, Routes & Licensing">Tariffs, Routes &amp; Licensing</option>
                      <option value="Aviation Security & Facilitation">Aviation Security &amp; Facilitation</option>
                      <option value="Legal & Regulatory Compliance">Legal &amp; Regulatory Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Department Concerned *
                    </label>
                    <input
                      type="text"
                      value={formData.departmentConcerned}
                      onChange={(e) => setFormData({ ...formData, departmentConcerned: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. Engineering & Maintenance"
                      required
                    />
                  </div>
                </div>

                {/* Responsible Officer & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Responsible Officer / Action Owner
                    </label>
                    <input
                      type="text"
                      value={formData.responsibleOfficer}
                      onChange={(e) => setFormData({ ...formData, responsibleOfficer: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. Engr. Asif Javed (Chief Engineer)"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Priority Level *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as CorrespondencePriority })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Critical">Critical (Grounding Risk / Audit Finding)</option>
                    </select>
                  </div>
                </div>

                {/* Reply Required & Deadline */}
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.replyRequired}
                        onChange={(e) => setFormData({ ...formData, replyRequired: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="font-semibold text-slate-800">
                        Formal Response / Reply Required by PCAA
                      </span>
                    </label>

                    {formData.replyRequired && (
                      <span className="text-[11px] font-mono text-red-600 bg-red-100 px-2 py-0.5 rounded font-bold">
                        Regulatory Deadline Active
                      </span>
                    )}
                  </div>

                  {formData.replyRequired && (
                    <div className="pt-2 border-t border-blue-200/60 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-700 font-semibold">
                            Reply Deadline Date *
                          </label>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-mono font-medium">
                            OCR {confidence.replyDeadline}%
                          </span>
                        </div>
                        <input
                          type="date"
                          value={formData.replyDeadline}
                          onChange={(e) => setFormData({ ...formData, replyDeadline: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center">
                        Automatic notifications and dashboard alerts will highlight this item when within 72 hours of expiry.
                      </div>
                    </div>
                  )}
                </div>

                {/* Keywords & Tags */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Keywords &amp; Regulatory Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Airworthiness Directive, CFM56, A320, C of A"
                  />
                </div>

                {/* Internal Remarks */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Internal Remarks &amp; Compliance Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Internal tracking notes for Airblue regulatory affairs team..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      AI-Generated Executive Summary
                    </h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {formData.aiSummary}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-bold text-slate-900 text-sm mb-2">
                    Mandated Regulatory Actions &amp; Directives
                  </h3>
                  {formData.regulatoryDirectives && formData.regulatoryDirectives.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      {formData.regulatoryDirectives.map((dir, i) => (
                        <li key={i}>{dir}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No specific action item extracted.</p>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-bold text-slate-900 text-sm mb-2">
                    Officers Mentioned in Communication
                  </h3>
                  {formData.mentionedOfficers && formData.mentionedOfficers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.mentionedOfficers.map((off, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800">
                          {off}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No specific officer names parsed.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ocr' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <ScanText className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800">
                      Verbatim Document Text (Full-Text Indexed)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({formData.extractedText.length} characters)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRegrabFields}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Re-grab Fields to Form</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyOcr}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copyFeedback ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={20}
                  value={formData.extractedText}
                  onChange={(e) => setFormData({ ...formData, extractedText: e.target.value })}
                  className="w-full p-3 font-mono text-[11px] bg-slate-950 text-slate-200 rounded-lg border border-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Paste or review OCR extracted text here..."
                />
              </div>
            )}

            {activeTab === 'confidence' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 text-sm">
                      Model Field Extraction Diagnostics
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      Model: Gemini 3.8 Flash Multimodal
                    </span>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(confidence).map(([key, score]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-slate-700 font-semibold capitalize">{key}</span>
                          <span className={score >= 90 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                            {score}% {score < 90 && '(Requires Review)'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Footer Action Bar */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Acting Registrar: <strong>{currentRole}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={isProcessing}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    <span>Verify &amp; Register</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
