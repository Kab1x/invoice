import type { Act, InvoicePayload } from "../types";

const API_URL = "http://localhost:3000";

export const api = {
  // Récupérer la liste des actes
  getActs: async (): Promise<Act[]> => {
    const res = await fetch(`${API_URL}/acts/`);
    if (!res.ok) throw new Error("Erreur chargement actes");
    return res.json();
  },

  // Envoyer et télécharger le PDF
  downloadPdf: async (payload: InvoicePayload): Promise<void> => {
    const res = await fetch(`${API_URL}/invoice/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erreur génération PDF");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Facture_${payload.patient_name.replace(/\s+/g, "_")}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  },
};
