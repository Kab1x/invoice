import React, { useState, useEffect, useMemo } from "react";
import type { Act, StatusType } from "../types";
import { api } from "../services/api";
import { ActSearchList } from "../components/ActSearchList";
import { InvoiceSidebar } from "../components/InvoiceSidebar";

const InvoicePage: React.FC = () => {
  const [actesBase, setActesBase] = useState<Act[]>([]);
  const [selectionnes, setSelected] = useState<Act[]>([]);
  const [patient, setPatient] = useState("");
  const [query, setRecherche] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatut] = useState<StatusType>({ type: "", message: "" });

  useEffect(() => {
    api
      .getActs()
      .then(setActesBase)
      .catch(() => setStatut({ type: "erreur", message: "Erreur serveur" }));
  }, []);

  const filtrés = useMemo(
    () =>
      actesBase.filter((a) =>
        a.act_name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, actesBase],
  );

  const toggleActe = (acte: Act) => {
    setSelected((prev) =>
      prev.find((a) => a.act_id === acte.act_id)
        ? prev.filter((a) => a.act_id !== acte.act_id)
        : [...prev, acte.act_id],
    );
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await api.downloadPdf({
        patient_name: patient,
        acts: selectionnes,
      });
      setStatut({ type: "succès", message: "Téléchargé !" });
      setSelected([]);
      setPatient("");
    } catch {
      setStatut({ type: "erreur", message: "Échec du téléchargement" });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    await api.downloadPdf({
      patient_name: "Test",
      acts: actesBase,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <button className="p-2 bg-blue-200" onClick={handleTest}>
        Test
      </button>
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
          search={query}
          onSearchChange={setRecherche}
        />
      </div>
      <InvoiceSidebar
        selected={selectionnes}
        onRemove={toggleActe}
        onValidate={handleDownload}
        total={selectionnes.reduce((s, a) => s + a.act_price, 0)}
        loading={loading}
        status={status}
        disabled={!patient || selectionnes.length === 0}
      />
    </div>
  );
};

export default InvoicePage;
