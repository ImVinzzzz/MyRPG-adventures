import { useState, useEffect, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdventureDetail from './pages/AdventureDetail';
import Footer from './components/Footer';

export default function App(): ReactElement {
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [buttonBottom, setButtonBottom] = useState<number>(24); // 24px default (bottom-6)

  useEffect(() => {
    function handleScroll(): void {
      // Mostra o nascondi il bottone in base allo scroll
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Evita la sovrapposizione con il footer
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Se il footer entra nella viewport
        if (footerRect.top < windowHeight) {
          const overlap = windowHeight - footerRect.top;
          setButtonBottom(overlap + 24); // Mantiene 24px di distanza dal footer
        } else {
          setButtonBottom(24);
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
    // Eseguiamo il controllo anche al resize della pagina
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/avventura/:slug" element={<AdventureDetail />} />
            {/* Qualsiasi path non riconosciuto riporta in home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>

      {/* Bottone "Torna in cima" */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          style={{ bottom: buttonBottom + 'px' }}
          className="fixed right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A227]/30 bg-[#0D1814]/90 text-[#C9A227] shadow-lg shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-[#C9A227] hover:bg-[#16241F] hover:text-[#E8C766] hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
          aria-label="Torna in cima"
        >
          <i className="fa-solid fa-arrow-up text-lg" aria-hidden="true" />
        </button>
      )}
    </BrowserRouter>
  );
}
