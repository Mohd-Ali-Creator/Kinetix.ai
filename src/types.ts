export interface StartupPhase {
  id: string;
  title: string;
  category: 'Strategic' | 'Business' | 'Technical' | 'Product' | 'Go-To-Market' | 'Operational' | 'Governance';
  iconName: string;
  shortDesc: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: 'Core orchestrator' | 'OCR Intelligence' | 'Negotiation Engine' | 'Logistics Router' | 'GST Compliance' | 'Finance Ledger' | 'Warehouse Agent';
  status: 'info' | 'success' | 'warning' | 'error' | 'pending_approval';
  message: string;
  details?: string;
  actionRequired?: boolean;
}

export interface SimulationState {
  isActive: boolean;
  activeOrderCount: number;
  unresolvedExceptions: number;
  savingsGeneratedINR: number;
  autoMatchedRate: number;
}

export interface NegotiationTurn {
  speaker: 'Kinetix.ai' | 'Tata Steel Distributor' | 'System';
  message: string;
  pricePerTon: number;
  deliveryDays: number;
  timestamp: string;
}
