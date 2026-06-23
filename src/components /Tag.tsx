import type { ReactElement } from 'react';

export type TagVariant = 'system' | 'genre';

interface TagProps {
  label: string;
  variant?: TagVariant;
  /** Classe icona FontAwesome opzionale: se omessa viene scelta in automatico */
  icon?: string;
}

/** Icone di default per i generi più comuni. Per generi non in lista
 *  viene usata un'icona generica (fa-tag). */
const GENRE_ICONS: Record<string, string> = {
  Fantasy: 'fa-solid fa-hat-wizard',
  Horror: 'fa-solid fa-ghost',
  Investigazione: 'fa-solid fa-magnifying-glass',
  'Sci-Fi': 'fa-solid fa-atom',
  Politica: 'fa-solid fa-chess-rook',
  Mistero: 'fa-solid fa-puzzle-piece',
  Avventura: 'fa-solid fa-compass',
};

const DEFAULT_GENRE_ICON = 'fa-solid fa-tag';
const DEFAULT_SYSTEM_ICON = 'fa-solid fa-dice-d20';

/**
 * Etichetta a "pillola" usata per mostrare il sistema di gioco o il genere
 * di un'avventura. La variante "system" ha lo stile dorato/sigillo,
 * la variante "genre" è più discreta.
 */
export default function Tag({ label, variant = 'genre', icon }: TagProps): ReactElement {
  const resolvedIcon =
    icon ?? (variant === 'system' ? DEFAULT_SYSTEM_ICON : GENRE_ICONS[label] ?? DEFAULT_GENRE_ICON);

  const baseClasses =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide';

  const variantClasses =
    variant === 'system'
      ? 'bg-[#C9A227]/15 text-[#E8C766] ring-1 ring-[#C9A227]/40'
      : 'bg-[#5C6F68]/15 text-[#B9C7BE] ring-1 ring-[#5C6F68]/40';

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      <i className={`${resolvedIcon} text-[0.7rem]`} aria-hidden="true" />
      {label}
    </span>
  );
}
