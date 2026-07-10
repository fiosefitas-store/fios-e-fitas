"use client";

import { useState } from "react";

interface OrderCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    nome?: string;
    email?: string;
  }) => void;
}

export default function OrderCustomerModal({
  open,
  onClose,
  onConfirm,
}: OrderCustomerModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nomeFocus, setNomeFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onConfirm({
      nome: nome || undefined,
      email: email || undefined,
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ marginBottom: 15, textAlign: "center",}}>
          Informe seu nome e e-mail para acompanhar seu pedido
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onFocus={() => setNomeFocus(true)}
            onBlur={() => setNomeFocus(false)}
            style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: nomeFocus ? "2px solid #ff7a00" : "1px solid #ddd",
                outline: "none",
                transition: "0.2s",
                boxSizing: "border-box",
            }}
            />

           <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: emailFocus ? "2px solid #ff7a00" : "1px solid #ddd",
                outline: "none",
                transition: "0.2s",
                boxSizing: "border-box",
            }}
           />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#c86c3a",
              color: "#fff",
              borderRadius: "8px",
              border: 0,
            }}
          >
            Enviar pedido!
          </button>
        </form>

        <p style={{ fontSize: "12px", color: "#777", justifyContent: "center", textAlign: "center", marginTop: "10px" }}>
            Caso não encontre este e-mail na sua caixa de entrada, verifique a pasta de spam ou promoções.
        </p>       

        <button
          onClick={() => onConfirm({})}
          style={{
            marginTop: "12px",
            background: "none",
            border: 0,
            fontSize: "12px",
            color: "#777",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Continuar sem informar
        </button>
      </div>
    </div>
  );
}