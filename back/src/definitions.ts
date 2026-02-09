export interface Acte {
  act_id: string;
  act_name: string;
  act_price: number;
}

export interface InvoiceData {
  patient_name: string;
  invoice_date: string;
  acts: Acte[];
}
