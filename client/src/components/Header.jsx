import React, { useState } from 'react';
import { 
  Download, 
  Code, 
  Palette, 
  Printer, 
  Sparkles, 
  ArrowLeft, 
  Bookmark, 
  Check, 
  PanelLeft, 
  User, 
  Lock 
} from 'lucide-react';
import { useAuth, MAX_GUEST_RUNS } from '../context/AuthContext';

export default function Header({
  stage,
  brandKit,
  onReset,
  onSkipToSynthesis,
  onPreviewMock,
  onExportJson,
  onExportCss,
  onExportSvg,
  onPrintPdf
}) {
  const {
    user,
    isAuthenticated,
    guestRunsCount,
    savedBrands,
    toggleSidebar,
    openAuthModal,
    saveBrandToLibrary
  } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      openAuthModal('save_gate');
      return;
    }

    if (!brandKit) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await saveBrandToLibrary(brandKit, {
        brandName: brandKit?.brandStrategy?.brandName,
        tagline: brandKit?.brandStrategy?.tagline,
        domain: brandKit?.brandStrategy?.archetype
      });

      if (res && res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-[#f2f1ed]/95 backdrop-blur-md px-4 sm:px-8 md:px-12 py-3 border-b border-[#dbd7cd]/60 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Cluster: Sidebar Toggle & Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Library / Sidebar Trigger */}
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-black hover:bg-stone-200/60 transition-colors relative flex items-center gap-1.5"
            title="Open Brand Library & Saved Sessions"
            aria-label="Open Brand Library"
          >
            <PanelLeft className="w-5 h-5 stroke-[1.5]" />
            <span className="hidden lg:inline text-xs font-medium text-stone-700">Library</span>
            {isAuthenticated && savedBrands.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-black absolute top-1.5 right-1.5" />
            )}
          </button>

          {/* Brand Logo & Wordmark */}
          <button
            onClick={onReset}
            className="text-left group transition-opacity hover:opacity-80 flex items-center gap-2"
            title="Brand Builder Home"
          >
            <span className="font-serif font-light text-2xl tracking-[-0.03em] text-black">
              brand builder.
            </span>
          </button>

          <span className="hidden xl:inline-flex items-center font-sans text-[11px] text-stone-500 border border-[#dbd7cd] rounded-full px-2.5 py-0.5 bg-white/50 tracking-wide font-normal">
            Socratic Studio
          </span>
        </div>

        {/* Center / Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Intake View Action */}
          {stage === 'intake' && (
            <button
              onClick={onPreviewMock}
              className="font-sans text-[12px] sm:text-[13px] text-stone-600 hover:text-black border border-[#dbd7cd] rounded-full px-3.5 py-1.5 bg-white/70 hover:bg-white transition-all flex items-center gap-1.5 shadow-none"
            >
              <span>Preview Sample</span>
              <span className="text-[11px] text-stone-400">&rarr;</span>
            </button>
          )}

          {/* Interview View: Skip / Preview Utility */}
          {stage === 'interview' && (
            <button
              onClick={onSkipToSynthesis}
              className="font-sans text-[12px] sm:text-[13px] text-stone-600 hover:text-black border border-[#dbd7cd] rounded-full px-3.5 py-1.5 bg-white/70 hover:bg-white transition-all flex items-center gap-1.5 shadow-none group"
              title="Fast-forward to synthesized brand monograph"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-400 group-hover:text-black transition-colors" />
              <span>Skip to Synthesis</span>
            </button>
          )}

          {/* Brand Kit Dashboard View: Persistence Gating & Export Toolbar */}
          {stage === 'dashboard' && (
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
              <button
                onClick={onReset}
                className="hidden lg:inline-flex items-center gap-1 text-xs text-stone-500 hover:text-black px-2.5 py-1.5 rounded-full border border-transparent hover:border-[#dbd7cd] transition-all"
                title="Start a new brand interview"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>New</span>
              </button>

              {/* PERSISTENCE GATING: Prominent "Save to Library" */}
              <button
                id="saveToLibraryBtn"
                onClick={handleSaveClick}
                disabled={isSaving}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-xs whitespace-nowrap ${
                  saveSuccess
                    ? 'bg-emerald-700 text-white border border-emerald-800'
                    : isAuthenticated
                    ? 'bg-black text-white hover:bg-stone-800 border border-black'
                    : 'bg-stone-900 text-white hover:bg-black border border-stone-800 ring-2 ring-stone-900/10'
                }`}
                title={isAuthenticated ? 'Save this kit to your account library' : 'Sign in to save this kit permanently'}
              >
                {isSaving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved to Library</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span>Save to Library</span>
                    {!isAuthenticated && (
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                        Free
                      </span>
                    )}
                  </>
                )}
              </button>

              <button
                onClick={onExportJson}
                className="hidden sm:inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-white text-stone-800 text-xs px-3 py-1.5 rounded-full hover:border-black transition-all shadow-none whitespace-nowrap"
                title="Export complete tokens as JSON"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>JSON</span>
              </button>

              <button
                onClick={onExportCss}
                className="hidden sm:inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-white text-stone-800 text-xs px-3 py-1.5 rounded-full hover:border-black transition-all shadow-none whitespace-nowrap"
                title="Export CSS Custom Properties"
              >
                <Code className="w-3.5 h-3.5 text-stone-500" />
                <span>CSS</span>
              </button>

              <button
                onClick={onPrintPdf}
                className="inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-white text-stone-800 text-xs px-3 py-1.5 rounded-full hover:border-black transition-all shadow-none whitespace-nowrap"
                title="Print or save Brand Book as PDF"
              >
                <Printer className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="hidden xs:inline">Print / PDF</span>
                <span className="xs:hidden">PDF</span>
              </button>
            </div>
          )}

          {/* Right User Auth Status Cluster */}
          <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-[#dbd7cd]/80 ml-1">
            {isAuthenticated ? (
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#dbd7cd] bg-white/80 hover:bg-white hover:border-black transition-all text-left"
                title="Open Account & Library"
              >
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-serif text-[11px]">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-xs font-medium text-black max-w-[100px] truncate">
                  {user.displayName || user.email.split('@')[0]}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span 
                  className={`hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    guestRunsCount >= MAX_GUEST_RUNS
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-[#dbd7cd] bg-stone-100/80 text-stone-600'
                  }`}
                  title={`${guestRunsCount} of ${MAX_GUEST_RUNS} free guest creations used`}
                >
                  {guestRunsCount >= MAX_GUEST_RUNS ? '2/2 Guest Used' : `${guestRunsCount}/${MAX_GUEST_RUNS} Free`}
                </span>

                <button
                  onClick={() => openAuthModal('manual')}
                  className="font-sans text-xs text-stone-800 hover:text-black border border-[#dbd7cd] rounded-full px-3 py-1 bg-white hover:border-black transition-all font-medium"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
