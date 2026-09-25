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
import { SAMPLE_BRAND_KIT } from '../data/sampleBrandKit';

export default function Header({
  stage,
  brandKit,
  onReset,
  onSkipToSynthesis,
  onPreviewMock,
  handleLoadSample,
  onExportJson,
  onExportCss,
  onExportSvg,
  onPrintPdf,
  isSaved: externalIsSaved,
  isSaving: externalIsSaving,
  onSave: externalOnSave
}) {
  const {
    user,
    isAuthenticated,
    guestRunsCount,
    savedBrands = [],
    toggleSidebar,
    openAuthModal,
    saveBrandToLibrary,
    deleteBrandSession
  } = useAuth();

  const savedSessions = savedBrands;
  const activeKit = brandKit;

  // Derive isSaved dynamically
  const savedMatch = savedSessions?.find(s => 
    (activeKit?._id && (s._id === activeKit._id || s.id === activeKit._id)) || 
    (s.brandName && activeKit?.brandStrategy?.brandName && s.brandName.toLowerCase() === activeKit.brandStrategy.brandName.toLowerCase()) ||
    (s.brandKit?.brandStrategy?.brandName && activeKit?.brandStrategy?.brandName && s.brandKit.brandStrategy.brandName.toLowerCase() === activeKit.brandStrategy.brandName.toLowerCase())
  );

  const isSaved = externalIsSaved !== undefined
    ? externalIsSaved
    : Boolean(savedMatch);

  const [isTogglingSave, setIsTogglingSave] = useState(false);
  const isSaving = externalIsSaving !== undefined
    ? externalIsSaving
    : isTogglingSave;

  const handleToggleSave = async () => {
    if (isTogglingSave) return;

    if (externalOnSave) {
      await externalOnSave();
      return;
    }

    if (!isAuthenticated) {
      openAuthModal('save_gate');
      return;
    }

    if (!activeKit) return;

    setIsTogglingSave(true);
    try {
      if (isSaved) {
        // Unsave / Remove
        const targetId = savedMatch?._id || savedMatch?.id || activeKit?._id;
        if (targetId) {
          await deleteBrandSession(targetId);
        }
      } else {
        // Save to Library
        await saveBrandToLibrary(activeKit, {
          brandName: activeKit?.brandStrategy?.brandName,
          tagline: activeKit?.brandStrategy?.tagline,
          domain: activeKit?.brandStrategy?.archetype || 'general'
        });
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsTogglingSave(false);
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-[#fbfaf9]/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 border-b border-zinc-200/60 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Cluster: Sidebar Toggle & Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Library / Sidebar Trigger */}
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors relative flex items-center gap-1.5 cursor-pointer"
            title="Open Brand Library & Saved Sessions"
            aria-label="Open Brand Library"
          >
            <PanelLeft className="w-4.5 h-4.5 stroke-[1.8]" />
            <span className="hidden lg:inline text-xs font-medium text-zinc-700">Library</span>
            {isAuthenticated && savedBrands.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            )}
          </button>

          {/* Brand Logo & Wordmark (Shaurya's Star Icon + Wordmark) */}
          <button
            onClick={onReset}
            className="text-left group transition-transform hover:opacity-90 flex items-center gap-2.5 cursor-pointer"
            title="BrandLoom Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-xs shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <svg
                className="w-4.5 h-4.5 text-white fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              Brand<span className="text-orange-500">Loom</span>
            </span>
          </button>

          <span className="hidden xl:inline-flex items-center font-mono text-xs text-zinc-500 border border-zinc-200 rounded-full px-2.5 py-0.5 bg-white/70 tracking-wide font-medium">
            Socratic Studio
          </span>
        </div>

        {/* Center / Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Intake View Action */}
          {stage === 'intake' && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (typeof handleLoadSample === 'function') {
                  handleLoadSample(SAMPLE_BRAND_KIT);
                } else if (typeof onPreviewMock === 'function') {
                  onPreviewMock(SAMPLE_BRAND_KIT);
                }
              }}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl px-3.5 py-1.5 bg-white/80 hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Preview Sample</span>
              <span className="text-xs text-zinc-400">&rarr;</span>
            </button>
          )}

          {/* Interview View: Skip / Preview Utility */}
          {stage === 'interview' && (
            <button
              onClick={onSkipToSynthesis}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl px-3.5 py-1.5 bg-white/80 hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer"
              title="Fast-forward to synthesized brand monograph"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500 group-hover:scale-110 transition-transform" />
              <span>Skip to Synthesis</span>
            </button>
          )}

          {/* Brand Kit Dashboard View: Persistence Gating & Export Toolbar */}
          {stage === 'dashboard' && (
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
              <button
                onClick={onReset}
                className="hidden lg:inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white/80 hover:bg-white transition-all font-medium cursor-pointer"
                title="Start a new brand interview"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>New</span>
              </button>

              {/* PERSISTENCE GATING: Prominent "Save to Library" */}
              {isSaved ? (
                <button 
                  id="saveToLibraryBtn"
                  type="button" 
                  onClick={handleToggleSave}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-all cursor-pointer whitespace-nowrap"
                  title="Click to remove from library"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0"/>
                  <span>Saved to Library</span>
                </button>
              ) : (
                <button 
                  id="saveToLibraryBtn"
                  type="button" 
                  onClick={handleToggleSave}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 hover:border-stone-400 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Bookmark className="w-4 h-4 text-stone-500 shrink-0"/>
                  <span>Save to Library</span>
                </button>
              )}

              <button
                onClick={onExportJson}
                className="hidden sm:inline-flex items-center gap-1.5 border border-zinc-200 bg-white text-zinc-700 text-xs px-3 py-1.5 rounded-xl hover:border-zinc-400 transition-all shadow-2xs whitespace-nowrap font-medium cursor-pointer"
                title="Export complete tokens as JSON"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={onExportCss}
                className="hidden sm:inline-flex items-center gap-1.5 border border-zinc-200 bg-white text-zinc-700 text-xs px-3 py-1.5 rounded-xl hover:border-zinc-400 transition-all shadow-2xs whitespace-nowrap font-medium cursor-pointer"
                title="Export CSS Custom Properties"
              >
                <Code className="w-3.5 h-3.5 text-zinc-400" />
                <span>CSS</span>
              </button>

              <button
                onClick={onPrintPdf}
                className="inline-flex items-center gap-1.5 border border-zinc-200 bg-white text-zinc-700 text-xs px-3 py-1.5 rounded-xl hover:border-zinc-400 transition-all shadow-2xs whitespace-nowrap font-medium cursor-pointer"
                title="Print or save Brand Book as PDF"
              >
                <Printer className="w-3.5 h-3.5 stroke-[1.8]" />
                <span className="hidden xs:inline">Print / PDF</span>
                <span className="xs:hidden">PDF</span>
              </button>
            </div>
          )}

          {/* Right User Auth Status Cluster */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 ml-1">
            {isAuthenticated ? (
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white/80 hover:bg-white hover:border-zinc-300 transition-all text-left cursor-pointer"
                title="Open Account & Library"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-xs">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-zinc-800 max-w-[100px] truncate">
                  {user.displayName || user.email.split('@')[0]}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span 
                  className={`hidden sm:inline-flex items-center text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                    guestRunsCount >= MAX_GUEST_RUNS
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-zinc-200 bg-zinc-100 text-zinc-600'
                  }`}
                  title={`${guestRunsCount} of ${MAX_GUEST_RUNS} free guest creations used`}
                >
                  {guestRunsCount >= MAX_GUEST_RUNS ? '2/2 Guest Used' : `${guestRunsCount}/${MAX_GUEST_RUNS} Free`}
                </span>

                <button
                  onClick={() => openAuthModal('manual')}
                  className="text-xs font-semibold text-zinc-800 hover:text-black border border-zinc-200 rounded-xl px-3.5 py-1.5 bg-white hover:border-zinc-400 transition-all cursor-pointer shadow-2xs"
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
