import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * Header Component
 * Design System: Warm off-white background, clean modern SaaS nav
 * - Logo: Rounded orange square with a 4-point star inside. "Brand" in black, "Forge" in orange.
 * - Center Links: Features, Pricing, Docs
 * - Right Actions: "Log in" (ghost) and "Sign up free" (solid dark button #1a1a1a)
 */
export default function Header({
  stage,
  onReset,
  onLogin,
  onSignUp
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fbfaf9]/80 backdrop-blur-md border-b border-zinc-200/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* ── Brand Logo ── */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              if (onReset) {
                e.preventDefault();
                onReset();
              }
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            {/* Rounded orange square icon with a 4-point star */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-white fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Precise 4-point geometric star */}
                <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
              </svg>
            </div>
            
            {/* Wordmark: "Brand" in black, "Forge" in orange */}
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              Brand<span className="text-orange-500">Forge</span>
            </span>
          </a>
        </div>

        {/* ── Centered Navigation Links (Desktop) ── */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#docs"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Docs
          </a>
        </nav>

        {/* ── Right Action Buttons (Desktop) ── */}
        <div className="hidden md:flex items-center gap-3">
          {stage === 'dashboard' && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-zinc-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition-colors cursor-pointer mr-2"
            >
              + New Brand
            </button>
          )}
          <button
            type="button"
            onClick={onLogin}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={onSignUp}
            className="bg-[#1a1a1a] hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Sign up free
          </button>
        </div>

        {/* ── Mobile Menu Hamburger ── */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-stone-200/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-[#fbfaf9] px-4 pt-3 pb-6 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-stone-100"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-stone-100"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-stone-100"
          >
            Pricing
          </a>
          <a
            href="#docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-stone-100"
          >
            Docs
          </a>
          <div className="pt-4 border-t border-zinc-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={onLogin}
              className="w-full text-center py-2.5 text-sm font-medium text-zinc-700 hover:bg-stone-100 rounded-lg"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="w-full py-2.5 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium shadow-sm"
            >
              Sign up free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
