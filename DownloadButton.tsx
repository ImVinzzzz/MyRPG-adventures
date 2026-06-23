import type { ReactElement } from 'react';
import type { DownloadResource } from '../types';

interface DownloadButtonProps {
  resource: DownloadResource;
}

/**
 * Bottone per il download di un materiale (PDF avventura, schede PG,
 * riassunto regole...). Riceve una singola DownloadResource e si occupa
 * solo della presentazione: il link reale verrà impostato in `fileUrl`
 * quando i PDF saranno pronti.
 */
export default function DownloadButton({ resource }: DownloadButtonProps): ReactElement {
  return (
    <a
      href={resource.fileUrl}
      download
      className="group flex items-start gap-4 rounded-lg border border-[#C9A227]/30 bg-[#1B2E27] p-4 transition-all duration-200 hover:border-[#C9A227]/70 hover:bg-[#22372E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10241F]"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#E8C766] ring-1 ring-[#C9A227]/40 transition-colors group-hover:bg-[#C9A227]/25">
        <i className={`${resource.icon} text-lg`} aria-hidden="true" />
      </span>

      <span className="flex flex-col">
        <span className="font-semibold text-[#E8E2D0]">{resource.label}</span>
        {resource.description && (
          <span className="mt-0.5 text-sm text-[#A7B3AC]">{resource.description}</span>
        )}
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#C9A227]">
          <i className="fa-solid fa-download" aria-hidden="true" />
          Scarica PDF{resource.fileSize ? ` · ${resource.fileSize}` : ''}
        </span>
      </span>
    </a>
  );
}
