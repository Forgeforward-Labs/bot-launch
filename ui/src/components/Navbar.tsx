import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Web3Status } from "./Web3Status";

const navItems = [
  // { label: "Home", path: "/" },
  { label: "Sales", path: "/sales" },
  { label: "Token Factory", path: "/token-factory" },
  { label: "Lock", path: "/lock" },
  { label: "Airdrop", path: "/airdrop" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-[rgba(8,8,12,0.8)] backdrop-blur-[20px] border-b border-zinc-700/30">
        <div className="max-w-[1400px] mx-auto px-4 py-3 md:px-8 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-10">
            {/* Hamburger - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-transparent border-none text-white text-2xl cursor-pointer p-1"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-xl md:text-2xl">◈</span>
              <span className="text-base md:text-xl font-bold tracking-tight bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Forge
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <Web3Status />
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[99] md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0a0a0f] border-r border-zinc-700/30 z-[101] p-6 md:hidden animate-in slide-in-from-left duration-300">
          {/* Drawer Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <span className="text-2xl">◈</span>
            <span className="text-xl font-bold bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Forge
            </span>
          </div>

          {/* Drawer Nav */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 rounded-xl text-base font-medium text-left transition-all ${
                  isActive(item.path)
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "text-zinc-400 border border-transparent hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
