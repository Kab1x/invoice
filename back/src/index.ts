// index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import catalogueActes from "./acts.js";
import { generatePdf } from "./pdfGenerator.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/invoice/pdf", async (req: Request, res: Response) => {
  try {
    // On passe directement le body à notre service
    const pdfBytes = await generatePdf(req.body);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=facture.pdf`);

    // On transforme le Uint8Array en Buffer pour Express
    res.send(Buffer.from(pdfBytes));

    console.log(`PDF généré pour: ${req.body.patient_name}`);
  } catch (error) {
    console.error("Erreur PDF:", error);
    res.status(500).json({ error: "Échec de la génération du PDF" });
  }
});

app.get("/acts/", (req, res) => {
  res.json(catalogueActes);
});

app.listen(3000, () => console.log("Server running on port 3000"));
