import type { ReactElement } from 'react';

export default function Footer(): ReactElement {
  return (
    <footer className="border-t border-[#2B3D34] bg-[#0D1814] px-6 py-6 text-center text-xs text-[#7C8A83]">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          Sito amatoriale senza fini di lucro. Non si intende infrangere alcun copyright.
          Tutti i marchi registrati appartengono ai relativi proprietari.
        </p>
        <p>
          <a
            href="https://my-boardgame.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#C9A227] hover:text-[#E8C766] font-semibold transition-colors"
          >
            <i className="fa-solid fa-chess-bishop text-sm" aria-hidden="true" />
            Archivio Board Game
          </a>
        </p>
      </div>
    </footer>
  );
}
