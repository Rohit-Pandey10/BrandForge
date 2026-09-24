import React from 'react';
import { Download, Code, Palette, Printer, Sparkles, ArrowLeft } from 'lucide-react';

export default function Header({
  stage,
  onReset,
  onSkipToSynthesis,
  onPreviewMock,
  onExportJson,
  onExportCss,
  onExportSvg,
  onPrintPdf
}) {
  return (
    <header className="no-print sticky top-0 z-50 bg-[#f2f1ed]/95 backdrop-blur-md px-6 sm:px-12 py-3.5 border-b border-[#dbd7cd]/60 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Identity: Lowercase serif wordmark + status pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="text-left group transition-opacity hover:opacity-80 flex items-center gap-2"
            title="Brand Builder Home"
          >
            <span className="font-serif font-light text-2xl tracking-[-0.03em] text-black">
              brand builder.
            </span>
          </button>

          <span className="hidden sm:inline-flex items-center font-sans text-[11px] text-stone-500 border border-[#dbd7cd] rounded-full px-2.5 py-0.5 bg-white/50 tracking-wide font-normal">
            Socratic Brand Studio
          </span>
        </div>

        {/* Top Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Intake View Action */}
          {stage === 'intake' && (
            <button
              onClick={onPreviewMock}
              className="font-sans text-[13px] text-stone-600 hover:text-black border border-[#dbd7cd] rounded-full px-4 py-1.5 bg-white/70 hover:bg-white transition-all flex items-center gap-1.5 shadow-none"
            >
              <span>Preview Sample Kit</span>
              <span className="text-[11px] text-stone-400">&rarr;</span>
            </button>
          )}

          {/* Interview View: Skip / Preview Utility */}
          {stage === 'interview' && (
            <button
              onClick={onSkipToSynthesis}
              className="font-sans text-[13px] text-stone-600 hover:text-black border border-[#dbd7cd] rounded-full px-4 py-1.5 bg-white/70 hover:bg-white transition-all flex items-center gap-1.5 shadow-none group"
              title="Fast-forward to synthesized brand monograph"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-400 group-hover:text-black transition-colors" />
              <span>Skip to Synthesis</span>
            </button>
          )}

          {/* Brand Kit Dashboard View: Action Toolbar */}
          {stage === 'dashboard' && (
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
              <button
                onClick={onReset}
                className="hidden md:inline-flex items-center gap-1 text-xs text-stone-500 hover:text-black px-3 py-1.5 rounded-full border border-transparent hover:border-[#dbd7cd] transition-all mr-1"
                title="Start a new brand interview"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>New</span>
              </button>

              <button
                onClick={onExportJson}
                className="inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-white text-stone-800 text-xs px-3.5 py-1.5 rounded-full hover:border-black transition-all shadow-none whitespace-nowrap"
                title="Export complete tokens as JSON"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onExportCss}
                className="inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-white text-stone-800 text-xs px-3.5 py-1.5 rounded-full hover:border-black transition-all shadow-none whitespace-nowrap"
                title="Export CSS Custom Properties (:root variables)"
              >
                <Code className="w-3.5 h-3.5 text-stone-500" />
                <span>Export CSS Tokens</span>
              </button>

              <button
                onClick={onExportSvg}
                className="hidden sm:inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-white text-stone-800 text-xs px-3.5 py-1.5 rounded-full hover:border-black transition-all shadow-none whitespace-nowrap"
                title="Download 5-color palette as SVG"
              >
                <Palette className="w-3.5 h-3.5 text-stone-500" />
                <span>Download SVG</span>
              </button>

              <button
                onClick={onPrintPdf}
                className="inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-black text-white text-xs px-3.5 py-1.5 rounded-full hover:bg-neutral-800 transition-all shadow-none whitespace-nowrap"
                title="Print or save Brand Book as PDF"
              >
                <Printer className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="hidden xs:inline">Print / PDF</span>
                <span className="xs:hidden">PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
