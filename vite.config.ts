import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Nota: niente `base: '/nome-repo/'` qui. Quel valore serve solo per
  // GitHub Pages (dove il sito vive in un sottopercorso); su Vercel il
  // progetto viene servito dalla radice del dominio, quindi il default
  // `base: '/'` è quello corretto.
});
