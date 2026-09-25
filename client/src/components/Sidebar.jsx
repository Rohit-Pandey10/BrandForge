import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  FolderArchive, 
  LogOut, 
  User, 
  Sparkles, 
  ChevronRight, 
  History,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAuth, MAX_GUEST_RUNS } from '../context/AuthContext';

export default function Sidebar({ onRehydrateBrand, onStartNew }) {
  const {
    user,
    isAuthenticated,
    logout,
    savedBrands,
    isSavedBrandsLoading,
    deleteBrandSession,
    guestRunsCount,
    isSidebarOpen,
    setIsSidebarOpen,
    openAuthModal,
    getGuestKits
  } = useAuth();

  const [deletingId, setDeletingId] = useState(null);

  if (!isSidebarOpen) return null;

  const guestKits = !isAuthenticated ? getGuestKits() : [];

  const handleSelectBrand = (session) => {
    if (session && session.brandKit) {
      onRehydrateBrand(session.brandKit, session);
      // Close sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved brand session from your library?')) return;
    setDeletingId(id);
    try {
      await deleteBrandSession(id);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Backdrop for mobile & desktop drawer */}
      <div 
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-[#f7f6f2] border-r border-[#dbd7cd] shadow-2xl flex flex-col justify-between animate-slide-in text-black">
        {/* Top Header */}
        <div className="p-5 border-b border-[#dbd7cd]/80 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-stone-700" />
              <h2 className="font-serif text-lg tracking-[-0.02em] font-medium text-black">
                Brand Library
              </h2>
              {isAuthenticated && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                  {savedBrands.length}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-black hover:bg-stone-200/50 transition-colors"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Brand Action */}
          <button
            onClick={() => {
              onStartNew();
              setIsSidebarOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-full bg-black text-white hover:bg-stone-800 text-xs uppercase tracking-[0.08em] font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span>Create New Brand</span>
          </button>
        </div>

        {/* Middle Content: Saved Brand Sessions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {/* Authenticated Mode: Saved MongoDB Sessions */}
          {isAuthenticated ? (
            <>
              <div className="px-1 py-1 flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  Saved Sessions ({savedBrands.length})
                </span>
              </div>

              {isSavedBrandsLoading ? (
                <div className="py-12 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
                  <span className="w-4 h-4 border-2 border-stone-300 border-t-black rounded-full animate-spin" />
                  <span>Loading your brand library...</span>
                </div>
              ) : savedBrands.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-[#dbd7cd] bg-white/40">
                  <FolderArchive className="w-7 h-7 mx-auto text-stone-400 mb-2 stroke-[1.2]" />
                  <p className="text-xs font-serif text-stone-700 font-medium">No saved brands yet</p>
                  <p className="text-[11px] text-stone-500 mt-1 max-w-[200px] mx-auto">
                    Synthesize any brand kit and click "Save to Library" to archive it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedBrands.map((session) => {
                    const sessionId = session._id || session.id;
                    const brandKit = session.brandKit || {};
                    const strategy = brandKit.brandStrategy || {};
                    const palette = brandKit.visualTokens?.palette || [];

                    return (
                      <div
                        key={sessionId}
                        onClick={() => handleSelectBrand(session)}
                        className="group relative p-3.5 rounded-2xl bg-white border border-[#dbd7cd] hover:border-black transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-serif text-base text-black group-hover:underline truncate font-normal">
                              {session.brandName || strategy.brandName || 'Untitled Brand'}
                            </h3>
                            {session.tagline && (
                              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                                "{session.tagline}"
                              </p>
                            )}
                          </div>

                          {/* Delete Action */}
                          <button
                            onClick={(e) => handleDelete(e, sessionId)}
                            disabled={deletingId === sessionId}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                            title="Delete brand"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Visual Token Swatch Dots & Date */}
                        <div className="mt-3 pt-2.5 border-t border-[#f2f1ed] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {palette.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-stone-300/80 shadow-xs"
                                style={{ backgroundColor: c.hex }}
                                title={`${c.name || c.role}: ${c.hex}`}
                              />
                            ))}
                          </div>

                          <span className="text-[11px] font-mono text-stone-400">
                            {session.createdAt ? new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Saved'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Guest Mode State: Usage counter & guest kits */
            <div className="space-y-4">
              {/* Guest Usage Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#dbd7cd] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono">
                    Guest Pass Usage
                  </span>
                  <span className="text-xs font-mono font-medium text-black">
                    {guestRunsCount} / {MAX_GUEST_RUNS} Free Runs
                  </span>
                </div>

                {/* Segmented Meter */}
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden flex gap-1 p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all ${guestRunsCount >= 1 ? 'bg-black flex-1' : 'bg-transparent flex-1'}`} 
                  />
                  <div 
                    className={`h-full rounded-full transition-all ${guestRunsCount >= 2 ? 'bg-black flex-1' : 'bg-transparent flex-1'}`} 
                  />
                </div>

                <p className="mt-3 text-[11px] text-stone-500 leading-relaxed">
                  Guests can author up to 2 full brand identities. Sign in to unlock unlimited creations and cloud persistence.
                </p>

                <button
                  onClick={() => openAuthModal('manual')}
                  className="mt-3 w-full py-2 px-3 rounded-full border border-black text-black hover:bg-black hover:text-white text-[11px] uppercase tracking-wider font-medium transition-colors"
                >
                  Sign In with @gmail.com
                </button>
              </div>

              {/* Local in-memory guest kits (will migrate on sign-in) */}
              {guestKits.length > 0 && (
                <div>
                  <div className="px-1 py-1 flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                      Recent Guest Creations ({guestKits.length})
                    </span>
                    <span className="text-[11px] text-amber-700 font-mono font-medium">Unsynced</span>
                  </div>

                  <div className="space-y-2">
                    {guestKits.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectBrand(item)}
                        className="p-3 rounded-xl bg-white/80 border border-[#dbd7cd] hover:border-black transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-sm text-black group-hover:underline">
                            {item.brandName}
                          </h4>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-black transition-transform group-hover:translate-x-0.5" />
                        </div>
                        {item.tagline && (
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            "{item.tagline}"
                          </p>
                        )}
                        <p className="mt-2 text-[11px] text-stone-400 font-mono">
                          Sign in to save this kit permanently &rarr;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-[#dbd7cd] bg-white/80">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-serif text-sm shrink-0">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-black truncate">
                    {user.displayName || user.email.split('@')[0]}
                  </p>
                  <p className="text-[11px] font-mono text-stone-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-100 transition-colors shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('manual')}
              className="w-full py-2.5 px-3 rounded-xl border border-[#dbd7cd] bg-white hover:border-black text-black text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
