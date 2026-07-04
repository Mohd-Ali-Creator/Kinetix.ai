// India Tax and Freight Utilities for Kinetix.ai Industrial OS

export interface IndianHub {
  id: string;
  name: string;
  state: string;
  gstPrefix: string;
  x: number; // percentage coordinate for map SVG
  y: number;
}

export const INDIAN_HUBS: Record<string, IndianHub> = {
  'pune': { id: 'pune', name: 'Pune Chakan Hub', state: 'Maharashtra', gstPrefix: '27', x: 20, y: 70 },
  'nagpur': { id: 'nagpur', name: 'Nagpur Depot', state: 'Maharashtra', gstPrefix: '27', x: 68, y: 35 },
  'jajpur': { id: 'jajpur', name: 'Jajpur Yard', state: 'Odisha', gstPrefix: '21', x: 88, y: 48 },
  'mumbai': { id: 'mumbai', name: 'Mumbai JNPT Port', state: 'Maharashtra', gstPrefix: '27', x: 10, y: 60 },
  'wardha': { id: 'wardha', name: 'Wardha Loading Dock', state: 'Maharashtra', gstPrefix: '27', x: 55, y: 42 },
  'raipur': { id: 'raipur', name: 'Raipur Steel-Yard', state: 'Chhattisgarh', gstPrefix: '22', x: 72, y: 55 },
  'jamshedpur': { id: 'jamshedpur', name: 'Jamshedpur Mill Node', state: 'Jharkhand', gstPrefix: '20', x: 82, y: 38 }
};

// Precise distance mapping for core heavy corridors (in km)
export const getHubDistance = (src: string, dest: string): number => {
  if (src === dest) return 0;
  const pair = [src, dest].sort().join('-');
  const distanceMap: Record<string, number> = {
    'nagpur-pune': 710,
    'mumbai-pune': 150,
    'jajpur-nagpur': 820,
    'nagpur-raipur': 285,
    'mumbai-wardha': 680,
    'jajpur-jamshedpur': 290,
    'pune-wardha': 610,
    'nagpur-wardha': 80,
    'mumbai-nagpur': 815,
    'raipur-wardha': 330,
    'jajpur-raipur': 540,
    'jamshedpur-raipur': 620,
    'jamshedpur-pune': 1380,
    'mumbai-raipur': 960,
    'jajpur-mumbai': 1480,
    'jajpur-pune': 1310,
    'jamshedpur-nagpur': 880,
    'jamshedpur-wardha': 840,
    'jamshedpur-mumbai': 1610
  };

  if (distanceMap[pair] !== undefined) {
    return distanceMap[pair];
  }

  // Back-up vector-based calculation
  const srcHub = INDIAN_HUBS[src];
  const destHub = INDIAN_HUBS[dest];
  if (!srcHub || !destHub) return 450;
  return Math.round(Math.sqrt(Math.pow(destHub.x - srcHub.x, 2) + Math.pow(destHub.y - srcHub.y, 2)) * 14) + 80;
};

// FASTag Fee calculation based on weight & distance (INR)
export const calculateFastagFee = (distanceKm: number, tonnage: number): number => {
  if (distanceKm === 0) return 0;
  const baseRate = tonnage > 40 ? 4.5 : 2.5; // Commercial heavy multi-axle rates
  return Math.round(distanceKm * baseRate);
};

// Calculate Indian GST breakdown (CGST/SGST for intra-state, IGST for inter-state)
export interface GstBreakdown {
  subtotal: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  netTotal: number;
  taxType: 'INTRA-STATE (CGST + SGST)' | 'INTER-STATE (IGST)';
}

export const calculateGstBreakdown = (
  tonnage: number,
  ratePerTon: number,
  vendorGstPrefix: string,
  consigneeGstPrefix: string,
  materialType: 'steel' | 'cement'
): GstBreakdown => {
  const subtotal = tonnage * ratePerTon;
  const gstRate = materialType === 'cement' ? 28 : 18; // 28% for cement, 18% for structural steel HSN
  const totalTax = subtotal * (gstRate / 100);

  const isIntraState = vendorGstPrefix === consigneeGstPrefix;

  return {
    subtotal,
    gstRate,
    cgst: isIntraState ? Math.round(totalTax / 2) : 0,
    sgst: isIntraState ? Math.round(totalTax / 2) : 0,
    igst: isIntraState ? 0 : Math.round(totalTax),
    netTotal: Math.round(subtotal + totalTax),
    taxType: isIntraState ? 'INTRA-STATE (CGST + SGST)' : 'INTER-STATE (IGST)'
  };
};

// Simulated smart file scanner to read real or mock files uploaded by user
export const scanUploadedFile = (fileName: string, fileSize: number): any => {
  const lowerName = fileName.toLowerCase();
  
  let rawMaterial = 'Hot-Rolled Steel Coils';
  let tonnage = 45;
  let ratePerTon = 45500;
  let materialType: 'steel' | 'cement' = 'steel';
  let hsnCode = '7208 (Flat Rolled Iron)';
  let invoiceNo = `IN-${Math.floor(Math.random() * 89999 + 10000)}`;

  if (lowerName.includes('cement') || lowerName.includes('ultra') || lowerName.includes('jk')) {
    rawMaterial = 'Grade-43 Ordinary Portland Cement';
    tonnage = 55;
    ratePerTon = 6200;
    materialType = 'cement';
    hsnCode = '2523 (Portland Cement)';
    invoiceNo = `UT-CEMENT-${Math.floor(Math.random() * 899 + 100)}`;
  } else if (lowerName.includes('alloy') || lowerName.includes('iron') || lowerName.includes('jajpur')) {
    rawMaterial = 'Structural Iron Alloys';
    tonnage = 32;
    ratePerTon = 58000;
    materialType = 'steel';
    hsnCode = '7216 (Iron Sections)';
    invoiceNo = `JAJ-FE-${Math.floor(Math.random() * 8999 + 1000)}`;
  } else if (fileSize > 100000) { // Large file
    tonnage = Math.round(fileSize / 15000);
  }

  return {
    invoiceNo,
    rawMaterial,
    tonnage,
    ratePerTon,
    materialType,
    hsnCode,
    detectedFileName: fileName
  };
};
