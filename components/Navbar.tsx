"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";

const desktopLinks = [
  { href: "/products", label: "Products" },
  { href: "/#about", label: "About Us" },
  { href: "/#contact", label: "Contact Us" },
];

const mobileLinks = [
  { href: "/products", label: "Products" },
  { href: "/#about", label: "About Us" },
  { href: "/#contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart, toggleCart } = useCartStore();
  const cartCount = cart?.totalQuantity ?? 0;
  const { items: wishlistItems, open: openWishlist } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

  return (
    <nav className="fixed top-0 z-50 w-full flex items-center justify-between px-5 md:px-16 py-4 border-b border-[#c4c7c7]/30 bg-[#fdf8f8]/80 backdrop-blur-md shadow-sm">
      {/* Left — hamburger (mobile) + desktop nav links */}
      <div className="flex items-center gap-6">
        {/* Mobile hamburger */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label="Open menu"
              className="p-2 hover:opacity-60 transition-opacity md:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5 text-[#1c1b1b]" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-52 rounded-none border-[#c4c7c7]/40 bg-[#fdf8f8]/97 p-5 shadow-none backdrop-blur-xl"
          >
            <ul className="space-y-5">
              {mobileLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] tracking-[0.25em] uppercase text-[#444748] hover:text-[#1c1b1b] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        {/* Desktop nav links — left of logo */}
        <ul className="hidden md:flex items-center gap-8">
          {desktopLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-[11px] tracking-[0.25em] uppercase transition-colors ${
                    isActive
                      ? "text-[#1c1b1b] border-b border-[#1c1b1b] pb-0.5"
                      : "text-[#444748] hover:text-[#1c1b1b]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Center — wordmark */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 text-[22px] md:text-[28px] font-semibold tracking-[-0.02em] text-[#1c1b1b] hover:opacity-70 transition-opacity"
        style={{
          fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
        }}
      >
        MAISON
      </Link>

      {/* Right — icons */}
      <div className="flex items-center gap-1 md:gap-3">
        <button
          aria-label="Search"
          className="p-2 hover:opacity-60 transition-opacity"
        >
          <Search aria-hidden="true" className="h-4 w-4 text-[#1c1b1b]" />
        </button>
        <button
          aria-label="Open cart"
          onClick={toggleCart}
          className="relative p-2 hover:opacity-60 transition-opacity"
        >
          <ShoppingBag aria-hidden="true" className="h-4 w-4 text-[#1c1b1b]" />
          {cartCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1c1b1b] text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
        <button
          aria-label="Open wishlist"
          onClick={openWishlist}
          className="relative p-2 hover:opacity-60 transition-opacity"
        >
          {wishlistCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e4c285] text-[9px] font-bold text-[#1c1b1b]">
              {wishlistCount}
            </span>
          )}
          <Heart aria-hidden="true" className="h-4 w-4 text-[#1c1b1b]" />
        </button>
      </div>
    </nav>
  );
}
