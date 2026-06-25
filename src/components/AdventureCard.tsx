import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { Adventure } from '../types';
import Tag from './Tag';

interface AdventureCardProps {
  adventure: Adventure;
}

/** Icona del "sigillo" mostrato sopra la copertina, in base al sistema di gioco. */
const SYSTEM_SEAL_ICONS: Record<string, string> = {
  'D&D 5e': 'fa-solid fa-dragon',
  'Pathfinder 2e': 'fa-solid fa-dice-d20',
  'Pine Cove': 'fa-solid fa-magnifying-glass',
  'Avalon Sword': 'fa-solid fa-dungeon',
};

function getSealIcon(system: string): string {
  if (SYSTEM_SEAL_ICONS[system]) return SYSTEM_SEAL_ICONS[system];
  if (system.toLowerCase().includes('custom')) return 'fa-solid fa-wand-sparkles';
  return 'fa-solid fa-dice-d20';
}

/**
 * Card mostrata nella griglia della home. Riporta a `/avventura/:slug`.
 * Nota: richiede `react-router-dom` con una route configurata su quel path
 * (vedi il commento in fondo a `pages/AdventureDetail.tsx`).
 */
export default function AdventureCard({ adventure }: AdventureCardProps): ReactElement {
  const visibleGenres = adventure.genres.slice(0, 2);
  const extraGenresCount = adventure.genres.length - visibleGenres.length;

  return (
    <Link
      to={`/avventura/${adventure.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#16241F] ring-1 ring-[#2B3D34] transition-all duration-200 hover:-translate-y-1 hover:ring-[#C9A227]/50 hover:shadow-xl hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
    >
      {/* Copertina */}
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <img
          src={adventure.coverImageUrl}
          alt={`Copertina di ${adventure.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1814] via-[#0D1814]/10 to-transparent" />

        {adventure.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[#8B2635]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F1E5C2] shadow-md">
            <i className="fa-solid fa-splotch"></i> In evidenza
          </span>
        )}

        {/* Sigillo di ceralacca con l'icona del sistema di gioco */}
        <div className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#0D1814]/80 text-[#E8C766] shadow-md ring-2 ring-[#C9A227]/70 backdrop-blur-sm">
          <i className={`${getSealIcon(adventure.system)} text-base`} aria-hidden="true" />
        </div>
      </div>

      {/* Contenuto testuale */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-serif text-lg font-bold leading-snug text-[#E8E2D0] group-hover:text-[#F1E5C2]">
            {adventure.title}
          </h3>
          <p className="mt-1 text-sm italic text-[#A7B3AC]">{adventure.subtitle}</p>
        </div>

        {/* line-clamp è incluso di default da Tailwind v3.3+; su versioni
            precedenti serve il plugin @tailwindcss/line-clamp */}
        <p className="line-clamp-3 text-sm leading-relaxed text-[#C3CBC5]">{adventure.synopsis}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Tag label={adventure.system} variant="system" />
          {visibleGenres.map((genre) => (
            <Tag key={genre} label={genre} variant="genre" />
          ))}
          {extraGenresCount > 0 && (
            <span className="text-xs font-medium text-[#7C8A83]">+{extraGenresCount}</span>
          )}
        </div>

        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A227] transition-transform group-hover:translate-x-0.5">
          Apri il dossier
          <i className="fa-solid fa-angles-right text-xs" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
