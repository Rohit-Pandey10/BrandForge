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
    saveBrandToLibrary
  } = useAuth();

  const [internalIsSaving, setInternalIsSaving] = useState(false);
  const [internalIsSaved, setInternalIsSaved] = useState(false);

  // Check if active kit is already saved in user's library sessions
  const activeBrandName = (brandKit?.brandStrategy?.brandName || '').trim().toLowerCase();
  const existsInSavedSessions = (savedBrands || []).some(b => {
    const name = (b.brandName || b.brandKit?.brandStrategy?.brandName || '').trim().toLowerCase();
    const id = b._id || b.id;
    return (brandKit?._id && id === brandKit?._id) || (name && name === activeBrandName);
  });

  const isSaved = externalIsSaved !== undefined
    ? externalIsSaved
    : (internalIsSaved || existsInSavedSessions);

  const isSaving = externalIsSaving !== undefined
    ? externalIsSaving
    : internalIsSaving;

  const handleSaveClick = async () => {
    if (isSaved || isSaving) return;

    if (externalOnSave) {
      await externalOnSave();
      return;
    }

    if (!isAuthenticated) {
      openAuthModal('save_gate');
      return;
    }

    if (!brandKit) return;

    setInternalIsSaving(true);
    try {
      const res = await saveBrandToLibrary(brandKit, {
        brandName: brandKit?.brandStrategy?.brandName,
        tagline: brandKit?.brandStrategy?.tagline,
        domain: brandKit?.brandStrategy?.archetype
      });

      if (res && res.success) {
        setInternalIsSaved(true);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setInternalIsSaving(false);
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

          <span className="hidden xl:inline-flex items-center font-mono text-[10px] text-zinc-500 border border-zinc-200 rounded-full px-2.5 py-0.5 bg-white/70 tracking-wide font-medium">
            Socratic Studio
          </span>
        </div>

        {/* Center / Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Intake View Action */}
          {stage === 'intake' && (
            <button
              onClick={onPreviewMock}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl px-3.5 py-1.5 bg-white/80 hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Preview Sample</span>
              <span className="text-[11px] text-zinc-400">&rarr;</span>
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
                  disabled
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default whitespace-nowrap"
                  title="Saved to Library"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved to Library</span>
                </button>
              ) : (
                <button
                  id="saveToLibraryBtn"
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs whitespace-nowrap cursor-pointer ${
                    isAuthenticated
                      ? 'bg-[#1a1a1a] hover:bg-zinc-800 text-white'
                      : 'bg-[#1a1a1a] hover:bg-zinc-800 text-white ring-2 ring-orange-500/20'
                  }`}
                  title={isAuthenticated ? 'Save this kit to your account library' : 'Sign in to save this kit permanently'}
                >
                  {isSaving ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-[10px]">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-zinc-800 max-w-[100px] truncate">
                  {user.displayName || user.email.split('@')[0]}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span 
                  className={`hidden sm:inline-flex items-center text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
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
