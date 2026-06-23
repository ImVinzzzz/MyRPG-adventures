import type { ReactElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdventureDetail from './pages/AdventureDetail';

/**
 * Componente radice dell'app: configura il routing tra la home
 * (griglia + filtri delle avventure) e la pagina di dettaglio di
 * ciascuna avventura.
 *
 * Richiede react-router-dom:
 *   npm install react-router-dom
 *
 * Il link FontAwesome va inserito nell'<head> di index.html, non qui:
 *   <link rel="stylesheet"
 *     href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
 *     integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
 *     crossorigin="anonymous" referrerpolicy="no-referrer" />
 */
export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/avventura/:slug" element={<AdventureDetail />} />
        {/* Qualsiasi path non riconosciuto riporta in home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
