"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Loader2, Globe, Send, Play } from "lucide-react";
import { api } from "@/lib/axios";
import type { NewsletterPayload } from "@/lib/types";

const footerLinks = {
  Menu: ["About", "Industries", "Product", "Categories"],
  Shop: ["Living Room", "Bedroom", "Dining", "Kitchen"],
  Cart: ["Journal", "Contact", "Terms", "Tutorials"],
};

const socials = [
  { Icon: Globe, label: "Social" },
  { Icon: Send, label: "Instagram" },
  { Icon: Play, label: "YouTube" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: NewsletterPayload) =>
      api.post("/post", payload).then((r) => r.data),
    onSuccess: () => {
      setEmail("");
      setServerError(null);
    },
    onError: (err) => {
      setServerError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? err.message)
          : (err as Error).message
      );
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setServerError(null);
    mutation.mutate({ email });
  }

  return (
    <footer className="bg-[#0A0A0A] text-[#f4f0ef] px-5 md:px-16 py-30">
      {/* Top section */}
      <div className="grid grid-cols-4 md:grid-cols-12 gap-6 mb-24">
        {/* Brand + newsletter */}
        <div className="col-span-12 md:col-span-6 space-y-12">
          <p className="text-[11px] tracking-widest uppercase opacity-50">Contact Us</p>
          <h2
            className="text-[48px] md:text-[72px] leading-none font-medium tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            Crafted for homes<br />— that last.
          </h2>

          <div className="max-w-md">
            <label className="block text-[11px] tracking-wider opacity-50 mb-4">
              Subscribe to our journal
            </label>
            <form
              onSubmit={handleSubmit}
              className="flex items-center border-b border-dashed border-[#c4c7c7]/30 pb-2 group"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={mutation.isPending || mutation.isSuccess}
                placeholder="hello@yourhome.studio"
                className="bg-transparent border-none focus:outline-none w-full text-[24px] md:text-[28px] font-medium tracking-tight placeholder:opacity-30 text-[#f4f0ef]"
                style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
              />
              <button
                type="submit"
                disabled={mutation.isPending || mutation.isSuccess}
                aria-label="Subscribe"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform flex-shrink-0 disabled:opacity-60"
              >
                {mutation.isPending ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </form>
            {mutation.isSuccess && (
              <p className="mt-3 text-[12px] text-[#e4c285] tracking-wider">
                You're on the list — thank you.
              </p>
            )}
            {serverError && (
              <p className="mt-3 text-[12px] text-red-400">{serverError}</p>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="col-span-12 md:col-start-8 md:col-span-5 grid grid-cols-2 gap-12 pt-0 md:pt-24">
          <div className="space-y-8">
            <div>
              <p className="text-[11px] tracking-widest uppercase opacity-50 mb-4">Location</p>
              <p className="text-[16px] leading-[1.6] opacity-70">
                5567 Washington Ave,<br />America, 32289
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-widest uppercase opacity-50 mb-4">Call Us</p>
              <p className="text-[16px] leading-[1.6] opacity-70">+016 76234396</p>
            </div>
          </div>
          <div className="space-y-8 text-right">
            <div>
              <p className="text-[11px] tracking-widest uppercase opacity-50 mb-4">Email</p>
              <p className="text-[16px] leading-[1.6] opacity-70">hello@orbix.studio</p>
            </div>
            <div>
              <p className="text-[11px] tracking-widest uppercase opacity-50 mb-4">Open Time</p>
              <p className="text-[16px] leading-[1.6] opacity-70">08.00 - 11.00 pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-[#c4c7c7]/10 pt-16">
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group} className="space-y-4">
            <p className="text-[11px] tracking-widest uppercase opacity-50">{group}</p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[16px] leading-[1.6] opacity-70 hover:text-[#e4c285] hover:opacity-100 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Socials + copyright */}
        <div className="flex flex-col justify-between items-end">
          <div className="flex gap-4">
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 border border-[#c4c7c7]/30 rounded-full flex items-center justify-center hover:border-white transition-colors"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-[10px] tracking-widest opacity-30 mt-8">
            © {new Date().getFullYear()} MAISON. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
