import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ReactElement, ChangeEvent } from "react";
import { adventures as avventureIniziali } from "../data/adventures";
import type { Adventure, DownloadResource } from "../types";

export default function AdventureEditor(): ReactElement {
  // Lista delle avventure attive in memoria nell'editor
  const [listaAvventure, setListaAvventure] = useState<Adventure[]>(avventureIniziali);
  const [indiceSelezionato, setIndiceSelezionato] = useState<number>(-1);

  // Stato del form
  const [id, setId] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");
  const [system, setSystem] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [nuovoGenere, setNuovoGenere] = useState<string>("");
  const [playerCount, setPlayerCount] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [levelRange, setLevelRange] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [featured, setFeatured] = useState<boolean>(false);
  const [downloads, setDownloads] = useState<DownloadResource[]>([]);

  // Vista attiva nell'editor: "form" o "preview"
  const [vistaAttiva, setVistaAttiva] = useState<"form" | "preview">("form");

  // Calcola i sistemi e i generi esistenti per suggerimenti
  const sistemiEsistenti = useMemo(() => {
    return Array.from(new Set(listaAvventure.map((a) => a.system))).sort();
  }, [listaAvventure]);

  const generiEsistenti = useMemo(() => {
    return Array.from(new Set(listaAvventure.flatMap((a) => a.genres))).sort();
  }, [listaAvventure]);

  // Genera uno slug valido a partire dal titolo
  function generaSlugDalTitolo(titoloDaConvertire: string): string {
    return titoloDaConvertire
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  // Avvia la creazione di una nuova avventura
  function inizializzaNuovaAvventura(): void {
    const prossimoNumero = listaAvventure.length + 1;
    const paddingNumero = prossimoNumero < 10 ? "00" + prossimoNumero : prossimoNumero < 100 ? "0" + prossimoNumero : "" + prossimoNumero;
    const nuovoId = "adv-" + paddingNumero;

    setIndiceSelezionato(-1);
    setId(nuovoId);
    setTitle("");
    setSlug("");
    setSubtitle("");
    setCoverImageUrl("");
    setSynopsis("");
    setLongDescription("");
    setSystem("");
    setGenres([]);
    setNuovoGenere("");
    setPlayerCount("");
    setDuration("");
    setLevelRange("");
    setNotes("");
    setFeatured(false);
    setDownloads([]);
  }

  // Carica un'avventura esistente nel form per la modifica
  function caricaAvventura(indice: number): void {
    const adv = listaAvventure[indice];
    setIndiceSelezionato(indice);
    setId(adv.id);
    setTitle(adv.title);
    setSlug(adv.slug);
    setSubtitle(adv.subtitle || "");
    setCoverImageUrl(adv.coverImageUrl);
    setSynopsis(adv.synopsis);
    setLongDescription(adv.longDescription || "");
    setSystem(adv.system);
    setGenres(adv.genres);
    setNuovoGenere("");
    setPlayerCount(adv.playerCount || "");
    setDuration(adv.duration || "");
    setLevelRange(adv.levelRange || "");
    setNotes(adv.notes || "");
    setFeatured(!!adv.featured);
    setDownloads(adv.downloads);
  }

  // Gestione modifica campo titolo con generazione automatica dello slug
  function gestisciCambioTitolo(e: ChangeEvent<HTMLInputElement>): void {
    const valore = e.target.value;
    setTitle(valore);
    if (indiceSelezionato === -1) {
      setSlug(generaSlugDalTitolo(valore));
    }
  }

  // Gestione inserimento genere come tag
  function aggiungiGenere(): void {
    const generePulito = nuovoGenere.trim();
    if (generePulito !== "" && !genres.includes(generePulito)) {
      setGenres([...genres, generePulito]);
    }
    setNuovoGenere("");
  }

  function rimuoviGenere(genereDaRimuovere: string): void {
    setGenres(genres.filter((g) => g !== genereDaRimuovere));
  }

  // Gestione risorse scaricabili (downloads)
  function aggiungiRisorsa(): void {
    const risorsaId = id + "-risorsa-" + (downloads.length + 1);
    const nuovaRisorsa: DownloadResource = {
      id: risorsaId,
      label: "Nuova risorsa",
      description: "",
      fileUrl: "#",
      icon: "fa-solid fa-book",
      fileSize: ""
    };
    setDownloads([...downloads, nuovaRisorsa]);
  }

  function aggiornaRisorsa(indice: number, campo: keyof DownloadResource, valore: string): void {
    const nuoveRisorse = downloads.map((risorsa, i) => {
      if (i === indice) {
        return { ...risorsa, [campo]: valore };
      }
      return risorsa;
    });
    setDownloads(nuoveRisorse);
  }

  // Rimuove la risorsa all'indice specificato
  function rimuoviRisorsa(indice: number): void {
    setDownloads(downloads.filter((_, i) => i !== indice));
  }

  // Salva l'avventura corrente nella lista in memoria
  function salvaAvventura(): void {
    if (title.trim() === "" || id.trim() === "" || slug.trim() === "") {
      alert("Titolo, ID e Slug sono obbligatori!");
      return;
    }

    const avventuraModificata: Adventure = {
      id: id.trim(),
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      coverImageUrl: coverImageUrl.trim() || "https://placehold.co/800x500/0D1814/C9A227?text=" + encodeURIComponent(title.trim()),
      synopsis: synopsis.trim(),
      longDescription: longDescription.trim() || undefined,
      system: system.trim() || "Generico",
      genres: genres,
      playerCount: playerCount.trim() || undefined,
      duration: duration.trim() || undefined,
      levelRange: levelRange.trim() || undefined,
      notes: notes.trim() || undefined,
      downloads: downloads,
      featured: featured
    };

    if (indiceSelezionato === -1) {
      // Aggiungi nuova avventura
      setListaAvventure([...listaAvventure, avventuraModificata]);
      alert("Avventura creata con successo nella sessione di lavoro!");
    } else {
      // Modifica avventura esistente
      const nuovaLista = listaAvventure.map((a, i) => (i === indiceSelezionato ? avventuraModificata : a));
      setListaAvventure(nuovaLista);
      alert("Avventura aggiornata con successo nella sessione di lavoro!");
    }
  }

  // Genera il codice del file adventures.ts
  const codiceGenerato = useMemo(() => {
    let codice = "import type { Adventure } from \"../types\";\n\n";
    codice = codice + "/**\n * Archivio delle avventure.\n *\n * Per aggiungere una nuova avventura basta inserire un nuovo oggetto in\n * questo array: nessun componente o pagina deve essere modificato.\n */\n";
    codice = codice + "export const adventures: Adventure[] = [\n";

    listaAvventure.forEach((adv) => {
      codice = codice + "  {\n";
      codice = codice + "    id: \"" + adv.id + "\",\n";
      codice = codice + "    slug: \"" + adv.slug + "\",\n";
      codice = codice + "    title: \"" + adv.title.replace(/"/g, "\\\"") + "\",\n";
      codice = codice + "    subtitle: \"" + adv.subtitle.replace(/"/g, "\\\"") + "\",\n";
      codice = codice + "    coverImageUrl: \"" + adv.coverImageUrl + "\",\n";
      codice = codice + "    synopsis:\n      \"" + adv.synopsis.replace(/"/g, "\\\"").replace(/\n/g, "\\n") + "\",\n";

      if (adv.longDescription) {
        codice = codice + "    longDescription:\n      \"" + adv.longDescription.replace(/"/g, "\\\"").replace(/\n/g, "\\n") + "\",\n";
      }

      codice = codice + "    system: \"" + adv.system + "\",\n";
      codice = codice + "    genres: [" + adv.genres.map((g) => "\"" + g + "\"").join(", ") + "],\n";

      if (adv.playerCount) {
        codice = codice + "    playerCount: \"" + adv.playerCount + "\",\n";
      }
      if (adv.duration) {
        codice = codice + "    duration: \"" + adv.duration + "\",\n";
      }
      if (adv.levelRange) {
        codice = codice + "    levelRange: \"" + adv.levelRange + "\",\n";
      }
      if (adv.featured !== undefined) {
        codice = codice + "    featured: " + adv.featured + ",\n";
      }
      if (adv.notes) {
        codice = codice + "    notes: \"" + adv.notes.replace(/"/g, "\\\"").replace(/\n/g, "\\n") + "\",\n";
      }

      codice = codice + "    downloads: [\n";
      adv.downloads.forEach((dl) => {
        codice = codice + "      {\n";
        codice = codice + "        id: \"" + dl.id + "\",\n";
        codice = codice + "        label: \"" + dl.label.replace(/"/g, "\\\"") + "\",\n";
        if (dl.description) {
          codice = codice + "        description: \"" + dl.description.replace(/"/g, "\\\"") + "\",\n";
        }
        codice = codice + "        fileUrl: \"" + dl.fileUrl + "\",\n";
        codice = codice + "        icon: \"" + dl.icon + "\",\n";
        if (dl.fileSize) {
          codice = codice + "        fileSize: \"" + dl.fileSize + "\",\n";
        }
        codice = codice + "      },\n";
      });
      codice = codice + "    ],\n";

      codice = codice + "  },\n";
    });

    codice = codice + "];\n";
    return codice;
  }, [listaAvventure]);

  // Copia il codice TS negli appunti
  function copiaNegliAppunti(): void {
    navigator.clipboard.writeText(codiceGenerato);
    alert("Codice TypeScript copiato negli appunti!");
  }

  // Avvia il download del file adventures.ts
  function scaricaFile(): void {
    const elemento = document.createElement("a");
    const file = new Blob([codiceGenerato], { type: "text/plain" });
    elemento.href = URL.createObjectURL(file);
    elemento.download = "adventures.ts";
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  }

  return (
    <div className="min-h-screen bg-[#10241F] text-[#E8E2D0]">
      {/* Intestazione Editor */}
      <header className="border-b border-[#2B3D34] bg-[#0D1814] px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#C9A227]">
              <i className="fa-solid fa-screwdriver-wrench text-lg" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Tool Amministratore</span>
            </div>
            <h1 className="font-serif text-2xl font-bold">Editor delle Avventure</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-[#2B3D34] bg-[#0D1814] px-4 py-2 text-sm font-semibold text-[#E8E2D0] transition-colors hover:border-[#C9A227] hover:bg-[#16241F]"
            >
              <i className="fa-solid fa-arrow-left text-xs" /> Torna alla Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Colonna Sinistra: Lista delle avventure esistenti */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="rounded-xl border border-[#2B3D34] bg-[#0D1814] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold text-[#C9A227]">Avventure Caricate</h2>
                <button
                  type="button"
                  onClick={inizializzaNuovaAvventura}
                  className="rounded bg-[#C9A227] px-3 py-1.5 text-xs font-bold text-[#0D1814] hover:bg-[#E8C766]"
                >
                  Nuova +
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                {listaAvventure.map((adv, index) => (
                  <button
                    key={adv.id}
                    type="button"
                    onClick={() => caricaAvventura(index)}
                    className={"w-full text-left p-3 rounded-lg border text-sm transition-all " + (index === indiceSelezionato ? "border-[#C9A227] bg-[#16241F] text-[#E8E2D0]" : "border-[#2B3D34] bg-[#0D1814]/50 text-[#A7B3AC] hover:border-[#C9A227]/50 hover:bg-[#16241F]/30")}
                  >
                    <div className="font-semibold truncate">{adv.title}</div>
                    <div className="text-xs text-[#7C8A83] mt-1 flex justify-between">
                      <span>{adv.system}</span>
                      <span>{adv.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Azioni di Esportazione */}
            <div className="rounded-xl border border-[#2B3D34] bg-[#0D1814] p-4 flex flex-col gap-3">
              <h3 className="font-serif text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Esporta Modifiche</h3>
              <p className="text-xs text-[#A7B3AC]">
                Per applicare i cambiamenti fisicamente nel progetto, copia il codice generato o scarica il file e sovrascrivi <code className="bg-[#16241F] px-1 py-0.5 rounded text-[#C9A227]">src/data/adventures.ts</code>.
              </p>
              <button
                type="button"
                onClick={copiaNegliAppunti}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A227] py-2 text-sm font-bold text-[#0D1814] hover:bg-[#E8C766] transition-colors"
              >
                <i className="fa-solid fa-copy" /> Copia Codice TS
              </button>
              <button
                type="button"
                onClick={scaricaFile}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 text-sm font-bold text-[#E8E2D0] hover:border-[#C9A227] transition-colors"
              >
                <i className="fa-solid fa-download" /> Scarica adventures.ts
              </button>
            </div>
          </div>

          {/* Colonna Destra: Form o Anteprima Live */}
          <div className="lg:col-span-3">
            {/* Tabs per cambiare modalità */}
            <div className="flex border-b border-[#2B3D34] mb-6">
              <button
                type="button"
                onClick={() => setVistaAttiva("form")}
                className={"px-6 py-2.5 font-semibold text-sm border-b-2 transition-colors " + (vistaAttiva === "form" ? "border-[#C9A227] text-[#C9A227]" : "border-transparent text-[#A7B3AC] hover:text-[#E8E2D0]")}
              >
                <i className="fa-solid fa-pen-to-square mr-2" /> Dati Avventura
              </button>
              <button
                type="button"
                onClick={() => setVistaAttiva("preview")}
                className={"px-6 py-2.5 font-semibold text-sm border-b-2 transition-colors " + (vistaAttiva === "preview" ? "border-[#C9A227] text-[#C9A227]" : "border-transparent text-[#A7B3AC] hover:text-[#E8E2D0]")}
              >
                <i className="fa-solid fa-eye mr-2" /> Anteprima Scheda Live
              </button>
            </div>

            {vistaAttiva === "form" ? (
              <div className="rounded-xl border border-[#2B3D34] bg-[#0D1814] p-6 flex flex-col gap-6">
                
                {/* Sezione Base */}
                <div>
                  <h3 className="text-lg font-serif text-[#C9A227] border-b border-[#2B3D34] pb-2 mb-4">Informazioni di Base</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">ID Avventura</label>
                      <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="es: adv-005"
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Titolo</label>
                      <input
                        type="text"
                        value={title}
                        onChange={gestisciCambioTitolo}
                        placeholder="es: Le Ceneri di Valdrak"
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Slug URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="es: le-ceneri-di-valdrak"
                          className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setSlug(generaSlugDalTitolo(title))}
                          className="px-3 rounded-lg border border-[#2B3D34] bg-[#16241F] hover:border-[#C9A227] text-xs text-[#C9A227]"
                          title="Rigenera slug"
                        >
                          Genera
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Sottotitolo / Tagline</label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="es: Un regno di montagna brucia..."
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Grafica e Metadati */}
                <div>
                  <h3 className="text-lg font-serif text-[#C9A227] border-b border-[#2B3D34] pb-2 mb-4">Grafica e Sistema</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">URL Immagine di Copertina</label>
                      <input
                        type="text"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="Inserisci link dell'immagine o segnaposto"
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Sistema di Gioco</label>
                      <input
                        type="text"
                        value={system}
                        onChange={(e) => setSystem(e.target.value)}
                        placeholder="es: D&D 5e o Custom"
                        list="sistemi-suggeriti"
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                      <datalist id="sistemi-suggeriti">
                        {sistemiEsistenti.map((s) => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Generi / Tag */}
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Generi / Tag</label>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {genres.map((g) => (
                        <span
                          key={g}
                          className="inline-flex items-center gap-1 rounded bg-[#16241F] border border-[#2B3D34] px-2 py-1 text-xs text-[#C9A227]"
                        >
                          {g}
                          <button
                            type="button"
                            onClick={() => rimuoviGenere(g)}
                            className="text-[#7C8A83] hover:text-red-400 font-bold"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuovoGenere}
                        onChange={(e) => setNuovoGenere(e.target.value)}
                        placeholder="Aggiungi genere..."
                        list="generi-suggeriti"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            aggiungiGenere();
                          }
                        }}
                        className="rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                      <datalist id="generi-suggeriti">
                        {generiEsistenti.map((g) => (
                          <option key={g} value={g} />
                        ))}
                      </datalist>
                      <button
                        type="button"
                        onClick={aggiungiGenere}
                        className="px-4 rounded-lg bg-[#C9A227] text-sm font-bold text-[#0D1814] hover:bg-[#E8C766]"
                      >
                        Aggiungi
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sessione Dettagli e Limiti */}
                <div>
                  <h3 className="text-lg font-serif text-[#C9A227] border-b border-[#2B3D34] pb-2 mb-4">Specifiche e Durata</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Numero Giocatori</label>
                      <input
                        type="text"
                        value={playerCount}
                        onChange={(e) => setPlayerCount(e.target.value)}
                        placeholder="es: 4-6 giocatori"
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Durata</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="es: 4-6 sessioni da 3 ore"
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Range Livello</label>
                      <input
                        type="text"
                        value={levelRange}
                        onChange={(e) => setLevelRange(e.target.value)}
                        placeholder="es: Livelli 5-9"
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="checkbox-featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-[#2B3D34] bg-[#16241F] text-[#C9A227] focus:ring-[#C9A227]"
                    />
                    <label htmlFor="checkbox-featured" className="ml-2 text-sm font-semibold text-[#E8E2D0]">
                      Metti questa avventura in evidenza (Featured)
                    </label>
                  </div>
                </div>

                {/* Narrazione e Note */}
                <div>
                  <h3 className="text-lg font-serif text-[#C9A227] border-b border-[#2B3D34] pb-2 mb-4">Descrizioni</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Sinossi Breve (Card)</label>
                      <textarea
                        rows={3}
                        value={synopsis}
                        onChange={(e) => setSynopsis(e.target.value)}
                        placeholder="Scrivi una breve sinossi cattura-attenzione..."
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Descrizione Estesa</label>
                      <textarea
                        rows={5}
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        placeholder="Scrivi i dettagli della campagna, fazioni, peculiarità..."
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#A7B3AC] uppercase mb-1.5">Note Aggiuntive (es. Avvertenze Master)</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Note opzionali mostrate in un box dedicato..."
                        className="w-full rounded-lg border border-[#2B3D34] bg-[#16241F] py-2 px-3 text-sm text-[#E8E2D0] focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Risorse Scaricabili */}
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-[#2B3D34] pb-2">
                    <h3 className="text-lg font-serif text-[#C9A227]">Risorse Scaricabili (Downloads)</h3>
                    <button
                      type="button"
                      onClick={aggiungiRisorsa}
                      className="rounded bg-[#16241F] border border-[#C9A227]/40 px-3 py-1 text-xs font-bold text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0D1814]"
                    >
                      Aggiungi Risorsa +
                    </button>
                  </div>

                  {downloads.length === 0 ? (
                    <div className="text-center py-6 text-[#7C8A83] text-sm border border-dashed border-[#2B3D34] rounded-lg">
                      Nessuna risorsa aggiunta. Clicca su "Aggiungi Risorsa" per inserirne una.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {downloads.map((dl, index) => (
                        <div key={dl.id} className="relative rounded-lg border border-[#2B3D34] bg-[#16241F]/40 p-4">
                          <button
                            type="button"
                            onClick={() => rimuoviRisorsa(index)}
                            className="absolute top-2 right-2 text-[#7C8A83] hover:text-red-400 text-sm"
                            title="Rimuovi risorsa"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pr-6">
                            <div>
                              <label className="block text-[10px] font-semibold text-[#A7B3AC] uppercase mb-1">Titolo Pulsante</label>
                              <input
                                type="text"
                                value={dl.label}
                                onChange={(e) => aggiornaRisorsa(index, "label", e.target.value)}
                                placeholder="es: Avventura completa"
                                className="w-full rounded border border-[#2B3D34] bg-[#16241F] py-1 px-2 text-xs text-[#E8E2D0] focus:border-[#C9A227]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-[#A7B3AC] uppercase mb-1">Descrizione File</label>
                              <input
                                type="text"
                                value={dl.description || ""}
                                onChange={(e) => aggiornaRisorsa(index, "description", e.target.value)}
                                placeholder="es: 34 pagine con mappe"
                                className="w-full rounded border border-[#2B3D34] bg-[#16241F] py-1 px-2 text-xs text-[#E8E2D0] focus:border-[#C9A227]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-[#A7B3AC] uppercase mb-1">Percorso File / URL</label>
                              <input
                                type="text"
                                value={dl.fileUrl}
                                onChange={(e) => aggiornaRisorsa(index, "fileUrl", e.target.value)}
                                placeholder="es: /pdfs/documento.pdf"
                                className="w-full rounded border border-[#2B3D34] bg-[#16241F] py-1 px-2 text-xs text-[#E8E2D0] focus:border-[#C9A227]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3 pr-6">
                            <div>
                              <label className="block text-[10px] font-semibold text-[#A7B3AC] uppercase mb-1">Icona (Classe FontAwesome)</label>
                              <input
                                type="text"
                                value={dl.icon}
                                onChange={(e) => aggiornaRisorsa(index, "icon", e.target.value)}
                                placeholder="es: fa-solid fa-book"
                                list="icone-comuni"
                                className="w-full rounded border border-[#2B3D34] bg-[#16241F] py-1 px-2 text-xs text-[#E8E2D0] focus:border-[#C9A227]"
                              />
                              <datalist id="icone-comuni">
                                <option value="fa-solid fa-book" />
                                <option value="fa-solid fa-credit-card" />
                                <option value="fa-solid fa-book-skull" />
                                <option value="fa-solid fa-address-book" />
                                <option value="fa-solid fa-file-pdf" />
                              </datalist>
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-[#A7B3AC] uppercase mb-1">Dimensione</label>
                              <input
                                type="text"
                                value={dl.fileSize || ""}
                                onChange={(e) => aggiornaRisorsa(index, "fileSize", e.target.value)}
                                placeholder="es: 12.4 MB"
                                className="w-full rounded border border-[#2B3D34] bg-[#16241F] py-1 px-2 text-xs text-[#E8E2D0] focus:border-[#C9A227]"
                              />
                            </div>
                            <div className="flex items-end">
                              <span className="text-[10px] text-[#7C8A83] pb-1">
                                ID Risorsa: <code className="bg-[#16241F] p-0.5 rounded text-[#C9A227]">{dl.id}</code>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Salva Pulsante */}
                <div className="flex justify-end pt-4 border-t border-[#2B3D34]">
                  <button
                    type="button"
                    onClick={salvaAvventura}
                    className="rounded-lg bg-[#C9A227] px-6 py-3 font-bold text-[#0D1814] hover:bg-[#E8C766] transition-colors text-sm"
                  >
                    {indiceSelezionato === -1 ? "Crea Nuova Avventura" : "Salva Modifiche Avventura"}
                  </button>
                </div>

              </div>
            ) : (
              /* Anteprima Live dell'avventura in compilazione */
              <div className="flex flex-col gap-6">
                
                {/* Sezione Preview Card */}
                <div>
                  <h3 className="text-xs font-semibold text-[#A7B3AC] uppercase tracking-wider mb-3">Anteprima nella Griglia (Card)</h3>
                  <div className="max-w-[360px]">
                    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#2B3D34] bg-[#0D1814] transition-all duration-300 hover:border-[#C9A227]/50 hover:shadow-lg hover:shadow-black/30">
                      {/* Badge in evidenza */}
                      {featured && (
                        <div className="absolute left-4 top-4 z-10 rounded-full border border-[#C9A227]/40 bg-[#0D1814]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C9A227] backdrop-blur-sm">
                          In evidenza
                        </div>
                      )}
                      
                      {/* Copertina */}
                      <div className="relative aspect-[1.6] w-full overflow-hidden bg-[#16241F]">
                        <img
                          src={coverImageUrl || "https://placehold.co/800x500/0D1814/C9A227?text=" + encodeURIComponent(title || "Titolo Avventura")}
                          alt={title || "Titolo"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/800x500/0D1814/C9A227?text=Immagine+Non+Disponibile";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1814] via-[#0D1814]/20 to-transparent" />
                      </div>

                      {/* Contenuto Card */}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2.5 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A227]">
                            {system || "Sistema non specificato"}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold leading-snug text-[#E8E2D0] group-hover:text-[#C9A227] transition-colors">
                          {title || "Titolo Avventura"}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-xs text-[#A7B3AC] leading-relaxed flex-grow">
                          {synopsis || "Compila la sinossi dell'avventura per vederla visualizzata in questo box."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {genres.length > 0 ? (
                            genres.slice(0, 3).map((g) => (
                              <span key={g} className="rounded bg-[#16241F] border border-[#2B3D34] px-2 py-0.5 text-[10px] text-[#A7B3AC]">
                                {g}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-[#7C8A83]">Nessun genere inserito</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sezione Preview Pagina Dettaglio */}
                <div>
                  <h3 className="text-xs font-semibold text-[#A7B3AC] uppercase tracking-wider mb-3">Anteprima Dettaglio Avventura (Simulazione)</h3>
                  <div className="rounded-xl border border-[#2B3D34] bg-[#0D1814] overflow-hidden">
                    {/* Header Dettaglio */}
                    <div className="relative px-6 py-12 md:px-10 md:py-16 bg-[#16241F]/30 border-b border-[#2B3D34]">
                      <div className="max-w-3xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#0D1814]/75 px-3 py-1 text-xs font-semibold tracking-wider text-[#C9A227]">
                          <i className="fa-solid fa-gamepad" /> {system || "Sistema"}
                        </div>
                        <h2 className="font-serif text-3xl font-bold sm:text-4xl text-[#E8E2D0]">{title || "Titolo Avventura"}</h2>
                        {subtitle && <p className="mt-2 text-lg text-[#C9A227] font-serif italic">{subtitle}</p>}
                      </div>
                    </div>

                    {/* Corpo Dettaglio */}
                    <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Descrizione ed Esteso */}
                      <div className="md:col-span-2 flex flex-col gap-6">
                        <div>
                          <h4 className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">La Sinossi</h4>
                          <p className="text-sm leading-relaxed text-[#E8E2D0] whitespace-pre-line">
                            {synopsis || "Compila la sinossi."}
                          </p>
                        </div>

                        {longDescription && (
                          <div>
                            <h4 className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Informazioni Dettagliate</h4>
                            <p className="text-sm leading-relaxed text-[#A7B3AC] whitespace-pre-line">
                              {longDescription}
                            </p>
                          </div>
                        )}

                        {notes && (
                          <div className="rounded-lg border border-[#C9A227]/20 bg-[#16241F]/40 p-4">
                            <h5 className="text-xs font-bold text-[#C9A227] uppercase tracking-wider mb-1">Note Utili per il Master</h5>
                            <p className="text-xs text-[#A7B3AC] leading-relaxed italic">{notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Sidebar Dettagli & Risorse */}
                      <div className="flex flex-col gap-6">
                        <div className="rounded-lg border border-[#2B3D34] bg-[#16241F]/30 p-4">
                          <h4 className="text-xs font-bold text-[#C9A227] uppercase tracking-wider mb-3">Specifiche</h4>
                          <ul className="flex flex-col gap-2.5 text-xs">
                            <li className="flex justify-between border-b border-[#2B3D34]/50 pb-1.5">
                              <span className="text-[#7C8A83]">Giocatori:</span>
                              <span className="font-semibold text-[#E8E2D0]">{playerCount || "-"}</span>
                            </li>
                            <li className="flex justify-between border-b border-[#2B3D34]/50 pb-1.5">
                              <span className="text-[#7C8A83]">Durata:</span>
                              <span className="font-semibold text-[#E8E2D0]">{duration || "-"}</span>
                            </li>
                            {levelRange && (
                              <li className="flex justify-between border-b border-[#2B3D34]/50 pb-1.5">
                                <span className="text-[#7C8A83]">Livelli:</span>
                                <span className="font-semibold text-[#E8E2D0]">{levelRange}</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Pulsanti Risorse */}
                        <div className="flex flex-col gap-2">
                          <h4 className="text-xs font-bold text-[#C9A227] uppercase tracking-wider mb-1">Risorse per la Sessione</h4>
                          {downloads.length > 0 ? (
                            downloads.map((dl) => (
                              <div
                                key={dl.id}
                                className="w-full flex items-center justify-between gap-3 rounded-lg border border-[#2B3D34] bg-[#0D1814] p-3 text-left transition-all hover:border-[#C9A227] hover:bg-[#16241F]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16241F] text-[#C9A227] border border-[#2B3D34]">
                                    <i className={dl.icon} aria-hidden="true" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-[#E8E2D0]">{dl.label}</div>
                                    {dl.description && <div className="text-[10px] text-[#A7B3AC] mt-0.5">{dl.description}</div>}
                                  </div>
                                </div>
                                {dl.fileSize && <span className="text-[10px] font-semibold text-[#7C8A83]">{dl.fileSize}</span>}
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-[#7C8A83] italic">Nessuna risorsa aggiunta</span>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
