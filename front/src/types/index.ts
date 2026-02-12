export interface Act {
  act_id: string;
  act_name: string;
  act_price: number;
}

export interface InvoicePayload {
  patient_name: string;
  acts: Act[];
}

export type StatusType = {
  type: "succès" | "erreur" | "";
  message: string;
};
