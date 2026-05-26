const navItems = [
  { label: 'Trang chủ', href: '#home' },
  { label: 'Thiên hà', href: '#galaxy' },
  { label: 'Blog', href: '#blog' },
];

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function Navbar({ mobileMenuOpen, onToggleMenu, onNavigate, onOpenMessagePopup }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070A1A]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          className="text-base font-semibold tracking-wide text-white transition hover:text-cosmic-blue"
          href="#home"
          onClick={() => onNavigate?.()}
        >
          Gửi Một Vì Sao
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="text-sm text-white/75 transition hover:text-white"
              href={item.href}
              onClick={() => onNavigate?.()}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-cosmic-blue/60 hover:bg-cosmic-blue/15"
            onClick={() => {
              onNavigate?.();
              onOpenMessagePopup?.();
            }}
          >
            Gửi thêm một vì sao
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:border-white/30 hover:bg-white/15 md:hidden"
          onClick={onToggleMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon />
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-white/10 bg-[#070A1A]/95 px-4 py-4 md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-3" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                href={item.href}
                onClick={() => onNavigate?.()}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="rounded-2xl bg-cosmic-blue px-4 py-3 text-sm font-medium text-[#06111F] transition hover:brightness-110"
              onClick={() => {
                onNavigate?.();
                onOpenMessagePopup?.();
              }}
            >
              Gửi thêm một vì sao
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
