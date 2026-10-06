"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="w-full max-w-lg">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          aria-label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="flex-1 border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-[#d0d0d0] outline-none focus:border-white"
        />
        <button type="submit" className="border border-white bg-white px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[#080808] transition hover:bg-[#080808] hover:text-[#f4f2ed] hover:border-[#f4f2ed]">
          Join Tees Affairs
        </button>
      </div>
      {status === "error" && <p className="mt-3 text-sm text-[#f0d2d2]">Please enter a valid email address.</p>}
      {status === "success" && <p className="mt-3 text-sm text-[#d9f7d7]">You are on the list. Expect first access to new drops.</p>}
    </form>
  );
}
