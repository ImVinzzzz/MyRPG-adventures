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
      return matchesSystem && matchesGenres;
    });
  }, [selectedSystem, selectedGenres]);

  function toggleGenre(genre: string): void {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]
    );
  }

  function resetFilters(): void {
    setSelectedSystem(null);
    setSelectedGenres([]);
  }

  return (
    <div className="min-h-screen bg-[#10241F] text-[#E8E2D0]">
      {/* Intestazione */}
      <header className="border-b border-[#2B3D34] bg-[#0D1814]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 text-[#C9A227]">
            <i className="fa-solid fa-book-skull text-2xl" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Archivio del Narratore
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
            Le Cronache che ho scritto
          </h1>
          <p className="max-w-2xl text-sm text-[#A7B3AC] sm:text-base">
            Una raccolta di avventure, campagne e one-shot per D&amp;D e sistemi inventati da
            zero. Ogni dossier contiene sinossi, materiali pronti da stampare e tutto il
            necessario per portarla al tuo tavolo.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {/* Filtri: mostrati solo se c'è almeno un'avventura in archivio */}
        {adventures.length > 0 && (
          <div className="mb-8">
            <FilterBar
              systems={systems}
              genres={genres}
              selectedSystem={selectedSystem}
              selectedGenres={selectedGenres}
              onSystemChange={setSelectedSystem}
              onGenreToggle={toggleGenre}
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
