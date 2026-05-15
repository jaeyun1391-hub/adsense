"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";

export function SearchBox({ placeholder }: { siteSlug?: string; placeholder: string }) {
  const [query, setQuery] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = query.trim();
    if (target) {
      window.location.href = `/search?q=${encodeURIComponent(target)}`;
    }
  }

  return (
    <form className="search-form" onSubmit={submit}>
      <input
        className="search-input"
        name="q"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="검색어"
      />
      <button className="button" type="submit">
        <Search size={16} />
        검색
      </button>
    </form>
  );
}
