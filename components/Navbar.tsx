"use client";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navLinks = ["Living Room", "Bedroom", "Dining", "Kitchen", "Shelves"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full flex items-center justify-between px-5 md:px-16 py-4 border-b border-[#c4c7c7]/30 transition-all duration-500 ${
        scrolled ? "bg-[#fdf8f8]/95 shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Left — hamburger */}
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label="Open menu"
              className="p-2 hover:opacity-60 transition-opacity"
            >
              <Menu aria-hidden="true" className="h-5 w-5 text-[#1c1b1b]" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-48 rounded-none border-[#c4c7c7]/40 bg-[#fdf8f8]/95 p-4 shadow-none backdrop-blur-xl"
          >
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[11px] tracking-[0.25em] uppercase text-[#444748] hover:text-[#1c1b1b] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      {/* Center — wordmark */}
      <a
        href="#"
        className="absolute left-1/2 -translate-x-1/2 text-[22px] md:text-[28px] font-semibold tracking-[-0.02em] text-[#1c1b1b]"
        style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
      >
        MAISON
      </a>

      {/* Right — icons */}
      <div className="flex items-center gap-1 md:gap-3">
        <button aria-label="Search" className="p-2 hover:opacity-60 transition-opacity">
          <Search aria-hidden="true" className="h-4 w-4 text-[#1c1b1b]" />
        </button>
        <button aria-label="Cart" className="p-2 hover:opacity-60 transition-opacity">
          <ShoppingBag aria-hidden="true" className="h-4 w-4 text-[#1c1b1b]" />
        </button>
        <button aria-label="Account" className="p-2 hover:opacity-60 transition-opacity">
          <User aria-hidden="true" className="h-4 w-4 text-[#1c1b1b]" />
        </button>
      </div>
    </nav>
  );
}
