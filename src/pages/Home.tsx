import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { adventures } from '../data/adventures';
import AdventureCard from '../components/AdventureCard';
import FilterBar from '../components/FilterBar';

/**
 * Pagina principale: intestazione dell'archivio + filtri + griglia
 * responsive delle avventure. I dati arrivano da `data/adventures.ts`,
 * quindi aggiungere una nuova avventura non richiede modifiche a questo file
 * (i filtri per sistema e genere si aggiornano da soli).
 */
export default function Home(): ReactElement {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Elenco di sistemi e generi derivato dai dati: nessuna lista da
  // mantenere manualmente quando si aggiunge una nuova avventura.
  const systems = useMemo(
    () => Array.from(new Set(adventures.map((adventure) => adventure.system))).sort(),
    []
  );

  const genres = useMemo(
    () => Array.from(new Set(adventures.flatMap((adventure) => adventure.genres))).sort(),
    []
  );

  const filteredAdventures = useMemo(() => {
    return adventures.filter((adventure) => {
      const matchesSystem = selectedSystem === null || adventure.system === selectedSystem;
      // I generi selezionati sono in OR tra loro: basta che l'avventura
      // abbia almeno uno dei generi spuntati per comparire nei risultati.
      const matchesGenres =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) => adventure.genres.includes(genre));
      const matchesFeatured = !onlyFeatured || !!adventure.featured;
      const matchesSearch =
        searchQuery.trim() === '' ||
        adventure.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSystem && matchesGenres && matchesFeatured && matchesSearch;
    });
  }, [selectedSystem, selectedGenres, onlyFeatured, searchQuery]);

  function toggleGenre(genre: string): void {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]
    );
  }

  function toggleFeatured(): void {
    setOnlyFeatured((prev) => !prev);
  }

  function resetFilters(): void {
    setSelectedSystem(null);
    setSelectedGenres([]);
    setOnlyFeatured(false);
    setSearchQuery('');
  }

  return (
    <div className="min-h-screen bg-[#10241F] text-[#E8E2D0]">
      {/* Intestazione */}
      <header className="border-b border-[#2B3D34] bg-[#0D1814]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 text-[#C9A227]">
            <i className="fa-solid fa-book-atlas text-2xl" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
               Archivio del Narratore
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
            Le Cronache di Wyatt Zephirion
          </h1>
          <p className="max-w-2xl text-sm text-[#A7B3AC] sm:text-base">
            Una raccolta di avventure, campagne e one-shot per D&amp;D e altri GdR custom e inventati da zero. 
            Ogni dossier contiene sinossi, materiali pronti da stampare e tutto il necessario per portarla al tuo tavolo.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {/* Barra di controllo superiore con Cerca e Toggle Filtri */}
        {adventures.length > 0 && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#2B3D34] bg-[#0D1814] px-4 py-2.5 text-sm font-semibold text-[#E8E2D0] transition-colors hover:border-[#C9A227] hover:bg-[#16241F] focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              >
                <i
                  className={`fa-solid ${showFilters ? 'fa-eye-slash' : 'fa-filter'} text-xs text-[#C9A227]`}
                  aria-hidden="true"
                />
                {showFilters ? 'Nascondi filtri' : 'Mostra filtri'}
              </button>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <i
                className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C8A83]"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Cerca avventura per titolo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#2B3D34] bg-[#0D1814] py-2.5 pl-10 pr-4 text-sm text-[#E8E2D0] placeholder-[#7C8A83] transition-colors focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7C8A83] hover:text-[#E8E2D0]"
                >
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtri */}
        {adventures.length > 0 && showFilters && (
          <div className="mb-8 animate-fadeIn">
            <FilterBar
              systems={systems}
              genres={genres}
              selectedSystem={selectedSystem}
              selectedGenres={selectedGenres}
              onlyFeatured={onlyFeatured}
              onSystemChange={setSelectedSystem}
              onGenreToggle={toggleGenre}
              onFeaturedToggle={toggleFeatured}
              onReset={resetFilters}
            />
          </div>
        )}

        {/* Griglia avventure */}
        {adventures.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#2B3D34] py-16 text-center text-[#7C8A83]">
            <i className="fa-solid fa-box-archive text-3xl" aria-hidden="true" />
            <p>
              L&apos;archivio è vuoto per ora. Aggiungi una nuova avventura in{' '}
              <code className="rounded bg-[#16241F] px-1.5 py-0.5 text-[#C9A227]">
                data/adventures.ts
              </code>
              .
            </p>
          </div>
        ) : filteredAdventures.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAdventures.map((adventure) => (
              <AdventureCard key={adventure.id} adventure={adventure} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#2B3D34] py-16 text-center text-[#7C8A83]">
            <i className="fa-solid fa-magnifying-glass text-3xl" aria-hidden="true" />
            <p>Nessuna avventura corrisponde ai filtri selezionati.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A227] hover:text-[#E8C766]"
            >
              <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
              Azzera filtri
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
