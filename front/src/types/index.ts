export interface Act {
  act_id: string;
  act_name: string;
  act_price: number;
}

export interface InvoicePayload {
  patient_name: string;
  invoice_date: string;
  acts: Act[];
}

export type StatutType = {
  type: "succès" | "erreur" | "";
  message: string;
};
