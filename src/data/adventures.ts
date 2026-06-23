import type { Adventure } from '../types';

/**
 * Archivio delle avventure.
 *
 * Per aggiungere una nuova avventura basta inserire un nuovo oggetto in
 * questo array: nessun componente o pagina deve essere modificato.
 */
export const adventures: Adventure[] = [
  {
    id: 'adv-001',
    slug: 'le-ceneri-di-valdrak',
    title: 'Le Ceneri di Valdrak',
    subtitle: 'Un regno di montagna brucia sotto il peso dei suoi segreti',
    coverImageUrl: 'https://wallpapers.com/images/featured/medieval-fantasy-krvphc5yb1whovd1.jpg',
    synopsis:
      "Quando il Concilio dei Forgiati viene trovato senza vita nella Sala del Martello, la città-fortezza di Valdrak si spacca in tre fazioni pronte alla guerra civile. Gli avventurieri, unici stranieri nella rocca, sono i soli a poter indagare senza essere già parte del complotto — se sopravvivono abbastanza da scoprirlo.",
    longDescription:
      "Valdrak è una città scavata nel fianco di un vulcano addormentato, retta da un'antica alleanza tra clan nanici e umani. Tra intrighi di corte, sabotaggi nelle fucine e un culto che venera le ceneri come presagio di rinascita, il gruppo dovrà scegliere alleanze, raccogliere prove e affrontare un possibile risveglio del vulcano stesso. Pensata come campagna sandbox di livello medio, con bivi narrativi che cambiano il finale in base alle fazioni sostenute.",
    system: 'D&D 5e',
    genres: ['Fantasy', 'Politica', 'Investigazione'],
    playerCount: '4-6 giocatori',
    duration: '4-6 sessioni da circa 3 ore',
    levelRange: 'Livelli 5-9',
    featured: true,
    downloads: [
      {
        id: 'adv-001-completa',
        label: 'Avventura completa',
        description: '58 pagine: mappe, statblock e bivi narrativi',
        fileUrl: '#',
        icon: 'fa-solid fa-book-open',
        fileSize: '12.4 MB',
      },
      {
        id: 'adv-001-pg',
        label: 'Schede PG pre-generate',
        description: '6 personaggi di livello 5 pronti da giocare',
        fileUrl: '#',
        icon: 'fa-solid fa-id-card',
        fileSize: '3.1 MB',
      },
      {
        id: 'adv-001-regole',
        label: 'Riassunto regole',
        description: 'Regole opzionali per duelli politici e assedi',
        fileUrl: '#',
        icon: 'fa-solid fa-scroll',
        fileSize: '1.8 MB',
      },
    ],
  },
  {
    id: 'adv-002',
    slug: 'leco-di-carbonio',
    title: "L'Eco di Carbonio",
    subtitle: 'Nella città-fabbrica di Sør-Vinter, anche le ombre pagano un turno',
    coverImageUrl: 'https://wallpapers.com/images/hd/fantasy-background-8t9v7f98sxuk0y5u.jpg', /*'https://placehold.co/800x500/0D1814/C9A227?text=L%27Eco+di+Carbonio', */
    synopsis:
      "Da settimane, gli operai del distretto industriale di Sør-Vinter scompaiono senza lasciare traccia, se non un sottile strato di fuliggine nera. Un gruppo di investigatori indipendenti viene assunto per scoprire la verità — e si troverà davanti a un'entità che si nutre del fumo delle ciminiere e dei segreti di chi le accende.",
    longDescription:
      "Karbon è un sistema custom leggero pensato per l'horror investigativo industriale: usa un mazzo di carte normali invece dei dadi e introduce la meccanica della 'Fuliggine' per misurare quanto i personaggi si stanno avvicinando alla verità — e a qualcosa che preferirebbe restare nell'ombra. Pensata come one-shot espandibile, con NPC modulari e tre possibili colpevoli a seconda delle prove raccolte dal tavolo.",
    system: 'Sistema Custom: Karbon',
    genres: ['Horror', 'Investigazione', 'Sci-Fi'],
    playerCount: '3-5 giocatori',
    duration: '2-3 sessioni da circa 3 ore (one-shot espandibile)',
    featured: false,
    downloads: [
      {
        id: 'adv-002-completa',
        label: 'Avventura completa',
        description: '34 pagine: ambientazione, indizi e tre finali alternativi',
        fileUrl: '#',
        icon: 'fa-solid fa-book-open',
        fileSize: '8.7 MB',
      },
      {
        id: 'adv-002-pg',
        label: 'Schede Investigatori pre-generate',
        description: '5 investigatori pronti, con mazzo di carte dedicato',
        fileUrl: '#',
        icon: 'fa-solid fa-id-card',
        fileSize: '2.5 MB',
      },
      {
        id: 'adv-002-regole',
        label: 'Riassunto regole Karbon',
        description: 'Le meccaniche di Fuliggine, Indizi e Confronto in 4 pagine',
        fileUrl: '#',
        icon: 'fa-solid fa-scroll',
        fileSize: '1.1 MB',
      },
    ],
  },
];
