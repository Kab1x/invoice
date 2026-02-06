import React from "react";
import type { Act } from "../types";

interface Props {
  actes: Act[];
  selectionnes: Act[];
  onToggle: (act: Act) => void;
  recherche: string;
  onSearchChange: (val: string) => void;
}

export const ActSearchList: React.FC<Props> = ({
  actes,
  selectionnes,
  onToggle,
  recherche,
  onSearchChange,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
    <input
      type="text"
      placeholder="Rechercher un acte..."
      className="w-full p-4 mb-6 bg-gray-50 border rounded-xl outline-none focus:border-blue-400"
      value={recherche}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <div className="grid grid-cols-1 gap-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
      {actes.map((acte) => {
        const estSel = selectionnes.some((a) => a.act_id === acte.act_id);
        return (
          <button
            key={acte.act_id}
            onClick={() => onToggle(acte)}
            className={`flex justify-between p-4 rounded-xl border-2 transition-all ${
              estSel
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-transparent bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <span className="font-semibold">{acte.act_name}</span>
            <span className="font-mono">
              {acte.act_price.toLocaleString()} DZD
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
