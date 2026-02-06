import React, { useState, useEffect, useMemo } from "react";
import type { Act, StatutType } from "../types";
import { api } from "../services/api";
import { ActSearchList } from "../components/ActSearchList";
import { InvoiceSidebar } from "../components/InvoiceSidebar";

const InvoicePage: React.FC = () => {
  const [actesBase, setActesBase] = useState<Act[]>([]);
  const [selectionnes, setSelectionnes] = useState<Act[]>([]);
  const [patient, setPatient] = useState("");
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(false);
  const [statut, setStatut] = useState<StatutType>({ type: "", message: "" });

  useEffect(() => {
    api
      .getActs()
      .then(setActesBase)
      .catch(() => setStatut({ type: "erreur", message: "Erreur serveur" }));
  }, []);

  const filtrés = useMemo(
    () =>
      actesBase.filter((a) =>
        a.act_name.toLowerCase().includes(recherche.toLowerCase()),
      ),
    [recherche, actesBase],
  );

  const toggleActe = (acte: Act) => {
    setSelectionnes((prev) =>
      prev.find((a) => a.act_id === acte.act_id)
        ? prev.filter((a) => a.act_id !== acte.act_id)
        : [...prev, acte],
    );
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await api.downloadPdf({
        patient_name: patient,
        invoice_date: new Date().toLocaleDateString("fr-FR"),
        acts: selectionnes,
      });
      setStatut({ type: "succès", message: "Téléchargé !" });
      setSelectionnes([]);
      setPatient("");
    } catch {
      setStatut({ type: "erreur", message: "Échec du téléchargement" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <input
          className="w-full p-4 border rounded-xl"
          placeholder="Nom du patient"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
        />
        <ActSearchList
          actes={filtrés}
          selectionnes={selectionnes}
          onToggle={toggleActe}
          recherche={recherche}
          onSearchChange={setRecherche}
        />
      </div>
      <InvoiceSidebar
        selectionnes={selectionnes}
        onRemove={toggleActe}
        onValidate={handleDownload}
        total={selectionnes.reduce((s, a) => s + a.act_price, 0)}
        loading={loading}
        statut={statut}
        disabled={!patient || selectionnes.length === 0}
      />
    </div>
  );
};

export default InvoicePage;
