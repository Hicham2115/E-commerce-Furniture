"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Loader2, MapPin, Mail, Phone, Clock } from "lucide-react";
import { api } from "@/lib/axios";

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  { Icon: MapPin, label: "Visit Us", value: "5567 Washington Ave,\nAmerica, 32289" },
  { Icon: Mail, label: "Write to Us", value: "hello@maison.studio" },
  { Icon: Phone, label: "Call Us", value: "+016 76234396" },
  { Icon: Clock, label: "Open Hours", value: "Mon–Sat\n08:00 – 23:00" },
];

export function ContactSection() {
  const container = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [serverError, setServerError] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.from(".ct-ghost", {
        x: -120,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ct-ghost", start: "top 85%" },
      });
      gsap.from(".ct-info-card", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ct-info-card", start: "top 85%" },
      });
      gsap.from(".ct-form > *", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".ct-form", start: "top 85%" },
      });
    },
    { scope: container }
  );

  const mutation = useMutation({
    mutationFn: (payload: typeof form) =>
      api.post("/post", payload).then((r) => r.data),
    onSuccess: () => {
      setForm({ name: "", email: "", message: "" });
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
    if (!form.name || !form.email || !form.message) return;
    setServerError(null);
    mutation.mutate(form);
  }

  return (
    <section
      ref={container}
      id="contact"
      className="relative overflow-hidden bg-[#1c1b1b] px-5 py-32 md:px-16"
    >
      {/* Ghost background text */}
      <div className="ct-ghost pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none">
        <span
          className="text-[140px] font-medium leading-none text-white/[0.03] md:text-[220px]"
          style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
        >
          CONTACT
        </span>
      </div>

      {/* Top label */}
      <div className="relative mb-16 flex items-end justify-between">
        <div>
          <p className="mb-3 text-[11px] tracking-widest uppercase text-[#e4c285]">
            // Say Hello
          </p>
          <h2
            className="text-[40px] font-medium leading-tight tracking-tight text-white md:text-[64px]"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            Let's build something<br />
            <em className="not-italic text-[#e4c285]">remarkable</em> together.
          </h2>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-16 md:grid-cols-12">
        {/* Left: info cards */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {contactInfo.map(({ Icon, label, value }) => (
            <div
              key={label}
              className="ct-info-card group flex items-start gap-5 border border-white/10 p-6 transition-all duration-300 hover:border-[#e4c285]/40 hover:bg-white/[0.03]"
            >
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center border border-white/10 group-hover:border-[#e4c285]/40 transition-colors">
                <Icon aria-hidden="true" className="h-4 w-4 text-[#e4c285]" />
              </div>
              <div>
                <p className="mb-1 text-[10px] tracking-widest uppercase text-white/30">
                  {label}
                </p>
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-white/70">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: form — white box */}
        <form
          onSubmit={handleSubmit}
          className="ct-form md:col-span-8 flex flex-col gap-0"
        >
          {/* Name + Email row */}
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            <div className="group border border-white/20 p-6 focus-within:border-white/60 transition-colors">
              <label className="mb-2 block text-[10px] tracking-widest uppercase text-white/40">
                Your Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                disabled={mutation.isPending || mutation.isSuccess}
                placeholder="Emma Williams"
                className="w-full bg-transparent text-[18px] font-medium text-white placeholder:text-white/20 focus:outline-none"
                style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
            <div className="group border border-l-0 border-white/20 p-6 focus-within:border-white/60 transition-colors">
              <label className="mb-2 block text-[10px] tracking-widest uppercase text-white/40">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                disabled={mutation.isPending || mutation.isSuccess}
                placeholder="hello@studio.com"
                className="w-full bg-transparent text-[18px] font-medium text-white placeholder:text-white/20 focus:outline-none"
                style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* Message */}
          <div className="border border-t-0 border-white/20 p-6 focus-within:border-white/60 transition-colors">
            <label className="mb-2 block text-[10px] tracking-widest uppercase text-white/40">
              Your Message
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              disabled={mutation.isPending || mutation.isSuccess}
              placeholder="Tell us about your project, vision, or simply say hello..."
              className="w-full resize-none bg-transparent text-[18px] font-medium text-white placeholder:text-white/20 focus:outline-none"
              style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
            />
          </div>

          {/* Submit row */}
          <div className="flex items-center justify-between border border-t-0 border-white/20 px-6 py-5">
            {mutation.isSuccess ? (
              <p className="text-sm text-[#e4c285]">
                ✦ Message sent — we'll be in touch soon.
              </p>
            ) : (
              <>
                {serverError && (
                  <p className="text-sm text-red-400">{serverError}</p>
                )}
                <span className="hidden text-[11px] tracking-wider text-white/30 md:block">
                  We respond within 24 hours.
                </span>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="group ml-auto flex items-center gap-3 bg-[#1c1b1b] px-8 py-4 text-[11px] font-medium tracking-widest uppercase text-white transition-all hover:bg-[#e4c285] hover:text-[#1c1b1b] disabled:opacity-60"
                >
                  {mutation.isPending ? (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Decorative corner line */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 border-b border-r border-[#e4c285]/10" />
      <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 border-l border-t border-[#e4c285]/10" />
    </section>
  );
}
