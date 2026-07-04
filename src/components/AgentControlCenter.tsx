import React, { useState, useEffect } from 'react';
import { 
  Cpu, FileText, Landmark, Truck, TrendingUp, AlertTriangle, CheckCircle, Clock, Send, Play, RefreshCw, Layers, Shield, Sparkles, MapPin, Search, ArrowRight, UserCheck, DollarSign, Download, Upload, X, Check, ShieldCheck, Plus
} from 'lucide-react';
import { AgentLog, NegotiationTurn, SimulationState } from '../types';
import { INDIAN_HUBS, getHubDistance, calculateFastagFee, calculateGstBreakdown, scanUploadedFile, GstBreakdown } from '../utils/indiaTaxAndFreight';
import EnterpriseModal from './EnterpriseModal';
import { translations } from '../utils/translations';

interface AgentControlCenterProps {
  language?: string;
  theme?: string;
}

export default function AgentControlCenter({ language = 'en', theme = 'dark' }: AgentControlCenterProps) {
  const t = translations[language] || translations['en'];
  const isLight = theme === 'light';

  // Simulator state
  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: 'l1',
      timestamp: '01:09:15',
      agent: 'Core orchestrator',
      status: 'info',
      message: 'Kinetix.ai Autonomous Core Operating System successfully initialized on node: cloud-run-mumbai-01.',
      details: 'All security channels verified. API integrations with National Informatics Centre (NIC) and ONDC registries established.'
    },
    {
      id: 'l2',
      timestamp: '01:09:18',
      agent: 'GST Compliance',
      status: 'success',
      message: 'Automated GSTR-2B compliance scan completed for Tenant ID: T-820 (Mahindra Engineering).',
      details: '98.2% of invoices matched with GSTR-2B ledger. 1 anomaly detected.'
    },
    {
      id: 'l3',
      timestamp: '01:09:25',
      agent: 'OCR Intelligence',
      status: 'info',
      message: 'Pending ingestion queue: 3 cargo dispatch challans detected in Chakan facility.',
    }
  ]);

  const [simState, setSimState] = useState<SimulationState>({
    isActive: true,
    activeOrderCount: 12,
    unresolvedExceptions: 1,
    savingsGeneratedINR: 2489200,
    autoMatchedRate: 94.5
  });

  const [activeTab, setActiveTab] = useState<'hq' | 'ocr' | 'negotiation' | 'logistics' | 'gst' | 'warehouse'>('hq');

  // Enterprise Lead Modal State
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);

  // Managed Hubs Status List (Customizable by user)
  const [hubStatus, setHubStatus] = useState<Record<string, 'ONLINE' | 'STANDBY' | 'MAINTENANCE'>>({
    'pune': 'ONLINE',
    'nagpur': 'ONLINE',
    'jajpur': 'STANDBY',
    'mumbai': 'ONLINE',
    'wardha': 'ONLINE',
    'raipur': 'ONLINE',
    'jamshedpur': 'ONLINE'
  });

  // OCR Interactive Sandbox state
  const [selectedOcrTemplate, setSelectedOcrTemplate] = useState<'tata' | 'ultratech' | 'jk' | 'custom'>('tata');
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [ocrResult, setOcrResult] = useState<any>(null);
  
  // Custom OCR fields
  const [ocrVendorState, setOcrVendorState] = useState('pune'); // Pune Chakan
  const [ocrConsigneeState, setOcrConsigneeState] = useState('pune'); // Pune Chakan
  const [ocrTonnage, setOcrTonnage] = useState(45);
  const [ocrRatePerTon, setOcrRatePerTon] = useState(45500);
  const [ocrMaterialType, setOcrMaterialType] = useState<'steel' | 'cement'>('steel');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Negotiation Simulator state
  const [negotiationActive, setNegotiationActive] = useState(false);
  const [negotiationRound, setNegotiationRound] = useState(0);
  const [negotiationLog, setNegotiationLog] = useState<NegotiationTurn[]>([]);
  const [targetSteelPrice, setTargetSteelPrice] = useState(44000);
  const [currentOfferPrice, setCurrentOfferPrice] = useState(48500);

  // Custom Negotiation parameters
  const [negSupplierName, setNegSupplierName] = useState('Tata Steel Distributor');
  const [negMaterial, setNegMaterial] = useState('Hot-Rolled Steel Coils');
  const [negTonnage, setNegTonnage] = useState(50);
  const [negImmediatePayment, setNegImmediatePayment] = useState(true);

  // Logistics Router Sandbox state
  const [logSourceHub, setLogSourceHub] = useState('pune');
  const [logDestHub, setLogDestHub] = useState('nagpur');
  const [logProgress, setLogProgress] = useState(0);
  const [logTransitActive, setLogTransitActive] = useState(false);
  const [logSpeed, setLogSpeed] = useState(62);

  // GST Compliance Table state
  const [gstInvoiceList, setGstInvoiceList] = useState([
    {
      id: 'inv_1',
      vendor: 'Tata Steel Distributor',
      invoiceNo: 'TS/2026/CHAK-9921',
      hsnCode: '7208',
      gstin: '27AAACT1290P1ZX',
      taxValue: 344250,
      status: 'Matched',
      autoAction: 'Payment Released',
      allowOverride: false
    },
    {
      id: 'inv_2',
      vendor: 'Ultratech Cement',
      invoiceNo: 'UT/CEMENT/W-821',
      hsnCode: '2523',
      gstin: '24AACU3391K1ZS',
      taxValue: 86800,
      status: 'Matched',
      autoAction: 'Payment Released',
      allowOverride: false
    },
    {
      id: 'inv_3',
      vendor: 'JK Cement Yard',
      invoiceNo: 'JKC/HQ/8811',
      hsnCode: '2523',
      gstin: '08AAACJ4491D2Z9',
      taxValue: 31500,
      status: 'Mismatch Flagged',
      autoAction: 'Treasury Lock Enabled',
      allowOverride: true
    }
  ]);

  // Add GST Invoice Form fields
  const [gstNewVendor, setGstNewVendor] = useState('');
  const [gstNewInvoiceNo, setGstNewInvoiceNo] = useState('');
  const [gstNewGstin, setGstNewGstin] = useState('');
  const [gstNewHsn, setGstNewHsn] = useState('');
  const [gstNewAmount, setGstNewAmount] = useState('');
  const [gstNewTaxRate, setGstNewTaxRate] = useState('18');
  const [gstNewStatus, setGstNewStatus] = useState<'Matched' | 'Mismatch Flagged'>('Matched');
  const [showAddGstModal, setShowAddGstModal] = useState(false);

  // Warehouse Safety Stock parameters
  const [burnRateMultiplier, setBurnRateMultiplier] = useState(1.0);

  // User manual order input
  const [promptCommand, setPromptCommand] = useState('');

  // Auto incremental logs during simulation
  useEffect(() => {
    if (!simState.isActive) return;

    const interval = setInterval(() => {
      const randomTrigger = Math.random();
      const timestamp = new Date().toTimeString().split(' ')[0];

      if (randomTrigger < 0.25) {
        // Add logistics update log
        const newLog: AgentLog = {
          id: `l_dyn_${Date.now()}`,
          timestamp,
          agent: 'Logistics Router',
          status: 'info',
          message: `Truck MH-12-KL-8921 (Pune -> Nagpur) bypassed Samruddhi toll plaza dynamically.`,
          details: 'FASTag payment of ₹850 processed via linked central bank treasury pool.'
        };
        setLogs(prev => [newLog, ...prev.slice(0, 15)]);
      } else if (randomTrigger < 0.5) {
        // Add savings increment
        const savingsIncrement = Math.floor(Math.random() * 4500) + 1200;
        setSimState(prev => ({
          ...prev,
          savingsGeneratedINR: prev.savingsGeneratedINR + savingsIncrement
        }));
        const newLog: AgentLog = {
          id: `l_dyn_${Date.now()}`,
          timestamp,
          agent: 'Negotiation Engine',
          status: 'success',
          message: `Dynamic freight commission matched. Net optimization saved customer ₹${savingsIncrement.toLocaleString('en-IN')}.`,
          details: 'Saved via empty-return consolidator discount.'
        };
        setLogs(prev => [newLog, ...prev.slice(0, 15)]);
      } else if (randomTrigger < 0.65) {
        // Add exception log
        const newLog: AgentLog = {
          id: `l_dyn_${Date.now()}`,
          timestamp,
          agent: 'GST Compliance',
          status: 'pending_approval',
          message: 'GSTIN mismatch detected in dispatch challan #UL-998 (Ultratech Vendor).',
          details: 'Invoice lists tax rate 18% but product HSN lists 28%. Paused automated clearing.',
          actionRequired: true
        };
        setLogs(prev => [newLog, ...prev.slice(0, 15)]);
        setSimState(prev => ({
          ...prev,
          unresolvedExceptions: prev.unresolvedExceptions + 1
        }));
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [simState.isActive]);

  // Handle OCR dynamic simulation
  const triggerOcrScan = () => {
    setOcrStatus('scanning');
    setTimeout(() => {
      setOcrStatus('success');
      const timestamp = new Date().toTimeString().split(' ')[0];
      
      let resultData: any = {};

      if (selectedOcrTemplate === 'tata') {
        const breakdown = calculateGstBreakdown(42.5, 45000, '27', '27', 'steel');
        resultData = {
          invoiceNo: 'TS/2026/CHAK-9921',
          vendorGstin: '27AAACT1290P1ZX',
          consigneeGstin: '27AABCM8812A2Z5',
          hsnCode: '7208 (Flat Rolled Iron)',
          rawMaterial: 'Hot-Rolled Steel Sheets (Grade C)',
          tonnage: 42.5,
          subtotalINR: breakdown.subtotal,
          gstRateApplied: `${breakdown.gstRate}%`,
          cgst: breakdown.cgst,
          sgst: breakdown.sgst,
          igst: breakdown.igst,
          netTotalINR: breakdown.netTotal,
          taxType: breakdown.taxType,
          complianceScore: '100% MATCH GSTR-2B'
        };
      } else if (selectedOcrTemplate === 'ultratech') {
        const breakdown = calculateGstBreakdown(60.0, 5166.66, '24', '27', 'cement');
        resultData = {
          invoiceNo: 'UT/CEMENT/W-821',
          vendorGstin: '24AACU3391K1ZS',
          consigneeGstin: '27AABCM8812A2Z5',
          hsnCode: '2523 (Portland Cement)',
          rawMaterial: 'Grade-43 Ordinary Portland Cement',
          tonnage: 60.0,
          subtotalINR: breakdown.subtotal,
          gstRateApplied: `${breakdown.gstRate}%`,
          cgst: breakdown.cgst,
          sgst: breakdown.sgst,
          igst: breakdown.igst,
          netTotalINR: breakdown.netTotal,
          taxType: breakdown.taxType,
          complianceScore: '100% MATCH GSTR-2B'
        };
      } else if (selectedOcrTemplate === 'jk') {
        const breakdown = calculateGstBreakdown(15.0, 7500, '08', '27', 'cement');
        resultData = {
          invoiceNo: 'JKC/HQ/8811',
          vendorGstin: '08AAACJ4491D2Z9',
          consigneeGstin: '27AABCM8812A2Z5',
          hsnCode: '2523 (Grey Portland Cement)',
          rawMaterial: 'High-Early Strength White Cement',
          tonnage: 15.0,
          subtotalINR: breakdown.subtotal,
          gstRateApplied: `${breakdown.gstRate}%`,
          cgst: breakdown.cgst,
          sgst: breakdown.sgst,
          igst: breakdown.igst,
          netTotalINR: breakdown.netTotal,
          taxType: breakdown.taxType,
          complianceScore: 'FLAGGED: Mismatch HSN database'
        };
      } else {
        // Custom Sandbox OCR Upload
        const vHub = INDIAN_HUBS[ocrVendorState] || INDIAN_HUBS['pune'];
        const cHub = INDIAN_HUBS[ocrConsigneeState] || INDIAN_HUBS['pune'];
        const breakdown = calculateGstBreakdown(ocrTonnage, ocrRatePerTon, vHub.gstPrefix, cHub.gstPrefix, ocrMaterialType);
        
        resultData = {
          invoiceNo: uploadedFileName ? `INV/${uploadedFileName.substring(0,6).toUpperCase()}/${Math.floor(Math.random() * 899 + 100)}` : `KTX/OCR/${Math.floor(Math.random() * 89999 + 10000)}`,
          vendorGstin: `${vHub.gstPrefix}AAACT1290P1ZX`,
          consigneeGstin: `${cHub.gstPrefix}AABCM8812A2Z5`,
          hsnCode: ocrMaterialType === 'cement' ? '2523 (Portland Cement)' : '7208 (Flat Rolled Iron)',
          rawMaterial: ocrMaterialType === 'cement' ? 'Ordinary Portland Cement (OPC)' : 'Structural Plate Steel Sheets',
          tonnage: ocrTonnage,
          subtotalINR: breakdown.subtotal,
          gstRateApplied: `${breakdown.gstRate}%`,
          cgst: breakdown.cgst,
          sgst: breakdown.sgst,
          igst: breakdown.igst,
          netTotalINR: breakdown.netTotal,
          taxType: breakdown.taxType,
          complianceScore: vHub.gstPrefix === '08' && ocrMaterialType === 'cement' ? 'FLAGGED: Inter-state custom threshold warning' : '100% MATCH GSTR-2B'
        };
      }

      setOcrResult(resultData);

      const scanLog: AgentLog = {
        id: `ocr_log_${Date.now()}`,
        timestamp,
        agent: 'OCR Intelligence',
        status: resultData.complianceScore.includes('FLAGGED') ? 'warning' : 'success',
        message: `OCR Processing Completed for Invoice #${resultData.invoiceNo}.`,
        details: `Parsed ${resultData.tonnage} Tons of ${resultData.rawMaterial}. Tax Structure: ${resultData.taxType}. GSTR matches validated.`
      };
      setLogs(prev => [scanLog, ...prev]);
    }, 1200);
  };

  // Run Real-time Negotiation simulation
  const startNegotiationSimulation = () => {
    setNegotiationActive(true);
    setNegotiationRound(1);
    
    // Initial offer from supplier is 10% higher than target price
    const initialOffer = Math.round(targetSteelPrice * 1.11);
    setCurrentOfferPrice(initialOffer);

    setNegotiationLog([
      {
        speaker: 'System',
        message: `Kinetix Broker Agent #3 initiated inverse auction corridor with ${negSupplierName}. Material: ${negMaterial} (${negTonnage} Tons). Target Budget: ₹${targetSteelPrice.toLocaleString('en-IN')}/Ton.`,
        pricePerTon: 0,
        deliveryDays: 0,
        timestamp: new Date().toTimeString().split(' ')[0]
      },
      {
        speaker: negSupplierName,
        message: `Namaste. We have received your RFQ. Spot market demand is tight, but we can prioritize your order of ${negTonnage} Tons. Best we can offer is ₹${initialOffer.toLocaleString('en-IN')}/Ton, delivered in 6 days.`,
        pricePerTon: initialOffer,
        deliveryDays: 6,
        timestamp: new Date().toTimeString().split(' ')[0]
      }
    ]);
  };

  const advanceNegotiationRound = () => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const initialOffer = Math.round(targetSteelPrice * 1.11);
    
    if (negotiationRound === 1) {
      setNegotiationRound(2);
      // Counter offer from agent
      const agentCounter = Math.round(targetSteelPrice * 1.02);
      // Supplier counter offer halfway
      const supplierCounter = Math.round((initialOffer + targetSteelPrice) / 2);
      
      setNegotiationLog(prev => [
        ...prev,
        {
          speaker: 'Kinetix.ai',
          message: `Distributor sales desk, we represent an active facility with high recurring monthly volume. We can lock this trade immediately with automated T+4 Hour treasury payment cleared on GST upload. We propose ₹${agentCounter.toLocaleString('en-IN')}/Ton with delivery in 4 days.`,
          pricePerTon: agentCounter,
          deliveryDays: 4,
          timestamp
        },
        {
          speaker: negSupplierName,
          message: `The quick payment guarantee via Kinetix Treasury is highly attractive for our working capital. However, ore margins are tight this quarter. We can meet you halfway at ₹${supplierCounter.toLocaleString('en-IN')}/Ton, delivered in 4 days.`,
          pricePerTon: supplierCounter,
          deliveryDays: 4,
          timestamp
        }
      ]);
      setCurrentOfferPrice(supplierCounter);
    } else if (negotiationRound === 2) {
      setNegotiationRound(3);
      // Final accepted price (slightly above target price, giving savings!)
      const finalPrice = Math.round(targetSteelPrice * 1.035);
      const totalSavings = (initialOffer - finalPrice) * negTonnage;

      setNegotiationLog(prev => [
        ...prev,
        {
          speaker: 'Kinetix.ai',
          message: `Understood. To finalize this trade before the session closes and bypass manual bank credit approvals, we present a final firm offer of ₹${finalPrice.toLocaleString('en-IN')}/Ton with instant compliance confirmation.`,
          pricePerTon: finalPrice,
          deliveryDays: 3,
          timestamp
        },
        {
          speaker: negSupplierName,
          message: `Outstanding. Verified immediate liquidity. We accept. Confirming ${negTonnage} Tons of ${negMaterial} at ₹${finalPrice.toLocaleString('en-IN')}/Ton, delivery to Pune cluster in 3 days. Send contract.`,
          pricePerTon: finalPrice,
          deliveryDays: 3,
          timestamp
        },
        {
          speaker: 'System',
          message: `✔ NEGOTIATION MATCHED. Saved client ₹${totalSavings.toLocaleString('en-IN')} against initial distributor quote (Margin Optimization achieved!). Corporate digital contract drafted.`,
          pricePerTon: finalPrice,
          deliveryDays: 3,
          timestamp
        }
      ]);
      setCurrentOfferPrice(finalPrice);
      setSimState(prev => ({
        ...prev,
        savingsGeneratedINR: prev.savingsGeneratedINR + totalSavings,
        activeOrderCount: prev.activeOrderCount + 1
      }));
    }
  };

  const resetNegotiation = () => {
    setNegotiationActive(false);
    setNegotiationRound(0);
    setNegotiationLog([]);
    setCurrentOfferPrice(48500);
  };

  // Human Approve Exception
  const resolveException = (id: string) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'success', message: l.message + ' (Approved by Operator)', actionRequired: false } : l));
    setSimState(prev => ({
      ...prev,
      unresolvedExceptions: Math.max(0, prev.unresolvedExceptions - 1)
    }));
  };

  // Handle command prompt submit
  const handleCommandPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptCommand.trim()) return;

    const timestamp = new Date().toTimeString().split(' ')[0];
    const userMessage = promptCommand;
    setPromptCommand('');

    // Pre-program responses
    const cmdLog: AgentLog = {
      id: `cmd_${Date.now()}`,
      timestamp,
      agent: 'Core orchestrator',
      status: 'info',
      message: `User Promoted: "${userMessage}"`,
      details: 'Analyzing text prompt via Gemini 2.5 Flash semantic parser...'
    };

    setLogs(prev => [cmdLog, ...prev]);

    setTimeout(() => {
      let agentReply: AgentLog;
      if (userMessage.toLowerCase().includes('steel') || userMessage.toLowerCase().includes('procure')) {
        agentReply = {
          id: `reply_${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          agent: 'Negotiation Engine',
          status: 'success',
          message: 'Procurement Request recognized. Steel inverse auction initialized.',
          details: 'Dispatched autonomous tenders to 12 verified steel yards in Maharashtra corridor.'
        };
        setActiveTab('negotiation');
        startNegotiationSimulation();
      } else if (userMessage.toLowerCase().includes('truck') || userMessage.toLowerCase().includes('logistics')) {
        agentReply = {
          id: `reply_${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          agent: 'Logistics Router',
          status: 'info',
          message: 'Logistics tracking optimized. Direct route telemetry matched.',
          details: 'Auto-allocating empty return truck routes to save 12% backhaul cost.'
        };
        setActiveTab('logistics');
      } else {
        agentReply = {
          id: `reply_${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          agent: 'Core orchestrator',
          status: 'success',
          message: 'Command executed successfully. Operational ledger metrics loaded.',
          details: 'All facility parameters verified and matched against active compliance standards.'
        };
      }
      setLogs(prev => [agentReply, ...prev]);
    }, 1000);
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 font-sans ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-[#050505] text-[#e2e8f0]'}`} id="kinetix-live-console">
      {/* Top Real-time Indicators */}
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 p-4 border-b backdrop-blur transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-[#0c0c0e]/95 border-[#1e293b]'}`} id="live-kpi-bar">
        <div className={`p-3 rounded-lg border transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200/80 shadow-sm' : 'bg-white/2 border-[#1e293b]'}`}>
          <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono mb-1">
            <Layers className="w-3.5 h-3.5 text-[#f97316]" /> {t.managedOrders.toUpperCase()}
          </div>
          <div className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{simState.activeOrderCount}</div>
        </div>

        <div className={`p-3 rounded-lg border transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200/80 shadow-sm' : 'bg-white/2 border-[#1e293b]'}`}>
          <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t.autoMatchRate.toUpperCase()}
          </div>
          <div className="text-xl font-bold font-mono text-emerald-500">{simState.autoMatchedRate}%</div>
        </div>

        <div className={`p-3 rounded-lg border col-span-2 md:col-span-1 transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200/80 shadow-sm' : 'bg-white/2 border-[#1e293b]'}`}>
          <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" /> {t.savingsGenerated.toUpperCase()}
          </div>
          <div className="text-xl font-bold font-mono text-[#f97316]">
            ₹{simState.savingsGeneratedINR.toLocaleString('en-IN')}
          </div>
        </div>

        <div className={`p-3 rounded-lg border transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200/80 shadow-sm' : 'bg-white/2 border-[#1e293b]'}`}>
          <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> {t.exceptionsPending.toUpperCase()}
          </div>
          <div className="text-xl font-bold font-mono text-rose-500">{simState.unresolvedExceptions}</div>
        </div>

        <div className={`p-3 rounded-lg border col-span-2 md:col-span-1 flex items-center justify-between transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200/80 shadow-sm' : 'bg-white/2 border-[#1e293b]'}`}>
          <div>
            <div className="text-xs text-gray-400 font-mono">{t.simulationState.toUpperCase()}</div>
            <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow shadow-emerald-500"></span> {t.engineLive.toUpperCase()}
            </div>
          </div>
          <button 
            onClick={() => setSimState(prev => ({ ...prev, isActive: !prev.isActive }))}
            className={`p-1.5 rounded-md hover:bg-white/5 transition border ${simState.isActive ? 'border-[#f97316]/30 text-[#f97316]' : 'border-gray-700 text-gray-400'}`}
          >
            <RefreshCw className={`w-4 h-4 ${simState.isActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Main Panel Division */}
      <div className={`flex flex-col lg:flex-row flex-1 overflow-hidden transition-all duration-200 ${isLight ? 'bg-slate-50' : 'bg-[#050505]'}`}>
        {/* Left Interactive Playground Area */}
        <div className={`flex-1 flex flex-col overflow-y-auto p-4 lg:p-6 immersive-grid-dots transition-all duration-200 ${isLight ? 'bg-white border-slate-200 border-r text-slate-800' : 'bg-gradient-to-br from-[#111111] to-[#050505] border-[#1e293b] border-r'}`}>
          {/* Section Selector */}
          <div className={`flex flex-wrap gap-1.5 p-1 rounded-lg border mb-6 transition-all duration-200 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/2 border-[#1e293b]'}`} id="simulator-subtabs">
            <button
              onClick={() => setActiveTab('hq')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition flex items-center gap-1.5 ${activeTab === 'hq' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-gray-400 hover:text-gray-200'}`}`}
            >
              <Cpu className="w-3.5 h-3.5" /> {t.tabHq.toUpperCase()}
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition flex items-center gap-1.5 ${activeTab === 'ocr' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-gray-400 hover:text-gray-200'}`}`}
            >
              <FileText className="w-3.5 h-3.5" /> {t.tabOcr.toUpperCase()}
            </button>
            <button
              onClick={() => setActiveTab('negotiation')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition flex items-center gap-1.5 ${activeTab === 'negotiation' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-gray-400 hover:text-gray-200'}`}`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> {t.tabNego.toUpperCase()}
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition flex items-center gap-1.5 ${activeTab === 'logistics' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-gray-400 hover:text-gray-200'}`}`}
            >
              <Truck className="w-3.5 h-3.5" /> {t.tabLogistics.toUpperCase()}
            </button>
            <button
              onClick={() => setActiveTab('gst')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition flex items-center gap-1.5 ${activeTab === 'gst' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-gray-400 hover:text-gray-200'}`}`}
            >
              <Landmark className="w-3.5 h-3.5" /> {t.tabGst.toUpperCase()}
            </button>
            <button
              onClick={() => setActiveTab('warehouse')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition flex items-center gap-1.5 ${activeTab === 'warehouse' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-gray-400 hover:text-gray-200'}`}`}
            >
              <Clock className="w-3.5 h-3.5" /> {t.tabWarehouse.toUpperCase()}
            </button>
          </div>

          {/* Tab 1: HQ & Prompt Order System */}
          {activeTab === 'hq' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border relative overflow-hidden transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b] text-gray-100'}`}>
                <div className={`absolute top-0 right-0 p-3 text-[10px] font-mono tracking-wider ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                  NODE: AUTONOMOUS_ORCHESTRATOR
                </div>
                <h3 className={`text-base font-sans font-medium flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>
                  <Sparkles className="w-4 h-4 text-[#f97316]" /> Prompt Command Center
                </h3>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Trigger supply chain events using semantic command processing. The orchestrator uses deep-reasoning models to break down requests into autonomous agent sub-tasks.
                </p>

                <form onSubmit={handleCommandPrompt} className="relative">
                  <input
                    type="text"
                    value={promptCommand}
                    onChange={(e) => setPromptCommand(e.target.value)}
                    placeholder="e.g. 'Order 50 tons of structural steel HR coils for Pune facility at budget ₹45,000'"
                    className={`w-full text-sm border rounded-lg pl-3 pr-12 py-3 focus:outline-none focus:border-[#f97316] font-sans shadow-inner transition ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white' : 'bg-black/40 border-[#1e293b] text-gray-100 placeholder-gray-500'}`}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 p-1.5 rounded-md bg-[#1e1b16] hover:bg-[#ea580c]/20 text-[#f97316] transition border border-[#f97316]/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className={`mt-3 flex flex-wrap gap-2 text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  <span className="font-mono">Try:</span>
                  <button 
                    onClick={() => setPromptCommand('Procure 50 tons of steel Grade-C coils')} 
                    className={`underline transition ${isLight ? 'text-[#ea580c] hover:text-[#c2410c]' : 'hover:text-white'}`}
                  >
                    "Procure 50 tons of steel"
                  </button>
                  <span>•</span>
                  <button 
                    onClick={() => setPromptCommand('Optimize logistics route for Wardha loading dock')} 
                    className={`underline transition ${isLight ? 'text-[#ea580c] hover:text-[#c2410c]' : 'hover:text-white'}`}
                  >
                    "Optimize Wardha routes"
                  </button>
                </div>
              </div>

              {/* Active Facilities Quick Status */}
              <div>
                <h4 className={`text-xs font-mono font-bold tracking-wider mb-3 uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Managed Facilities Dashboard</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border flex flex-col justify-between transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b]'}`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-gray-300'}`}>Pune Assembly-1</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-mono">ONLINE</span>
                      </div>
                      <div className={`text-[10px] font-mono mb-3 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>ID: FAC-PUNE-01</div>
                      <div className="text-xs flex justify-between mb-1">
                        <span className={isLight ? 'text-slate-500' : 'text-gray-300'}>Managed Steel Buffer:</span>
                        <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>42.5 Tons</span>
                      </div>
                    </div>
                    <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${isLight ? 'border-slate-100 text-slate-500' : 'border-gray-800/60 text-gray-400'}`}>
                      <span>Last Ingest: 2 hrs ago</span>
                      <span className="text-emerald-600 font-medium">Sufficient stock</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border flex flex-col justify-between transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b]'}`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-gray-300'}`}>Nagpur Cement Depot</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-mono">ONLINE</span>
                      </div>
                      <div className={`text-[10px] font-mono mb-3 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>ID: FAC-NAG-03</div>
                      <div className="text-xs flex justify-between mb-1">
                        <span className={isLight ? 'text-slate-500' : 'text-gray-300'}>Portland Cement Buffer:</span>
                        <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>12.2 Tons</span>
                      </div>
                    </div>
                    <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${isLight ? 'border-slate-100 text-slate-500' : 'border-gray-800/60'}`}>
                      <span className={isLight ? 'text-slate-400' : 'text-gray-400'}>Last Ingest: 3 days ago</span>
                      <span className="text-rose-600 flex items-center gap-0.5 font-medium"><Clock className="w-3 h-3" /> Reorder Needed</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border flex flex-col justify-between transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b]'}`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-gray-300'}`}>Jajpur Iron-Yard</span>
                        <span className="text-[10px] bg-[#f97316]/10 text-[#f97316] px-1.5 py-0.5 rounded font-mono">STANDBY</span>
                      </div>
                      <div className={`text-[10px] font-mono mb-3 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>ID: FAC-JAJ-02</div>
                      <div className="text-xs flex justify-between mb-1">
                        <span className={isLight ? 'text-slate-500' : 'text-gray-300'}>Iron Ore Silo:</span>
                        <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>140 Tons</span>
                      </div>
                    </div>
                    <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${isLight ? 'border-slate-100 text-slate-500' : 'border-gray-800/60 text-gray-400'}`}>
                      <span>Last Ingest: 1 day ago</span>
                      <span className="text-[#f97316] font-medium">Sufficient stock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: OCR Document Scanner Ingestion */}
          {activeTab === 'ocr' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border relative transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b] text-gray-100'}`}>
                <h3 className={`text-base font-sans font-medium flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>
                  <FileText className="w-4 h-4 text-[#f97316]" /> Intelligent OCR Document Ingestion
                </h3>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Simulate scanning multi-format paper delivery receipts, invoices, and GSTR sheets. The engine extracts semantic fields and cross-references data against NIC GST servers automatically.
                </p>

                {/* Simulated Template Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <button
                    onClick={() => { setSelectedOcrTemplate('tata'); setOcrStatus('idle'); setOcrResult(null); }}
                    className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                      selectedOcrTemplate === 'tata' 
                        ? 'border-[#f97316]/50 bg-[#f97316]/5 text-[#f97316] font-bold' 
                        : `${isLight ? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700' : 'border-gray-800 hover:border-gray-700 bg-zinc-950/40'}`
                    }`}
                  >
                    <span className="text-xs font-mono font-bold">TATA STEEL</span>
                    <span className="text-[10px] text-gray-400 mt-1">HR Coil Invoice</span>
                  </button>

                  <button
                    onClick={() => { setSelectedOcrTemplate('ultratech'); setOcrStatus('idle'); setOcrResult(null); }}
                    className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                      selectedOcrTemplate === 'ultratech' 
                        ? 'border-[#f97316]/50 bg-[#f97316]/5 text-[#f97316] font-bold' 
                        : `${isLight ? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700' : 'border-gray-800 hover:border-gray-700 bg-zinc-950/40'}`
                    }`}
                  >
                    <span className="text-xs font-mono font-bold">ULTRATECH</span>
                    <span className="text-[10px] text-gray-400 mt-1">Cement Challan</span>
                  </button>

                  <button
                    onClick={() => { setSelectedOcrTemplate('jk'); setOcrStatus('idle'); setOcrResult(null); }}
                    className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                      selectedOcrTemplate === 'jk' 
                        ? 'border-[#f97316]/50 bg-[#f97316]/5 text-[#f97316] font-bold' 
                        : `${isLight ? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700' : 'border-gray-800 hover:border-gray-700 bg-zinc-950/40'}`
                    }`}
                  >
                    <span className="text-xs font-mono font-bold">JK CEMENT</span>
                    <span className="text-[10px] text-rose-400 mt-1">Anomaly Challan</span>
                  </button>

                  <button
                    onClick={() => { setSelectedOcrTemplate('custom'); setOcrStatus('idle'); setOcrResult(null); }}
                    className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                      selectedOcrTemplate === 'custom' 
                        ? 'border-[#f97316]/50 bg-[#f97316]/5 text-[#f97316] font-bold animate-pulse' 
                        : `${isLight ? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700' : 'border-gray-800 hover:border-gray-700 bg-zinc-950/40'}`
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-[#f97316]">SANDBOX PRO</span>
                    <span className="text-[10px] text-gray-400 mt-1">Custom Doc upload</span>
                  </button>
                </div>

                {/* Custom Sandbox Fields Form */}
                {selectedOcrTemplate === 'custom' && (
                  <div className={`p-4 rounded-lg border mb-5 space-y-4 text-xs transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/35 border-gray-800'}`}>
                    <div className="text-xs font-bold text-[#f97316] font-mono flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-3.5 h-3.5" /> Configure Custom Ingest Parameters
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Vendor State */}
                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Vendor dispatch node</label>
                        <select
                          value={ocrVendorState}
                          onChange={(e) => { setOcrVendorState(e.target.value); setOcrStatus('idle'); }}
                          className={`w-full border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        >
                          <option value="pune">Pune Chakan (MH - GST: 27)</option>
                          <option value="nagpur">Nagpur Depot (MH - GST: 27)</option>
                          <option value="jajpur">Jajpur Iron Yard (OR - GST: 21)</option>
                          <option value="raipur">Raipur Yard (CG - GST: 22)</option>
                          <option value="jamshedpur">Jamshedpur Mill (JH - GST: 20)</option>
                        </select>
                      </div>

                      {/* Consignee State */}
                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Consignee delivery facility</label>
                        <select
                          value={ocrConsigneeState}
                          onChange={(e) => { setOcrConsigneeState(e.target.value); setOcrStatus('idle'); }}
                          className={`w-full border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        >
                          <option value="pune">Pune Factory (MH - GST: 27)</option>
                          <option value="nagpur">Nagpur Site (MH - GST: 27)</option>
                          <option value="jajpur">Jajpur Hub (OR - GST: 21)</option>
                        </select>
                      </div>

                      {/* Material Type Selection */}
                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Raw material category</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setOcrMaterialType('steel'); setOcrRatePerTon(45500); setOcrStatus('idle'); }}
                            className={`flex-1 py-1.5 rounded border font-mono font-bold transition ${ocrMaterialType === 'steel' ? 'border-[#f97316] bg-[#f97316]/10 text-[#f97316]' : `${isLight ? 'border-slate-300 bg-white text-slate-400' : 'border-gray-800 bg-zinc-950/40 text-gray-500'}`}`}
                          >
                            STEEL (18% GST)
                          </button>
                          <button
                            type="button"
                            onClick={() => { setOcrMaterialType('cement'); setOcrRatePerTon(6200); setOcrStatus('idle'); }}
                            className={`flex-1 py-1.5 rounded border font-mono font-bold transition ${ocrMaterialType === 'cement' ? 'border-[#f97316] bg-[#f97316]/10 text-[#f97316]' : `${isLight ? 'border-slate-300 bg-white text-slate-400' : 'border-gray-800 bg-zinc-950/40 text-gray-500'}`}`}
                          >
                            CEMENT (28% GST)
                          </button>
                        </div>
                      </div>

                      {/* Tonnage & Price Sliders */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Material Tonnage</label>
                          <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ocrTonnage} Tons</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="200"
                          step="5"
                          value={ocrTonnage}
                          onChange={(e) => { setOcrTonnage(Number(e.target.value)); setOcrStatus('idle'); }}
                          className="w-full accent-[#f97316]"
                        />
                      </div>

                      {/* Rate per Ton */}
                      <div className="col-span-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Base Rate Per Ton:</span>
                          <span className="text-emerald-600 font-bold font-mono">₹{ocrRatePerTon.toLocaleString('en-IN')}/Ton</span>
                        </div>
                        <input
                          type="range"
                          min={ocrMaterialType === 'steel' ? 38000 : 3500}
                          max={ocrMaterialType === 'steel' ? 65000 : 9500}
                          step={ocrMaterialType === 'steel' ? 500 : 100}
                          value={ocrRatePerTon}
                          onChange={(e) => { setOcrRatePerTon(Number(e.target.value)); setOcrStatus('idle'); }}
                          className="w-full accent-[#f97316]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Simulated Screen Area */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setUploadedFileName(file.name);
                      setSelectedOcrTemplate('custom');
                      const parsed = scanUploadedFile(file.name, file.size);
                      setOcrTonnage(parsed.tonnage);
                      setOcrRatePerTon(parsed.ratePerTon);
                      setOcrMaterialType(parsed.materialType);
                      triggerOcrScan();
                    }
                  }}
                  className={`border border-dashed rounded-lg p-8 flex flex-col items-center justify-center relative transition-all ${isLight ? 'bg-slate-50/50' : 'bg-black/40'} ${dragOver ? 'border-[#f97316] bg-[#f97316]/5 scale-[1.01]' : `${isLight ? 'border-slate-300' : 'border-[#1e293b]'}`}`}
                >
                  {/* File Upload Hidden Input */}
                  <input
                    type="file"
                    id="ocr-file-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFileName(file.name);
                        setSelectedOcrTemplate('custom');
                        const parsed = scanUploadedFile(file.name, file.size);
                        setOcrTonnage(parsed.tonnage);
                        setOcrRatePerTon(parsed.ratePerTon);
                        setOcrMaterialType(parsed.materialType);
                        triggerOcrScan();
                      }
                    }}
                  />

                  {ocrStatus === 'idle' && (
                    <div className="text-center space-y-3">
                      <Upload className={`w-10 h-10 mx-auto animate-bounce ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Drag & drop actual invoice PDF/PNG or click to browse</p>
                        <p className={`text-[10px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>SUPPORTED CORRIDORS: MAHARASHTRA, ODISHA, JHARKHAND, CHHATTISGARH</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => document.getElementById('ocr-file-upload')?.click()}
                          className={`px-3.5 py-2 border rounded-md text-xs font-bold font-mono transition ${isLight ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700' : 'bg-zinc-900 border-gray-800 hover:bg-zinc-800 text-gray-300'}`}
                        >
                          CHOOSE FILE
                        </button>
                        <button
                          onClick={triggerOcrScan}
                          className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-md text-xs font-bold font-mono transition shadow-md shadow-[#f97316]/10"
                        >
                          {selectedOcrTemplate === 'custom' ? 'PROCESS CUSTOM PARAMETERS' : 'RUN OCR ANALYSIS'}
                        </button>
                      </div>
                    </div>
                  )}

                  {ocrStatus === 'scanning' && (
                    <div className="text-center space-y-3 py-4">
                      <RefreshCw className="w-8 h-8 text-[#f97316] animate-spin mx-auto" />
                      <p className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>Running OCR Layouts Extraction, FASTag logs integration & GST compliance checks...</p>
                    </div>
                  )}

                  {ocrStatus === 'success' && ocrResult && (
                    <div className="w-full text-left space-y-4">
                      <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-slate-200' : 'border-gray-800'}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>INGESTION RESULTS</span>
                          {uploadedFileName && (
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-zinc-950 border-gray-800 text-gray-400'}`}>
                              File: {uploadedFileName}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${ocrResult.complianceScore.includes('FLAGGED') ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>
                          {ocrResult.complianceScore}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Invoice No:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>{ocrResult.invoiceNo}</span>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Material Type:</span>
                          <span className={`font-bold text-right max-w-[180px] truncate ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>{ocrResult.rawMaterial}</span>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Tonnage:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>{ocrResult.tonnage} Tons</span>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>HSN Code:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>{ocrResult.hsnCode}</span>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Vendor GSTIN:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-800 text-xs' : 'text-gray-100 text-xs'}`}>{ocrResult.vendorGstin}</span>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Consignee GSTIN:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-800 text-xs' : 'text-gray-100 text-xs'}`}>{ocrResult.consigneeGstin}</span>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Subtotal value:</span>
                          <span className="text-[#f97316] font-bold">₹{ocrResult.subtotalINR.toLocaleString('en-IN')}</span>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                          <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>GST Rate applied:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>{ocrResult.gstRateApplied}</span>
                        </div>
                        
                        {/* CGST / SGST splits or IGST details */}
                        {ocrResult.cgst > 0 ? (
                          <>
                            <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                              <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>CGST (Intra-state split):</span>
                              <span className="text-emerald-600 font-bold">₹{ocrResult.cgst.toLocaleString('en-IN')}</span>
                            </div>
                            <div className={`flex justify-between py-1 border-b ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                              <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>SGST (Intra-state split):</span>
                              <span className="text-emerald-600 font-bold">₹{ocrResult.sgst.toLocaleString('en-IN')}</span>
                            </div>
                          </>
                        ) : (
                          <div className={`flex justify-between py-1 border-b col-span-2 ${isLight ? 'border-slate-100' : 'border-gray-800/40'}`}>
                            <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>IGST (Inter-state unified tax):</span>
                            <span className="text-amber-600 font-bold">₹{ocrResult.igst.toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        <div className={`col-span-2 flex justify-between py-2 border-b font-bold text-sm px-2 rounded mt-1.5 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-zinc-950/40 border-[#1e293b] text-white'}`}>
                          <span>NET INVOICE TOTAL (GST INCLUSIVE):</span>
                          <span>₹{ocrResult.netTotalINR.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg border flex items-center justify-between text-xs font-sans mt-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1e1b16] border-[#f97316]/20'}`}>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Compliance Structure: <strong className="text-emerald-600 uppercase font-mono">{ocrResult.taxType}</strong> verified.</span>
                        </div>
                        <button 
                          onClick={() => { setOcrStatus('idle'); setOcrResult(null); setUploadedFileName(''); }}
                          className="text-[#f97316] hover:underline font-mono text-[10px] font-bold"
                        >
                          CLEAR SCAN & RETRY
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: AI Real-time Negotiation */}
          {activeTab === 'negotiation' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border relative transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b] text-gray-100'}`}>
                <h3 className={`text-base font-sans font-medium flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>
                  <TrendingUp className="w-4 h-4 text-[#f97316]" /> Autonomous Multi-Agent Bidding & Negotiation
                </h3>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Run a live simulated commercial trade negotiation. The Kinetix procurement sub-agent coordinates with supplier sales agents to optimize contract margins.
                </p>

                {/* Customizable Parameters (Visible when idle) */}
                {!negotiationActive && (
                  <div className={`p-4 rounded-lg border mb-4 space-y-4 text-xs transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/35 border-gray-800'}`}>
                    <div className="text-xs font-bold text-[#f97316] font-mono flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-3.5 h-3.5" /> Adjust Negotiation Parameters
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Supplier Selector */}
                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Target Supplier Desk</label>
                        <select
                          value={negSupplierName}
                          onChange={(e) => {
                            setNegSupplierName(e.target.value);
                            if (e.target.value.includes('Cement')) {
                              setNegMaterial('Ordinary Portland Cement');
                              setTargetSteelPrice(5200);
                              setCurrentOfferPrice(6100);
                            } else {
                              setNegMaterial('Hot-Rolled Steel Coils');
                              setTargetSteelPrice(44000);
                              setCurrentOfferPrice(48500);
                            }
                          }}
                          className={`w-full border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        >
                          <option value="Tata Steel Distributor">Tata Steel Distributor (Chakan)</option>
                          <option value="JSW Steel Sales Yard">JSW Steel Sales Yard (Nagpur)</option>
                          <option value="Jindal Steel & Power Ltd">Jindal Steel & Power Ltd (Jajpur)</option>
                          <option value="Ultratech Cement Depot">Ultratech Cement Depot (Pune)</option>
                        </select>
                      </div>

                      {/* Material Type description */}
                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Material specifications</label>
                        <input
                          type="text"
                          value={negMaterial}
                          onChange={(e) => setNegMaterial(e.target.value)}
                          className={`w-full border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        />
                      </div>

                      {/* Tonnage input */}
                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Order volume (Tons)</label>
                        <input
                          type="number"
                          value={negTonnage}
                          onChange={(e) => setNegTonnage(Number(e.target.value))}
                          className={`w-full border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        />
                      </div>

                      {/* Target Price */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Target Price (₹/Ton)</label>
                          <span className="text-emerald-600 font-mono font-bold">₹{targetSteelPrice.toLocaleString()}/T</span>
                        </div>
                        <input
                          type="range"
                          min={negSupplierName.includes('Cement') ? 3800 : 35000}
                          max={negSupplierName.includes('Cement') ? 7500 : 58000}
                          step={negSupplierName.includes('Cement') ? 100 : 500}
                          value={targetSteelPrice}
                          onChange={(e) => {
                            setTargetSteelPrice(Number(e.target.value));
                            setCurrentOfferPrice(Math.round(Number(e.target.value) * 1.11));
                          }}
                          className="w-full accent-[#f97316]"
                        />
                      </div>
                    </div>

                    {/* Immediate Clearance Option */}
                    <div className={`flex items-center gap-2 p-2.5 rounded border ${isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-zinc-950 border-gray-800 text-gray-300'}`}>
                      <input
                        type="checkbox"
                        id="immediate-payment"
                        checked={negImmediatePayment}
                        onChange={(e) => setNegImmediatePayment(e.target.checked)}
                        className="rounded accent-[#f97316] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="immediate-payment" className="text-xs cursor-pointer select-none">
                        💡 <strong className={isLight ? 'text-slate-800' : 'text-white'}>Enable Immediate T+4 Hour Treasury Settlement guarantee</strong> (increases concession rates by up to 4.5% spot margin)
                      </label>
                    </div>
                  </div>
                )}

                {/* Live Variables Panel */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg border mb-4 text-xs font-mono transition-all duration-200 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-black/40 border-[#1e293b]'}`}>
                  <div>
                    <div className={isLight ? 'text-slate-500' : 'text-gray-400'}>Supplier:</div>
                    <div className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{negSupplierName}</div>
                  </div>
                  <div>
                    <div className={isLight ? 'text-slate-500' : 'text-gray-400'}>Target Budget:</div>
                    <div className="text-emerald-600 font-bold">₹{targetSteelPrice.toLocaleString()}/T</div>
                  </div>
                  <div>
                    <div className={isLight ? 'text-slate-500' : 'text-gray-400'}>Supplier Initial Ask:</div>
                    <div className="text-rose-600 font-bold">₹{Math.round(targetSteelPrice * 1.11).toLocaleString()}/T</div>
                  </div>
                  <div>
                    <div className={isLight ? 'text-slate-500' : 'text-gray-400'}>Convergence Current:</div>
                    <div className="text-[#f97316] font-bold">₹{currentOfferPrice.toLocaleString()}/T</div>
                  </div>
                </div>

                {/* Simulation Transcript Screen */}
                <div className={`rounded-lg p-4 border h-64 overflow-y-auto font-mono text-xs space-y-3 scrollbar-thin transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/30 border-[#1e293b]'}`}>
                  {!negotiationActive ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
                      <Cpu className={`w-8 h-8 animate-pulse ${isLight ? 'text-slate-400' : 'text-gray-600'}`} />
                      <p>Negotiation engine ready to launch.</p>
                      <button
                        onClick={startNegotiationSimulation}
                        className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-md font-bold text-xs transition flex items-center gap-2 mt-2 shadow shadow-[#f97316]/10"
                      >
                        <Play className="w-3.5 h-3.5" /> INITIATE AUCTION LOOP
                      </button>
                    </div>
                  ) : (
                    <>
                      {negotiationLog.map((turn, idx) => (
                        <div key={idx} className={`p-2 rounded border transition-all duration-200 ${
                          turn.speaker === 'System' ? (isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/2 border-gray-800 text-gray-400') :
                          turn.speaker === 'Kinetix.ai' ? 'bg-[#f97316]/5 border-[#f97316]/20 text-[#f97316]' :
                          (isLight ? 'bg-amber-500/5 border-slate-200 text-slate-700' : 'bg-[#1e1b16] border-gray-800 text-zinc-300')
                        }`}>
                          <div className={`flex justify-between text-[10px] mb-1 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                            <span className="font-bold">{turn.speaker}</span>
                            <span>{turn.timestamp}</span>
                          </div>
                          <p className="text-xs leading-relaxed">{turn.message}</p>
                          {turn.pricePerTon > 0 && (
                            <div className={`mt-1 flex gap-4 text-[10px] border-t pt-1 ${isLight ? 'border-slate-200 text-slate-500' : 'border-gray-800/40 text-gray-400'}`}>
                              <span>Price Offer: <strong className={isLight ? 'text-slate-900' : 'text-white'}>₹{turn.pricePerTon.toLocaleString()}/T</strong></span>
                              <span>Delivery: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{turn.deliveryDays} Days</strong></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Control Action */}
                {negotiationActive && (
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={resetNegotiation}
                      className="text-xs text-rose-500 hover:underline font-mono"
                    >
                      Reset simulation
                    </button>

                    {negotiationRound < 3 ? (
                      <button
                        onClick={advanceNegotiationRound}
                        className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-md text-xs font-bold font-mono transition flex items-center gap-1 shadow shadow-[#f97316]/10"
                      >
                        ADVANCE AI DEBATE ROUND <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-mono font-bold flex items-center gap-1 animate-bounce">
                        <CheckCircle className="w-4 h-4" /> CONTRACT AUTOMATICALLY APPROVED
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Live Logistics Dispatch Overlay */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border relative transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b] text-gray-100'}`}>
                <h3 className={`text-base font-sans font-medium flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>
                  <Truck className="w-4 h-4 text-[#f97316]" /> Live Dispatch & Logistics Telemetry Map
                </h3>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Visualising heavy multi-load routes across Maharashtra-Gujarat-Odisha corridors. Kinetix uses dynamic feedback loops and ONDC transit logs to optimize empty-backhaul routes.
                </p>

                {/* Customizable Router Inputs */}
                <div className={`p-4 rounded-lg border mb-5 space-y-4 text-xs transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/35 border-gray-800'}`}>
                  <div className="text-xs font-bold text-[#f97316] font-mono flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> Configure Dispatch Routing Node
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Source Hub */}
                    <div className="space-y-1">
                      <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Source dispatch hub</label>
                      <select
                        value={logSourceHub}
                        onChange={(e) => { setLogSourceHub(e.target.value); setLogProgress(0); setLogTransitActive(false); }}
                        className={`w-full border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                      >
                        <option value="pune">Pune Chakan cluster (Maharashtra)</option>
                        <option value="nagpur">Nagpur Depot (Maharashtra)</option>
                        <option value="jajpur">Jajpur Iron-Yard (Odisha)</option>
                        <option value="mumbai">Mumbai Nhava Sheva Port (Maharashtra)</option>
                        <option value="raipur">Raipur Hub (Chhattisgarh)</option>
                        <option value="jamshedpur">Jamshedpur Mill (Jharkhand)</option>
                      </select>
                    </div>

                    {/* Destination Hub */}
                    <div className="space-y-1">
                      <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Destination Delivery Hub</label>
                      <select
                        value={logDestHub}
                        onChange={(e) => { setLogDestHub(e.target.value); setLogProgress(0); setLogTransitActive(false); }}
                        className={`w-full border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                      >
                        <option value="pune">Pune Factory (Maharashtra)</option>
                        <option value="nagpur">Nagpur Site (Maharashtra)</option>
                        <option value="jajpur">Jajpur Hub (Odisha)</option>
                        <option value="mumbai">Mumbai Cargo Yard (Maharashtra)</option>
                        <option value="wardha">Wardha Depot (Maharashtra)</option>
                      </select>
                    </div>

                    {/* Simulation Dispatch Trigger */}
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          if (logTransitActive) {
                            setLogTransitActive(false);
                            setLogProgress(0);
                          } else {
                            setLogTransitActive(true);
                            setLogProgress(5);
                            const timestamp = new Date().toTimeString().split(' ')[0];
                            const dispatchLog: AgentLog = {
                              id: `gps_disp_${Date.now()}`,
                              timestamp,
                              agent: 'Logistics Router',
                              status: 'success',
                              message: `Vehicle dispatched from ${INDIAN_HUBS[logSourceHub]?.name} -> ${INDIAN_HUBS[logDestHub]?.name}.`,
                              details: `FASTag toll of ₹${calculateFastagFee(logSourceHub, logDestHub)} cleared dynamically. Connected to ONDC ledger.`
                            };
                            setLogs(prev => [dispatchLog, ...prev]);
                          }
                        }}
                        disabled={logSourceHub === logDestHub}
                        className={`w-full py-2 rounded font-mono font-bold text-xs transition uppercase ${logTransitActive ? 'bg-rose-950 text-rose-400 border border-rose-900 hover:bg-rose-900/40' : 'bg-[#f97316] hover:bg-[#ea580c] text-white shadow shadow-[#f97316]/10 disabled:opacity-40'}`}
                      >
                        {logTransitActive ? 'ABORT VEHICLE TRANSIT' : 'DISPATCH SECURE CARGO'}
                      </button>
                    </div>
                  </div>

                  {logSourceHub === logDestHub && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-[10px] font-mono uppercase font-bold">
                      ⚠️ SOURCE AND DESTINATION HUBS MUST BE DIFFERENT TO COMPUTE ROUTE PATHS.
                    </div>
                  )}
                </div>

                {/* Simulated Interactive Map Elements */}
                <div className={`rounded-lg p-4 border relative overflow-hidden transition-all duration-200 ${isLight ? 'bg-slate-100/50 border-slate-300' : 'bg-black/30 border-[#1e293b]'}`} id="logistics-map-canvas">
                  {/* Grid background representing abstract map */}
                  <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 ${isLight ? 'invert' : ''}`}></div>

                  {/* Active Source Node */}
                  <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-sm ${isLight ? 'bg-white text-slate-800 border-slate-300' : 'bg-zinc-950 text-white border-gray-800'}`}>
                      {INDIAN_HUBS[logSourceHub]?.name || 'Source'}
                    </span>
                  </div>

                  {/* Active Destination Node */}
                  <div className="absolute top-2/3 right-1/4 flex flex-col items-center">
                    <MapPin className="w-5 h-5 text-[#f97316]" />
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-sm ${isLight ? 'bg-white text-slate-800 border-slate-300' : 'bg-zinc-950 text-white border-gray-800'}`}>
                      {INDIAN_HUBS[logDestHub]?.name || 'Destination'}
                    </span>
                  </div>

                  {/* Mid Point Standby node */}
                  {logSourceHub !== 'nagpur' && logDestHub !== 'nagpur' && (
                    <div className="absolute top-1/3 right-1/2 flex flex-col items-center opacity-60">
                      <MapPin className="w-4 h-4 text-zinc-500" />
                      <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${isLight ? 'bg-slate-200 text-slate-600' : 'bg-zinc-950 text-gray-400'}`}>Nagpur Depot</span>
                    </div>
                  )}

                  {/* Interactive Dynamic Line using calculated Distance */}
                  {logSourceHub !== logDestHub && (
                    <svg className="w-full h-44 absolute inset-0 pointer-events-none" style={{ minHeight: '176px' }}>
                      <path
                        d="M 160 60 C 260 90, 310 130, 420 140"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                        strokeDasharray={logTransitActive ? '8,4' : '4,4'}
                        className={logTransitActive ? 'animate-[dash_10s_linear_infinite]' : ''}
                        style={{
                          strokeDashoffset: logProgress * 2
                        }}
                      />
                    </svg>
                  )}

                  {/* Dynamic moving truck indicator */}
                  {logTransitActive && (
                    <div 
                      className={`absolute border p-2 rounded flex items-center gap-1.5 shadow-2xl transition-all duration-1000 ${isLight ? 'bg-white border-emerald-500/40 text-slate-800' : 'bg-zinc-950 border-emerald-500/50 text-white'}`}
                      style={{
                        left: `${25 + (logProgress * 0.45)}%`,
                        top: `${30 + (logProgress * 0.35)}%`
                      }}
                    >
                      <Truck className="w-4 h-4 text-emerald-500 animate-pulse" />
                      <div className="text-[9px] font-mono">
                        <div className="font-bold text-emerald-500">TRUCK MH-12-IN-3312</div>
                        <div className={isLight ? 'text-slate-500' : 'text-gray-300'}>Transit: {logProgress}% completed</div>
                      </div>
                    </div>
                  )}

                  {/* Map Info Box */}
                  <div className="h-44 flex items-end justify-between relative z-10">
                    <div className={`text-[9px] font-mono p-2.5 rounded border backdrop-blur max-w-[260px] ${isLight ? 'bg-white/90 border-slate-300 text-slate-700 shadow-sm' : 'bg-black/85 border-gray-800 text-gray-300'}`}>
                      <div className={`font-bold mb-1.5 flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${logTransitActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`}></span> 
                        {logTransitActive ? 'LIVE ROUTE TELEMETRY ACTIVE' : 'ROUTE CALCULATOR PREVIEW'}
                      </div>
                      <div className="space-y-1">
                        <div>Route Corridor: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>{logSourceHub.toUpperCase()} ⇄ {logDestHub.toUpperCase()}</strong></div>
                        <div>Distance: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>{getHubDistance(logSourceHub, logDestHub)} KM</strong></div>
                        <div>FASTag Toll Fees: <strong className="text-[#f97316] font-bold">₹{calculateFastagFee(logSourceHub, logDestHub).toLocaleString('en-IN')}</strong></div>
                        <div>Est. Driving Time: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>{Math.ceil(getHubDistance(logSourceHub, logDestHub) / logSpeed)} Hours</strong></div>
                        {logTransitActive && <div>Current speed: <strong className="text-emerald-600 font-bold">{logSpeed} km/h (Stable)</strong></div>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {logTransitActive && (
                        <button 
                          onClick={() => {
                            setLogProgress(prev => Math.min(100, prev + 15));
                            const timestamp = new Date().toTimeString().split(' ')[0];
                            const tickLog: AgentLog = {
                              id: `gps_tick_${Date.now()}`,
                              timestamp,
                              agent: 'Logistics Router',
                              status: 'info',
                              message: `MH-12-IN-3312 passed GPS waypoint at ${Math.round(getHubDistance(logSourceHub, logDestHub) * logProgress / 100)} KM check.`,
                              details: `Driver telemetry healthy. FASTag transaction authenticated.`
                            };
                            setLogs(prev => [tickLog, ...prev]);
                          }}
                          className={`p-1.5 border rounded font-mono text-[9px] font-bold shadow uppercase ${isLight ? 'bg-[#f97316]/5 border-[#f97316]/40 text-[#ea580c] hover:bg-[#f97316]/10' : 'bg-[#f97316]/10 border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/20'}`}
                        >
                          🚗 SIMULATE TRAVEL PROGRESS
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          const timestamp = new Date().toTimeString().split(' ')[0];
                          const log: AgentLog = {
                            id: `gps_log_${Date.now()}`,
                            timestamp,
                            agent: 'Logistics Router',
                            status: 'info',
                            message: `ONDC GPS server polling executed for corridor route ${logSourceHub.toUpperCase()} to ${logDestHub.toUpperCase()}.`,
                            details: `Queried 1 active transponder. Signal Strength: 98dbm. Latitude/Longitude matched.`
                          };
                          setLogs(prev => [log, ...prev]);
                        }}
                        className={`p-1.5 border rounded font-mono text-[9px] shadow ${isLight ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'bg-black border-[#1e293b] text-gray-400 hover:text-white'}`}
                      >
                        FORCE COORDINATE POLL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: GST Compliance Audit */}
          {activeTab === 'gst' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border relative transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b]'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className={`text-base font-sans font-medium flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>
                      <Landmark className="w-4 h-4 text-[#f97316]" /> GST Reconciliation & GSTR-2B Mismatch Audit
                    </h3>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      Pausing leaking vendor payments dynamically when invoices fail to match government GSTR structures. Real-time tax shielding protects operational cash buffers.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setGstNewVendor('');
                      setGstNewInvoiceNo(`GST/2026/INV-${Math.floor(Math.random() * 9000) + 1000}`);
                      setGstNewGstin('27AAAC' + Math.floor(Math.random() * 900000) + 'P1Z' + Math.floor(Math.random() * 9));
                      setGstNewHsn('7208');
                      setGstNewAmount('450000');
                      setGstNewStatus('Matched');
                      setShowAddGstModal(!showAddGstModal);
                    }}
                    className="px-3.5 py-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded text-xs font-bold font-mono transition shadow-lg shadow-[#f97316]/10 flex items-center gap-1 self-start"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD NEW CHALLAN
                  </button>
                </div>

                {/* Inline Invoice Generator form */}
                {showAddGstModal && (
                  <div className={`p-4 rounded-lg border mb-5 space-y-4 text-xs transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-[#f97316]/30'}`}>
                    <div className="text-xs font-bold text-[#f97316] font-mono flex items-center justify-between">
                      <span className="flex items-center gap-1.5 uppercase"><Sparkles className="w-3.5 h-3.5" /> Simulate GSTR-2B Vendor Challan Entry</span>
                      <button 
                        onClick={() => setShowAddGstModal(false)}
                        className={`font-mono text-[10px] ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-gray-400 hover:text-white'}`}
                      >
                        CLOSE FORM [X]
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Vendor Business Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Jindal Steel Yard"
                          value={gstNewVendor}
                          onChange={(e) => setGstNewVendor(e.target.value)}
                          className={`w-full border rounded px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Invoice Challan No</label>
                        <input
                          type="text"
                          value={gstNewInvoiceNo}
                          onChange={(e) => setGstNewInvoiceNo(e.target.value)}
                          className={`w-full border rounded px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Vendor GSTIN ID</label>
                        <input
                          type="text"
                          maxLength={15}
                          value={gstNewGstin}
                          onChange={(e) => setGstNewGstin(e.target.value)}
                          className={`w-full border rounded px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>HSN Commodity Code</label>
                        <input
                          type="text"
                          value={gstNewHsn}
                          onChange={(e) => setGstNewHsn(e.target.value)}
                          className={`w-full border rounded px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Gross Value (₹ Subtotal)</label>
                        <input
                          type="number"
                          value={gstNewAmount}
                          onChange={(e) => setGstNewAmount(e.target.value)}
                          className={`w-full border rounded px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>GSTR-2B Compliance Match</label>
                        <select
                          value={gstNewStatus}
                          onChange={(e) => setGstNewStatus(e.target.value as any)}
                          className={`w-full border rounded px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#f97316] ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-950 border-gray-800 text-white'}`}
                        >
                          <option value="Matched">100% GSTR-2B Matched</option>
                          <option value="Mismatch Flagged">HSN Mismatch (Flag Mismatch)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!gstNewVendor.trim()) return;
                        const amt = Number(gstNewAmount) || 100000;
                        const calculatedTax = Math.round(amt * (Number(gstNewTaxRate) / 100));
                        
                        const newInvoice = {
                          id: `dyn_inv_${Date.now()}`,
                          vendor: gstNewVendor,
                          invoiceNo: gstNewInvoiceNo,
                          hsnCode: gstNewHsn || '7208',
                          gstin: gstNewGstin || '27AAACT1290P1ZX',
                          taxValue: calculatedTax,
                          status: gstNewStatus,
                          autoAction: gstNewStatus === 'Matched' ? 'Payment Released' : 'Treasury Lock Enabled',
                          allowOverride: gstNewStatus === 'Mismatch Flagged'
                        };

                        setGstInvoiceList(prev => [newInvoice, ...prev]);
                        setShowAddGstModal(false);

                        // Push entry log
                        const ts = new Date().toTimeString().split(' ')[0];
                        const log: AgentLog = {
                          id: `gst_log_${Date.now()}`,
                          timestamp: ts,
                          agent: 'GST Compliance',
                          status: gstNewStatus === 'Matched' ? 'success' : 'warning',
                          message: `New challan for ${gstNewVendor} added to ledger.`,
                          details: `Analyzed invoice #${gstNewInvoiceNo} (HSN: ${newInvoice.hsnCode}) value ₹${amt.toLocaleString('en-IN')}. GSTR-2B matched state: ${gstNewStatus}.`
                        };
                        setLogs(prev => [log, ...prev]);
                      }}
                      disabled={!gstNewVendor}
                      className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-40 text-white rounded font-mono font-bold text-xs transition uppercase"
                    >
                      POST TO RECONCILIATION LEDGER
                    </button>
                  </div>
                )}

                {/* Compliance Table */}
                <div className={`overflow-x-auto rounded-lg border transition-all duration-200 ${isLight ? 'border-slate-200 bg-white shadow-inner' : 'border-[#1e293b] bg-black/30'}`}>
                  <table className="w-full text-xs text-left font-mono">
                    <thead className={`uppercase text-[10px] border-b ${isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-[#0c0c0e]/80 text-gray-400 border-[#1e293b]'}`}>
                      <tr>
                        <th className="p-3">Vendor / Invoice</th>
                        <th className="p-3">GSTR-2B Record</th>
                        <th className="p-3">Tax Value</th>
                        <th className="p-3">Auto Action</th>
                        <th className="p-3 text-right">Resolve Override</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-gray-800/60 text-gray-300'}`}>
                      {gstInvoiceList.map((inv) => (
                        <tr key={inv.id} className={`${inv.status.includes('Mismatch') ? (isLight ? 'bg-rose-50/60' : 'bg-rose-950/20') : ''} ${isLight ? 'hover:bg-slate-50/40' : 'hover:bg-white/5'} transition-colors`}>
                          <td className="p-3">
                            <div className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{inv.vendor}</div>
                            <div className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                              #{inv.invoiceNo} • HSN {inv.hsnCode} • GSTIN {inv.gstin}
                            </div>
                          </td>
                          <td className={`p-3 font-semibold ${inv.status.includes('Matched') || inv.status.includes('Released') ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : (isLight ? 'text-rose-700' : 'text-rose-400')}`}>
                            {inv.status.includes('Matched') || inv.status.includes('Released') ? '✔ Matched 100%' : '✘ HSN MISMATCH FLAGGED'}
                          </td>
                          <td className={`p-3 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            ₹{inv.taxValue.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${inv.autoAction.includes('Released') || inv.autoAction.includes('Overridden') ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                              {inv.autoAction}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {inv.allowOverride ? (
                              <button 
                                onClick={() => {
                                  setGstInvoiceList(prev => prev.map(item => {
                                    if (item.id === inv.id) {
                                      return {
                                        ...item,
                                        status: 'Overridden & Released',
                                        autoAction: 'Manual Override Released',
                                        allowOverride: false
                                      };
                                    }
                                    return item;
                                  }));
                                  
                                  const ts = new Date().toTimeString().split(' ')[0];
                                  const newLog: AgentLog = {
                                    id: `res_${Date.now()}`,
                                    timestamp: ts,
                                    agent: 'GST Compliance',
                                    status: 'success',
                                    message: `Manual override executed. Authorized treasury disbursement to ${inv.vendor} for #${inv.invoiceNo}.`
                                  };
                                  setLogs(prev => [newLog, ...prev]);
                                }}
                                className="px-2 py-1 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 rounded border border-rose-500/30 text-[10px] font-bold transition"
                              >
                                FORCE RELEASE
                              </button>
                            ) : (
                              <span className="text-gray-500 font-mono text-[10px]">None needed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Warehouse Safety Stock Out Forecaster */}
          {activeTab === 'warehouse' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border relative transition-all duration-200 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-white/2 border-[#1e293b]'}`}>
                <h3 className={`text-base font-sans font-medium flex items-center gap-2 mb-2 ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>
                  <Clock className="w-4 h-4 text-[#f97316]" /> Predictive Inventory Stockout Forecaster
                </h3>
                <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Using historical burn rates and supplier lead-times, the warehouse agent predicts exactly when critical resources will run out and prompts automated re-orders.
                </p>

                {/* Burn Rate Slider Sandbox */}
                <div className={`p-4 rounded-lg border mb-5 space-y-3 text-xs transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/35 border-gray-800'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#f97316] font-mono uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Inventory Consumption Sandbox
                    </span>
                    <span className={`font-mono text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>CURRENT BURN: <strong className={isLight ? 'text-slate-800 font-bold' : 'text-white font-bold'}>{burnRateMultiplier.toFixed(1)}x Normal</strong></span>
                  </div>
                  <p className={`text-[11px] font-sans ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Drag the slider to simulate high-demand steel fabrications, monsoon cement transport delays, or peak industrial manufacturing runs.
                  </p>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={burnRateMultiplier}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBurnRateMultiplier(val);
                      if (val > 2.0) {
                        const ts = new Date().toTimeString().split(' ')[0];
                        const log: AgentLog = {
                          id: `wh_log_${Date.now()}`,
                          timestamp: ts,
                          agent: 'Warehouse Agent',
                          status: 'warning',
                          message: `Heavy consumption surge warning (${val.toFixed(1)}x normal). Safety stock levels breaching minimum thresholds.`,
                          details: 'Re-evaluating lead times for Maharashtra-Odisha routes.'
                        };
                        setLogs(prev => [log, ...prev.slice(0, 15)]);
                      }
                    }}
                    className="w-full accent-[#f97316]"
                  />
                  <div className={`flex justify-between text-[10px] font-mono uppercase ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                    <span>0.5x (Monsoon Lull)</span>
                    <span>1.0x (Standard Baseline)</span>
                    <span>3.0x (Infrastructure Blitz)</span>
                  </div>
                </div>

                {/* Inventory Chart Simulation */}
                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>Grade-C Steel Sheets (Pune Facility)</span>
                      {burnRateMultiplier > 1.8 ? (
                        <span className="text-amber-500 font-semibold">85% full (Stockout: Alert in {Math.max(1, Math.round(18 / burnRateMultiplier))} days)</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">85% full (Stockout: Safe &gt;{Math.max(1, Math.round(18 / burnRateMultiplier))} days)</span>
                      )}
                    </div>
                    <div className={`w-full rounded-full h-3 overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-zinc-950'}`}>
                      <div className="bg-emerald-500 h-3 rounded-full animate-pulse" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>Portland Cement (Nagpur facility)</span>
                      {Math.max(1, Math.round(3 / burnRateMultiplier)) <= 1 ? (
                        <span className="text-rose-500 font-bold">24% full (CRITICAL Stockout: {Math.max(1, Math.round(3 / burnRateMultiplier))} day remaining)</span>
                      ) : (
                        <span className="text-amber-500 font-bold">24% full (Stockout Alert: {Math.max(1, Math.round(3 / burnRateMultiplier))} days remaining)</span>
                      )}
                    </div>
                    <div className={`w-full rounded-full h-3 overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-zinc-950'}`}>
                      <div className="bg-amber-500 h-3 rounded-full animate-pulse" style={{ width: '24%' }}></div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>Structural Alloys (Jajpur Yard)</span>
                      <span className="text-rose-500 font-bold">8% full (Critical Stockout Alert: {Math.max(0, Math.round(1 / burnRateMultiplier))} days remaining)</span>
                    </div>
                    <div className={`w-full rounded-full h-3 overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-zinc-950'}`}>
                      <div className="bg-rose-500 h-3 rounded-full animate-pulse" style={{ width: '8%' }}></div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border text-xs flex justify-between items-center transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/2 border-[#1e293b]'}`}>
                    <div>
                      <div className={`font-bold mb-0.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>Prompt Auto-Replenishment</div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Procure {Math.round(120 * burnRateMultiplier)} Tons of Structural Alloys via closest Odisha steel mill.</div>
                    </div>
                    <button
                      onClick={() => {
                        const timestamp = new Date().toTimeString().split(' ')[0];
                        setPromptCommand(`Procure ${Math.round(120 * burnRateMultiplier)} Tons structural alloys for Jajpur yard`);
                        setActiveTab('hq');
                      }}
                      className="px-3 py-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded font-bold font-mono transition shadow-lg shadow-[#f97316]/10"
                    >
                      DRAFT TENDER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Active Thinking Logs Feed */}
        <div className={`w-full lg:w-96 flex flex-col h-full overflow-hidden border-l transition-all duration-200 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0c0c0e]/95 border-[#1e293b]'}`}>
          <div className={`p-4 border-b flex items-center justify-between transition-all duration-200 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-[#1e293b]'}`}>
            <span className={`text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
              <Cpu className="w-4 h-4 text-[#f97316]" /> {t.tabHq.toUpperCase()} FEED
            </span>
            <span className="text-[10px] bg-[#f97316]/10 text-[#f97316] px-1.5 py-0.5 rounded font-mono">
              REAL-TIME
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {logs.map((log) => {
              const logBgClass = isLight
                ? (log.status === 'success' ? 'bg-emerald-50/75 border-emerald-200 text-emerald-800' :
                   log.status === 'warning' ? 'bg-amber-50/75 border-amber-200 text-amber-800' :
                   log.status === 'error' ? 'bg-rose-50/75 border-rose-200 text-rose-800' :
                   log.status === 'pending_approval' ? 'bg-amber-100/80 border-amber-300 text-amber-900' :
                   'bg-white border-slate-200 text-slate-700')
                : (log.status === 'success' ? 'bg-[#10B981]/5 border-[#10B981]/20 text-emerald-300' :
                   log.status === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-300' :
                   log.status === 'error' ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' :
                   log.status === 'pending_approval' ? 'bg-rose-950/40 border-rose-500/30 text-rose-200' :
                   'bg-white/2 border-gray-800 text-gray-300');

              return (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-lg border transition-colors duration-200 ${logBgClass}`}
                >
                  <div className={`flex justify-between text-[9px] mb-1.5 border-b pb-1 ${isLight ? 'text-slate-500 border-slate-200/60' : 'text-gray-500 border-gray-800/40'}`}>
                    <span className="font-bold flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'success' ? 'bg-[#10B981]' :
                        log.status === 'warning' ? 'bg-[#FBBF24]' :
                        log.status === 'error' ? 'bg-rose-500' :
                        log.status === 'pending_approval' ? 'bg-rose-400 animate-ping' :
                        'bg-[#f97316]'
                      }`}></span>
                      {log.agent.toUpperCase()}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className={`text-xs font-sans leading-relaxed ${isLight ? 'text-slate-800 font-medium' : 'text-gray-200'}`}>{log.message}</p>
                  {log.details && (
                    <p className={`text-[10px] mt-1 pl-2 border-l font-mono leading-relaxed ${isLight ? 'text-slate-500 border-slate-300' : 'text-gray-400 border-gray-700'}`}>
                      {log.details}
                    </p>
                  )}
                  
                  {log.actionRequired && log.status === 'pending_approval' && (
                    <div className="mt-2.5 flex justify-end gap-1.5">
                      <button 
                        onClick={() => resolveException(log.id)}
                        className="px-2 py-1 bg-[#f97316] text-white hover:bg-[#ea580c] rounded text-[10px] font-bold transition flex items-center gap-1 font-sans shadow shadow-[#f97316]/20"
                      >
                        <UserCheck className="w-3 h-3" /> APPROVE DISPATCH
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
