// ======================================================
// 🔄 PROXY DE COMUNICAÇÃO COM O GOOGLE APPS SCRIPT
// Elimina bloqueios de CORS e permite requisições seguras
// ======================================================

import fetch from "node-fetch";

// URL do seu Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyG0f1HkoENoBGttTo4I_Xcqm33A5Bj7U-69d1KqqX4fycWq2xwEm3Afc59Mf4ajjZB/exec";

/**
 * Manipula requisições para /api/proxy
 */
export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Tratar requisição OPTIONS (pré-verificação do navegador)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Encaminhar requisição ao Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Retornar resposta ao frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro no proxy:", error);
    res.status(500).json({ sucesso: false, erro: "Falha no proxy" });
  }
}
