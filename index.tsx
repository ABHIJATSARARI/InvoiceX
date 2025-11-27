import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Startup Error:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: #ff6b6b; background: #1a1a1a; height: 100vh;">
      <h1>Application Startup Error</h1>
      <pre style="background: #000; padding: 10px; border-radius: 5px; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}