import React, { useState, useEffect, useMemo } from "react";

// --- Types ---
interface Acte {
  act_id: string;
  act_name: string;
  act_price: number;
}

interface InvoicePayload {
  patient_name: string;
  invoice_date: string;
  acts: Acte[];
}

const API_URL = "http://localhost:3000";

const InvoicePage: React.FC = () => {
  const [actesDisponibles, setActesDisponibles] = useState<Acte[]>([]);
  const [actesSelectionnes, setActesSelectionnes] = useState<Acte[]>([]);
  const [nomPatient, setNomPatient] = useState<string>("");
  const [recherche, setRecherche] = useState<string>("");
  const [chargement, setChargement] = useState<boolean>(true);
  const [enCoursDEnvoi, setEnCoursDEnvoi] = useState<boolean>(false);
  const [statut, setStatut] = useState<{
    type: "succès" | "erreur" | "";
    message: string;
  }>({ type: "", message: "" });

  // 1. Récupération initiale des actes
  useEffect(() => {
    fetch(`${API_URL}/acts/`)
      .then((res) => res.json())
      .then((data: Acte[]) => {
        setActesDisponibles(data);
        setChargement(false);
      })
      .catch(() => {
        setStatut({
          type: "erreur",
          message: "Erreur de connexion au serveur.",
        });
        setChargement(false);
      });
  }, []);

  // 2. Filtrage pour la recherche
  const actesFiltrés = useMemo(() => {
    return actesDisponibles.filter((acte) =>
      acte.act_name.toLowerCase().includes(recherche.toLowerCase()),
    );
  }, [recherche, actesDisponibles]);

  const toggleActe = (acte: Acte) => {
    const existe = actesSelectionnes.find((a) => a.act_id === acte.act_id);
    if (existe) {
      setActesSelectionnes(
        actesSelectionnes.filter((a) => a.act_id !== acte.act_id),
      );
    } else {
      setActesSelectionnes([...actesSelectionnes, acte]);
    }
  };

  // 3. Fonction pour envoyer et télécharger le PDF
  const genererFacturePDF = async () => {
    setEnCoursDEnvoi(true);
    setStatut({ type: "", message: "" });

    const payload: InvoicePayload = {
      patient_name: nomPatient,
      invoice_date: new Date().toLocaleDateString("fr-FR"),
      acts: actesSelectionnes,
    };

    try {
      const response = await fetch(`${API_URL}/invoice/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();

      // Gestion du Blob (Fichier PDF)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Création d'un lien invisible pour déclencher le téléchargement
      const link = document.createElement("a");
      link.href = url;
      link.download = `Facture_${nomPatient.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setStatut({ type: "succès", message: "Facture générée avec succès !" });
      setActesSelectionnes([]);
      setNomPatient("");
      setRecherche("");
    } catch (err) {
      setStatut({
        type: "erreur",
        message: "Erreur lors de la création du PDF.",
      });
    } finally {
      setEnCoursDEnvoi(false);
    }
  };

  const totalGlobal = actesSelectionnes.reduce(
    (sum, acte) => sum + acte.act_price,
    0,
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen bg-gray-50">
      {/* SECTION GAUCHE : Saisie et Sélection */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Nouvelle Facture</h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase">
            Nom du Patient
          </label>
          <input
            type="text"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all"
            placeholder="Ex: Ahmed Benali"
            value={nomPatient}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNomPatient(e.target.value)
            }
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="relative mb-6">
            <span className="absolute left-4 top-4 text-gray-400 font-bold">
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher un acte (ex: Radio, Consultation...)"
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-300 outline-none transition-all"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {chargement ? (
              <div className="text-center py-10 text-gray-400 italic">
                Chargement du catalogue...
              </div>
            ) : (
              actesFiltrés.map((acte) => {
                const estSelectionne = actesSelectionnes.some(
                  (a) => a.act_id === acte.act_id,
                );
                return (
                  <button
                    key={acte.act_id}
                    onClick={() => toggleActe(acte)}
                    className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${
                      estSelectionne
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-transparent bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="font-semibold text-left">
                      {acte.act_name}
                    </span>
                    <span className="font-mono font-bold">
                      {acte.act_price.toLocaleString()} DZD
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* SECTION DROITE : Résumé et Action */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl sticky top-8">
          <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">
            Résumé
          </h2>

          <div className="space-y-3 mb-8 max-h-[250px] overflow-y-auto pr-2">
            {actesSelectionnes.map((acte) => (
              <div
                key={acte.act_id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-400 truncate flex-1 pr-4">
                  {acte.act_name}
                </span>
                <span className="font-mono">
                  {acte.act_price.toLocaleString()}
                </span>
                <button
                  onClick={() => toggleActe(acte)}
                  className="ml-3 text-slate-600 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            {actesSelectionnes.length === 0 && (
              <p className="text-slate-600 italic text-center py-4">
                Aucun acte sélectionné
              </p>
            )}
          </div>

          <div className="border-t border-slate-800 pt-6 mb-8">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">
              Montant Total
            </p>
            <div className="text-3xl font-black text-blue-400">
              {totalGlobal.toLocaleString()}{" "}
              <span className="text-sm">DZD</span>
            </div>
          </div>

          <button
            disabled={
              !nomPatient || actesSelectionnes.length === 0 || enCoursDEnvoi
            }
            onClick={genererFacturePDF}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 flex justify-center items-center"
          >
            {enCoursDEnvoi ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"
                  viewBox="0 0 24 24"
                ></svg>
                Génération...
              </span>
            ) : (
              "Télécharger PDF"
            )}
          </button>

          {statut.message && (
            <div
              className={`mt-6 p-3 rounded-xl text-center text-xs font-bold ${
                statut.type === "erreur"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {statut.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
