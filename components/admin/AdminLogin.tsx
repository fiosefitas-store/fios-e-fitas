"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      let data: any = null;

      try {
        data = await response.json();
      } catch (e) {
        // non-json response
        const text = await response.text();
        data = { error: text || `Status ${response.status}` };
      }

      if (!response.ok) {
        setError(data?.error || `Erro: ${response.status}`);
        return;
      }

      localStorage.setItem("adminAuth", "true");
      router.push("/admin/dashboard");
    } catch {
      setError("Erro ao conectar com o servidor. Veja o console do servidor para detalhes.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #FDF6F0 0%, #F9EDE5 100%)" }}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-md"
        style={{ boxShadow: "0 24px 60px rgba(61,38,29,0.12)" }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-[#F4845F] mb-1"
            style={{ fontFamily: "var(--font-logo)" }}
          >
            Fios e Fitas
          </h1>
          <p className="text-[#A67C6D] text-sm">Painel Administrativo</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3D261D] mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-3 border border-[#E4D0C5] rounded-xl text-[#3D261D] placeholder-[#C9A898] focus:outline-none focus:border-[#F4845F] focus:shadow-[0_0_0_3px_rgba(244,132,95,0.15)]"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3D261D] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-3 border border-[#E4D0C5] rounded-xl text-[#3D261D] placeholder-[#C9A898] focus:outline-none focus:border-[#F4845F] focus:shadow-[0_0_0_3px_rgba(244,132,95,0.15)]"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-4 rounded-full font-bold text-white text-base transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "#F4845F", boxShadow: "var(--shadow-primary)" }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
