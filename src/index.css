@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --navy: #1a2744;
  --navy2: #243057;
  --purple: #6c5ce7;
  --purple2: #a29bfe;
  --purple-light: #f0eeff;
  --green: #00b894;
  --red: #d63031;
  --amber: #fdcb6e;
  --blue: #0984e3;
  --bg: #f4f5f9;
  --card: #fff;
  --text: #1e2432;
  --muted: #6b7280;
  --border: #e5e7eb;
  --sidebar-w: 220px;
  --topbar-h: 60px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--text);
  background: var(--bg);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

/* Spinner used throughout — works without Tailwind JIT animation */
.spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  border-top-color: #6c5ce7;
  animation: spin 0.75s linear infinite;
}

.spinner-lg {
  width: 48px;
  height: 48px;
  border-width: 4px;
  border-color: #e5e7eb;
  border-top-color: #6c5ce7;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* Scrollbars */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
