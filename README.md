# Kinetix.ai (India Decacorn Core) 🚀
> **Autonomous AI Operating System for India’s Industrial Supply Chain using Agentic AI**

Kinetix.ai represents a groundbreaking paradigm shift in heavy industrial operations. Designed specifically for the Indian manufacturing, logistics, and infrastructure sectors, Kinetix.ai bridges the gap between traditional enterprise resource planning (ERP) systems and autonomous agentic workflows. By deploying specialized sub-agents that collaborate, negotiate, route, and reconcile in real-time, the platform protects operating margins, eliminates tax slippages, and streamlines heavy freight corridors.

---

## 👥 Who Is This Application Useful For?

Kinetix.ai is tailored for decision-makers, operators, and technologists across India's heavy industry, including:

1. **Procurement & Purchase Heads**: Sourcing managers of steel, cement, aggregates, and raw materials who want to automate commercial inquiries, optimize margins, and negotiate best-price contracts via real-time autonomous negotiation agents.
2. **Supply Chain & Logistics Operators**: Fleet managers and route coordinators overseeing heavy multi-load transit corridors (e.g., Maharashtra-Gujarat-Odisha). It is ideal for those utilizing FASTag telemetry and ONDC logs to minimize empty backhauls and calculate precise freight distances.
3. **CFOs, Tax Auditors & Treasury Leads**: Finance teams who must shield corporate treasury from GSTR-2B tax compliance leakage, automate GSTR-2B reconciliation, and instantly flag or manually release HSN/GSTIN mismatches.
4. **Warehouse & Plant Managers**: Inventory controllers who need safety stock alerts, real-time consumption burn-rate forecasting (from monsoon lulls to peak infrastructure blitzes), and automated replenishment triggers.
5. **ERP Integrators & CIOs**: Enterprise architects seeking to connect SAP S/4HANA, Oracle Fusion, or Microsoft Dynamics databases to decentralized autonomous workflows.

---

## 🌟 Key Features Guide

Kinetix.ai is split into two primary operational panels: the **Strategic Playbook** and the **Live Agents Simulator**.

### 1. Strategic Playbook (Operating Manual)
A comprehensive, 20-phase strategic guide mapping out Kinetix.ai's multi-million dollar industrial rollout.
*   **Dynamic Phase Directory**: View complete detailed blueprints from Initial Discovery (Phase 1) up to Scale & Governance (Phase 20).
*   **Playbook Modes**: Toggle between **FREE USE** and **PREMIUM (PRO)** mode to inspect advanced target architectures, implementation sequences, risk-shielding frameworks, and technical integration matrices.
*   **Multilingual Indian Languages**: Full dynamic local translations for English, Hindi, Marathi, Gujarati, Odia, Bengali, Tamil, Telugu, and Kannada, making the application friendly for regional logistics coordinators and floor operators alike.
*   **Dual Comfort Theme Toggle**: Dynamic light mode and dark mode selectors placed directly in the main header to optimize legibility under both high-intensity outdoor yard daylight and night-shift console monitoring.

### 2. Live Agents Simulator
An interactive, high-fidelity playground displaying live multi-agent orchestration, complete with live logs and state indicators.

#### 🛰️ Tab A: HQ (Core Orchestrator & Command Desk)
*   **What it does**: Represents the brain of Kinetix.ai. You can issue natural language commands directly to the core orchestrator.
*   **How to use**: Type a command (or click the auto-generated suggestions from other tabs, e.g., *"Procure 120 Tons structural alloys for Jajpur yard"*), and click **Dispatch Command**. Watch the real-time orchestrator process the request, spin up sub-agents, and print structured telemetry logs down in the Live Operations Console.

#### 📄 Tab B: OCR Intelligence (Smart Document Scanning)
*   **What it does**: Simulates deep parsing of physical supply chain bills, challans, or railway receipts using advanced multimodal vision models.
*   **How to use**: Upload an invoice, and watch the system instantly extract and format structured parameters such as HSN codes, IGST, CGST, SGST, freight fees, and total invoice sums without manual typing.

#### 🤝 Tab C: AI Real-Time Negotiation (Contract Margin Optimizer)
*   **What it does**: Runs a live, commercial trade mock-negotiation between Kinetix procurement sub-agents and top supplier sales desks (Tata Steel, JSW Steel, Jindal, Ultratech).
*   **How to use**: 
    1. Select your target **Supplier Desk** (e.g., Tata Steel Distributor vs JSW Steel).
    2. Adjust the desired **Order Volume (Tonnage)** and your **Target Price (₹/Ton)** using the slider.
    3. Toggle the **Immediate T+4 Hour Treasury Settlement guarantee** to unlock up to 4.5% spot concession rates.
    4. Click **Initiate Multi-Agent Negotiation** to watch the real-time convergence chart negotiate counter-offers and finalize contracts.

#### 🚚 Tab D: Logistics Router (GPS & FASTag Dispatch Corridor)
*   **What it does**: Computes transit paths, distances, toll fees, and estimated driving times across key industrial hubs.
*   **How to use**:
    1. Select a **Source Dispatch Hub** and **Destination Delivery Hub** (e.g., Pune, Nagpur, Jajpur, Mumbai).
    2. Click **Dispatch Secure Cargo** to initiate live vehicle transit tracking.
    3. Monitor the truck's progress on the interactive map. Use **Simulate Travel Progress** to push the vehicle through waypoints, triggering automatic FASTag and ONDC compliance updates.
    4. Use **Force Coordinate Poll** to request cellular and GPS updates.

#### 🏛️ Tab E: GST Compliance (GSTR-2B Mismatch Audit & Treasury Lock)
*   **What it does**: Audits vendor invoices against central GSTR registries, shielding cash flows from non-compliant suppliers.
*   **How to use**:
    1. Inspect the live ledger table to see which payments are released (100% Matched) versus locked (HSN/GSTIN Mismatches).
    2. Click **Add New Challan** to manually simulate a new vendor ledger entry. Input custom parameters such as Vendor name, invoice number, GSTIN, HSN Code, and compliance state.
    3. For blocked treasury locks, click **Force Release** to bypass compliance blocks and manually authorize treasury disbursements.

#### 📦 Tab F: Warehouse Agent (Safety Stock Burn-Rate Sandbox)
*   **What it does**: Automatically predicts stockout events using historical lead times and dynamic consumption rates.
*   **How to use**:
    1. Drag the **Inventory Consumption Sandbox Slider** from `0.5x` (Monsoon Lull) to `3.0x` (Peak Infrastructure Blitz).
    2. Watch stock levels of Steel Sheets, Portland Cement, and Alloys immediately recalculate remaining safe days in real-time.
    3. Click the **Prompt Auto-Replenishment** button on depleted materials to automatically draft a purchase instruction directly into the HQ Core Command Desk.

#### 🔌 ERP Connect Modal
*   **What it does**: Integrates Kinetix.ai directly into active ERP cores.
*   **How to use**: Click the **ERP CONNECT** button in the header, choose your system (SAP S/4HANA, Oracle Cloud, or MS Dynamics), specify the secure endpoint, and execute a live webhook test.

---

## 🛠️ Technical Stack & Installation

This application is built as a highly modular, lightning-fast client-side React SPA leveraging Vite and Tailwind CSS.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation Steps

1.  **Clone or Unzip the repository** in your local environment.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run development server**:
    ```bash
    npm run dev
    ```
    This launches the local development server at `http://localhost:3000`.
4.  **Build for Production**:
    ```bash
    npm run build
    ```
    Static optimized assets will be produced inside the `dist/` directory, ready for seamless deployment.

---

## 🛡️ Security & Compliance Standards
*   **Data Protection**: Zero raw PII or proprietary trade data is stored in public logs.
*   **TLS Compliance**: Configured with strict TLS 1.3 encryption handshakes for secure REST/WebSocket telemetry.
*   **GSTR Standardized**: Fully compliant with India’s GST portal HSN structure and national FASTag toll ledgers.
