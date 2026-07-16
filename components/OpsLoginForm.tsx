"use client";

import { FormEvent, useState } from "react";

export function OpsLoginForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const response = await fetch("/api/ops/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json().catch(() => ({ ok: false, message: "응답을 확인하지 못했습니다." }));
    setPending(false);
    if (data.ok) {
      window.location.assign("/ops");
      return;
    }
    setMessage(data.message ?? "접근하지 못했습니다.");
  }

  return <form className="ops-login-form" onSubmit={submit}><label>운영자 접근 토큰<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label><button type="submit" disabled={pending}>{pending ? "확인 중" : "운영 화면 열기"}</button>{message ? <p role="alert">{message}</p> : null}</form>;
}
