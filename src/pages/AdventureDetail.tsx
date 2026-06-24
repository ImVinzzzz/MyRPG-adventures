import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adventures } from '../data/adventures';
import Tag from '../components/Tag';
import DownloadButton from '../components/DownloadButton';

interface MetaItem {
  icon: string;
  label: string;
}

/**
 * Pagina di dettaglio di una singola avventura.
 *
 * Richiede react-router-dom con una route del tipo:
 *   <Route path="/avventura/:slug" element={<AdventureDetail />} />
 * (vedi anche il Link in `components/AdventureCard.tsx`, che punta a questo path).
 */
export default function AdventureDetail(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const adventure = adventures.find((item) => item.slug === slug);

  if (!adventure) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#10241F] px-6 text-center text-[#E8E2D0]">
        <i className="fa-solid fa-compass text-4xl text-[#C9A227]" aria-hidden="true" />
        <h1 className="font-serif text-2xl font-bold">Dossier non trovato</h1>
        <p className="text-[#A7B3AC]">
          Questa avventura non esiste, o non è ancora stata archiviata.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#C9A227] px-5 py-2 text-sm font-semibold text-[#10241F] transition hover:bg-[#E8C766]"
        >
          <i className="fa-solid fa-angles-left" aria-hidden="true" />
          torna all&apos;archivio 
        </Link>
      </div>
    );
  }

  const metaItems: MetaItem[] = [
    adventure.playerCount && { icon: 'fa-solid fa-users', label: adventure.playerCount },
    adventure.duration && { icon: 'fa-solid fa-hourglass-half', label: adventure.duration },
    adventure.levelRange && { icon: 'fa-solid fa-ranking-star', label: adventure.levelRange },
  ].filter((item): item is MetaItem => Boolean(item));

  return (
    <div className="min-h-screen bg-[#10241F] text-[#E8E2D0]">
      {/* Hero con immagine di copertina */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
        <img
          src={adventure.coverImageUrl}
          alt={`Copertina di ${adventure.title}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10241F] via-[#10241F]/70 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C3CBC5] hover:text-[#E8C766]"
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            Torna all&apos;archivio
          </Link>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
            {adventure.title}
          </h1>
          <p className="mt-2 text-base italic text-[#C3CBC5] sm:text-lg">{adventure.subtitle}</p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {/* Tag: sistema + generi */}
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={adventure.system} variant="system" />
          {adventure.genres.map((genre) => (
            <Tag key={genre} label={genre} variant="genre" />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Sinossi */}
          <section>
            <h2 className="font-serif text-xl font-bold text-[#E8E2D0]">Sinossi</h2>
            <p className="mt-3 leading-relaxed text-[#C3CBC5]">{adventure.synopsis}</p>
            {adventure.longDescription && (
              <p className="mt-4 leading-relaxed text-[#C3CBC5]">{adventure.longDescription}</p>
            )}
          </section>

          {/* Scheda informazioni rapide */}
          {metaItems.length > 0 && (
            <aside className="rounded-xl border border-[#2B3D34] bg-[#16241F] p-5">
              <h2 className="font-serif text-base font-bold text-[#E8E2D0]">Scheda rapida</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {metaItems.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm text-[#C3CBC5]">
                    <i className={`${item.icon} w-4 text-[#C9A227]`} aria-hidden="true" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        {/* Note: box facoltativo, mostrato solo se l'avventura ha qualcosa da segnalare */}
        {adventure.notes && (
          <section className="mt-10 rounded-xl border border-dashed border-[#C9A227]/40 bg-[#16241F] p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#E8E2D0]">
              <i className="fa-solid fa-feather-pointed text-[#C9A227]" aria-hidden="true" />
              Note
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-[#C3CBC5]">
              {adventure.notes}
            </p>
          </section>
        )}

        {/* Sezione Download */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-[#E8E2D0]">Materiali da scaricare</h2>
          <p className="mt-1 text-sm text-[#A7B3AC]">
            Tutto il necessario per portare questa avventura sul tuo tavolo.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adventure.downloads.map((resource) => (
              <DownloadButton key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
