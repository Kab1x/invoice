import React from "react";
import type { Act as Act, StatutType } from "../types";

interface Props {
  selectionnes: Act[];
  onRemove: (act: Act) => void;
  onValidate: () => void;
  total: number;
  loading: boolean;
  statut: StatutType;
  disabled: boolean;
}

export const InvoiceSidebar: React.FC<Props> = ({
  selectionnes,
  onRemove,
  onValidate,
  total,
  loading,
  statut,
  disabled,
}) => (
  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl sticky top-8">
    <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">
      Résumé
    </h2>
    <div className="space-y-3 mb-8 max-h-[300px] overflow-y-auto">
      {selectionnes.map((acte) => (
        <div key={acte.act_id} className="flex justify-between text-sm">
          <span className="text-slate-400 truncate flex-1">
            {acte.act_name}
          </span>
          <span className="mx-2">{acte.act_price.toLocaleString()}</span>
          <button onClick={() => onRemove(acte)} className="text-red-400">
            ✕
          </button>
        </div>
      ))}
    </div>
    <div className="border-t border-slate-800 pt-6 mb-8">
      <div className="text-3xl font-black text-blue-400">
        {total.toLocaleString()} DZD
      </div>
    </div>
    <button
      disabled={disabled || loading}
      onClick={onValidate}
      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 py-4 rounded-2xl font-bold transition-all"
    >
      {loading ? "Génération..." : "Télécharger PDF"}
    </button>
    {statut.message && (
      <div
        className={`mt-4 p-2 rounded text-center text-xs ${statut.type === "erreur" ? "text-red-400" : "text-green-400"}`}
      >
        {statut.message}
      </div>
    )}
  </div>
);
