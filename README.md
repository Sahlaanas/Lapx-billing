# LAP-X SOLUTIONS — Billing Software

Desktop billing application for LAP-X SOLUTIONS, Calicut.
Built with Electron — works on Windows, Mac, Linux.

---

## 📁 Project Structure

```
lapx-billing/
├── main.js          ← Electron window & menu setup
├── package.json     ← Dependencies & build config
├── src/
│   └── index.html   ← Full billing app (self-contained)
└── README.md
```

---

## 🚀 Setup & Run (Development)

> Requires: Node.js (https://nodejs.org) — download LTS version

```bash
# 1. Clone or download this repo, then open terminal in the folder

# 2. Install dependencies
npm install

# 3. Run the app
npm start
```

---

## 📦 Build Windows Installer (.exe)

```bash
# Build a proper Windows Setup installer
npm run build

# OR build a portable .exe (no installation needed)
npm run build-portable
```

The output will be in the `dist/` folder:
- `LAP-X Billing Setup 1.0.0.exe` — installer (recommended to share)
- Or `LAP-X Billing 1.0.0.exe` — portable version

---

## 🖥️ Features

- ✅ Service Invoice — with device details (brand, model, serial, problem)
- ✅ Sales Invoice — for computer spares / accessories
- ✅ Mixed Invoice — service + sales together
- ✅ Per-item GST rates (0%, 5%, 12%, 18%, 28%)
- ✅ Auto-suggestions for services and spare parts
- ✅ Discount support
- ✅ Payment mode + amount paid + balance due
- ✅ Live invoice preview
- ✅ Print / Save as PDF (Ctrl+P)
- ✅ Pre-filled with LAP-X SOLUTIONS details
- ✅ Business info editable from within the app

---

## 🛠️ Customisation

All shop details (name, address, phone, GSTIN) can be edited
directly inside the app by clicking the **Edit** button in the
Business Info section.

---

## 📞 Contact

LAP-X SOLUTIONS  
YMCA Road, Calicut, Kozhikode, Kerala  
📞 8137 088990 | 9497632116
