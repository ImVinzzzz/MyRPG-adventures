import type { ReactElement } from 'react';

export default function Footer(): ReactElement {
  return (
    <footer className="border-t border-[#2B3D34] bg-[#0D1814] px-6 py-6 text-center text-xs text-[#7C8A83]">
      <p>
        Sito amatoriale senza fini di lucro. Non si intende infrangere alcun copyright.
        Tutti i marchi registrati appartengono ai relativi proprietari.
      </p>
    </footer>
  );
}
