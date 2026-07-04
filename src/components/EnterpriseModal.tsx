import React, { useState } from 'react';
import { X, Check, Copy, Code, Sparkles, ShieldCheck, Mail, Phone, User, Building, Landmark } from 'lucide-react';

interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnterpriseModal({ isOpen, onClose }: EnterpriseModalProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedTab, setCopiedTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [isCopied, setIsCopied] = useState(false);

  // Form Fields
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [stateCode, setStateCode] = useState('Maharashtra');
  const [sector, setSector] = useState('Steel Manufacturing');
  const [volume, setVolume] = useState('500+ Tons');
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !contactName || !email) return;

    // Generate simulated Indian enterprise token
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const mockKey = `KTX-IN-72AAB-${randomHex}`;
    setApiKey(mockKey);
    setFormSubmitted(true);
  };

  const codeSnippets = {
    curl: `curl -X POST "https://api.kinetix.ai/v1/compliance/gstr2b/verify" \\
  -H "Authorization: Bearer ${apiKey || 'KTX-IN-72AAB-MOCKKEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "vendorGstin": "27AAACT1290P1ZX",
    "invoiceNo": "TS-2026-CHAK",
    "totalValueINR": 2256750,
    "gstAmountINR": 344250
  }'`,
    node: `const axios = require('axios');

async function verifyGSTR2B() {
  try {
    const response = await axios.post(
      'https://api.kinetix.ai/v1/compliance/gstr2b/verify',
      {
        vendorGstin: '27AAACT1290P1ZX',
        invoiceNo: 'TS-2026-CHAK',
        totalValueINR: 2256750,
        gstAmountINR: 344250
      },
      {
        headers: {
          'Authorization': 'Bearer ${apiKey || 'KTX-IN-72AAB-MOCKKEY'}',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Compliance Status:', response.data.status); // MATCHED
  } catch (error) {
    console.error('Error verifying invoice:', error.message);
  }
}

verifyGSTR2B();`,
    python: `import requests

url = "https://api.kinetix.ai/v1/compliance/gstr2b/verify"
headers = {
    "Authorization": "Bearer ${apiKey || 'KTX-IN-72AAB-MOCKKEY'}",
    "Content-Type": "application/json"
}
payload = {
    "vendorGstin": "27AAACT1290P1ZX",
    "invoiceNo": "TS-2026-CHAK",
    "totalValueINR": 2256750,
    "gstAmountINR": 344250
}

response = requests.post(url, json=payload, headers=headers)
print("Compliance Status:", response.json().get("status")) # MATCHED`
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[copiedTab]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0c0c0e] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f97316]" />
            <div>
              <h3 className="text-base font-bold text-white font-sans tracking-tight">Kinetix.ai Enterprise Integration Sandbox</h3>
              <p className="text-[10px] text-gray-400 font-mono">CONNECT SAP, TALLY, AND MARG ERP DIRECTLY TO AUTONOMOUS AGENTS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!formSubmitted ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-4 bg-[#f97316]/5 border border-[#f97316]/10 rounded-xl text-xs text-[#f97316] leading-relaxed">
                📢 <strong className="font-semibold">Register for Enterprise API Sandbox:</strong> Fill out the form below to generate a secure local integration token. Connect with real Indian GST registries, FASTag pools, and commercial freight APIs in simulation mode.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#f97316]" /> Enterprise Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Mahindra Logistics Ltd"
                    className="w-full bg-black border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center gap-1">
                    <User className="w-3 h-3 text-[#f97316]" /> Authorized Promoter / Signatory *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Anand Mahindra"
                    className="w-full bg-black border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#f97316]" /> Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. procurement@mahindra.com"
                    className="w-full bg-black border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#f97316]" /> WhatsApp Contact Number (for direct logs)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98230 45671"
                    className="w-full bg-black border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-[#f97316]" /> Core State of Operation
                  </label>
                  <select
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="w-full bg-black border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  >
                    <option value="Maharashtra">Maharashtra (MH - 27)</option>
                    <option value="Gujarat">Gujarat (GJ - 24)</option>
                    <option value="Odisha">Odisha (OR - 21)</option>
                    <option value="Chhattisgarh">Chhattisgarh (CG - 22)</option>
                    <option value="Jharkhand">Jharkhand (JH - 20)</option>
                    <option value="Rajasthan">Rajasthan (RJ - 08)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#f97316]" /> Primary Manufacturing Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-black border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                  >
                    <option value="Steel Manufacturing">Steel & Alloys Manufacturing</option>
                    <option value="Cement & Concrete">Cement & Ready-Mix Concrete</option>
                    <option value="Automotive & Parts">Automotive Production & Fabrication</option>
                    <option value="Infrastructure EPC">Infrastructure & Heavy Construction (EPC)</option>
                    <option value="Mining & Logistics">Heavy Raw Materials Trading & Logistics</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">
                  Estimated Monthly Procurement Volume (Tonnage)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Under 100 Tons', '100 - 500 Tons', '500+ Tons'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setVolume(opt)}
                      className={`py-2 rounded-lg border text-xs font-semibold transition ${volume === opt ? 'border-[#f97316] bg-[#f97316]/10 text-[#f97316]' : 'border-gray-800 bg-zinc-950/40 text-gray-400 hover:border-gray-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white font-bold rounded-lg text-sm transition shadow-lg shadow-[#f97316]/15 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> GENERATE SECURE API INTEGRATION TOKEN
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-emerald-400">Credentials Active & Secure</h4>
                <p className="text-xs text-gray-300">
                  Congratulations <strong className="font-semibold text-white">{contactName}</strong>, Kinetix Enterprise Portal has provisioned a secure sandbox channel for <strong className="font-semibold text-white">{company}</strong>.
                </p>
              </div>

              {/* Secure Token display */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">YOUR KINETIX API SECRET TOKEN:</span>
                <div className="bg-black/85 p-3 rounded-lg border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-400 font-bold shadow-inner">
                  <span>{apiKey}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="p-1 rounded bg-zinc-900 text-gray-400 hover:text-white border border-gray-800 flex items-center gap-1 text-[10px] font-sans"
                  >
                    {isCopied ? <span className="text-emerald-400">Copied!</span> : <><Copy className="w-3.5 h-3.5" /> Copy Token</>}
                  </button>
                </div>
              </div>

              {/* API Documentation Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-[#f97316]" /> ERP WEBHOOK & REST INTEGRATION SNIPPET
                  </span>
                  
                  {/* API Code Tabs */}
                  <div className="flex bg-white/2 rounded-lg p-0.5 border border-gray-800 text-[10px] font-mono">
                    <button
                      onClick={() => setCopiedTab('curl')}
                      className={`px-2 py-1 rounded transition ${copiedTab === 'curl' ? 'bg-[#f97316]/10 text-[#f97316] font-bold border border-[#f97316]/20' : 'text-gray-400 hover:text-white'}`}
                    >
                      cURL
                    </button>
                    <button
                      onClick={() => setCopiedTab('node')}
                      className={`px-2 py-1 rounded transition ${copiedTab === 'node' ? 'bg-[#f97316]/10 text-[#f97316] font-bold border border-[#f97316]/20' : 'text-gray-400 hover:text-white'}`}
                    >
                      NodeJS
                    </button>
                    <button
                      onClick={() => setCopiedTab('python')}
                      className={`px-2 py-1 rounded transition ${copiedTab === 'python' ? 'bg-[#f97316]/10 text-[#f97316] font-bold border border-[#f97316]/20' : 'text-gray-400 hover:text-white'}`}
                    >
                      Python
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <pre className="bg-black text-[11px] p-4 rounded-lg overflow-x-auto text-gray-300 font-mono leading-relaxed border border-gray-800 shadow-inner">
                    <code>{codeSnippets[copiedTab]}</code>
                  </pre>
                  <button
                    onClick={copyCodeToClipboard}
                    className="absolute right-3 top-3 p-1.5 rounded bg-zinc-900 border border-gray-800 text-gray-400 hover:text-white transition"
                    title="Copy snippet"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-gray-800 rounded-lg text-gray-300 transition"
                >
                  MODIFY DETAILS
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 text-center text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg text-white transition shadow-md shadow-emerald-900/10"
                >
                  START INJECTING IN ERP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
