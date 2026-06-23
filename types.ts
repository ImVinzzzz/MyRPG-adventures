/**
 * Tipi e interfacce del modulo "Avventure".
 *
 * Definire qui i contratti dati permette di aggiungere nuove avventure in
 * `data/adventures.ts` senza dover toccare i componenti o le pagine.
 */

/** Sistema di gioco di riferimento. Può essere un sistema ufficiale
 *  (es. "D&D 5e") oppure un sistema custom inventato (es. "Sistema Custom: Karbon"). */
export type GameSystem = string;

/** Una risorsa scaricabile collegata a un'avventura
 *  (PDF dell'avventura, schede PG, riassunto regole, ecc.). */
export interface DownloadResource {
  /** Identificatore univoco della risorsa, usato anche come React key */
  id: string;
  /** Etichetta mostrata sul bottone, es. "Avventura completa" */
  label: string;
  /** Breve descrizione facoltativa, es. "58 pagine, mappe e statblock" */
  description?: string;
  /** Url del file da scaricare ("#" come segnaposto finché non è pubblicato) */
  fileUrl: string;
  /** Classe icona FontAwesome da mostrare sul bottone, es. "fa-solid fa-book-open" */
  icon: string;
  /** Dimensione indicativa del file, es. "3.1 MB" */
  fileSize?: string;
}

/** Rappresenta una singola avventura, campagna o one-shot dell'archivio. */
export interface Adventure {
  /** Identificatore univoco */
  id: string;
  /** Slug usato nell'URL della pagina di dettaglio, es. "le-ceneri-di-valdrak" */
  slug: string;
  /** Titolo principale dell'avventura */
  title: string;
  /** Sottotitolo o tagline */
  subtitle: string;
  /** Url dell'immagine di copertina (può essere un segnaposto testuale) */
  coverImageUrl: string;
  /** Sinossi breve, mostrata sia nelle card che in cima alla pagina di dettaglio */
  synopsis: string;
  /** Descrizione estesa, mostrata solo nella pagina di dettaglio */
  longDescription?: string;
  /** Sistema di gioco, es. "D&D 5e" oppure "Sistema Custom: Karbon" */
  system: GameSystem;
  /** Generi/temi dell'avventura, es. ["Fantasy", "Investigazione"] */
  genres: string[];
  /** Numero di giocatori consigliato, es. "4-6 giocatori" */
  playerCount?: string;
  /** Durata stimata, es. "4-6 sessioni da circa 3 ore" */
  duration?: string;
  /** Fascia di livello: applicabile solo a sistemi level-based, va omessa altrimenti */
  levelRange?: string;
  /** Materiali scaricabili collegati a questa avventura */
  downloads: DownloadResource[];
  /** Se true, l'avventura può essere evidenziata in home come "In evidenza" */
  featured?: boolean;
}
