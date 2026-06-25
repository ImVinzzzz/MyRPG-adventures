import type { ReactElement } from 'react';

interface FilterBarProps {
  /** Elenco dei sistemi di gioco disponibili (derivato dai dati) */
  systems: string[];
  /** Elenco dei generi disponibili (derivato dai dati) */
  genres: string[];
  /** Sistema attualmente selezionato; null = "Tutti" */
  selectedSystem: string | null;
  /** Generi attualmente selezionati (selezione multipla, OR tra loro) */
  selectedGenres: string[];
  /** Filtro solo avventure in evidenza */
  onlyFeatured: boolean;
  onSystemChange: (system: string | null) => void;
  onGenreToggle: (genre: string) => void;
  onFeaturedToggle: () => void;
  onReset: () => void;
}

function chipClasses(active: boolean): string {
  return [
    'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10241F]',
    active
      ? 'bg-[#C9A227] text-[#10241F]'
      : 'bg-[#16241F] text-[#C3CBC5] ring-1 ring-[#2B3D34] hover:text-[#E8E2D0] hover:ring-[#C9A227]/50',
  ].join(' ');
}

/**
 * Barra dei filtri per sistema di gioco (selezione singola) e genere
 * (selezione multipla, in OR tra loro). Componente puramente
 * presentazionale: lo stato dei filtri vive in `pages/Home.tsx`,
 * che lo passa via props e riceve i callback al cambio selezione.
 */
export default function FilterBar({
  systems,
  genres,
  selectedSystem,
  selectedGenres,
  onlyFeatured,
  onSystemChange,
  onGenreToggle,
  onFeaturedToggle,
  onReset,
}: FilterBarProps): ReactElement {
  const hasActiveFilters = selectedSystem !== null || selectedGenres.length > 0 || onlyFeatured;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-[#2B3D34] bg-[#0D1814] p-5">
      {/* Filtro extra per evidenziati e sistema di gioco */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7C8A83]">
          Stato e Sistema
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onFeaturedToggle}
            className={chipClasses(onlyFeatured)}
            aria-pressed={onlyFeatured}
          >
            <i className="fa-solid fa-star text-[0.7rem]" aria-hidden="true" />
            In Evidenza
          </button>
          <div className="w-px bg-[#2B3D34] self-stretch my-1"></div>
          <button
            type="button"
            onClick={() => onSystemChange(null)}
            className={chipClasses(selectedSystem === null)}
            aria-pressed={selectedSystem === null}
          >
            <i className="fa-solid fa-layer-group text-[0.7rem]" aria-hidden="true" />
            Tutti i sistemi
          </button>
          {systems.map((system) => (
            <button
              key={system}
              type="button"
              onClick={() => onSystemChange(system)}
              className={chipClasses(selectedSystem === system)}
              aria-pressed={selectedSystem === system}
            >
              <i className="fa-solid fa-dice-d20 text-[0.7rem]" aria-hidden="true" />
              {system}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro per genere (selezione multipla) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7C8A83]">
          Genere
        </span>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => onGenreToggle(genre)}
              className={chipClasses(selectedGenres.includes(genre))}
              aria-pressed={selectedGenres.includes(genre)}
            >
              <i className="fa-solid fa-tag text-[0.7rem]" aria-hidden="true" />
              {genre}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[#C9A227] hover:text-[#E8C766]"
        >
          <i className="fa-solid fa-rotate-left text-[0.7rem]" aria-hidden="true" />
          Azzera filtri
        </button>
      )}
    </div>
  );
}
