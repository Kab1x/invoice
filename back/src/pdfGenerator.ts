// generatePdf.ts
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";

interface Acte {
  act_id: string;
  act_name: string;
  act_price: number;
}

interface InvoiceData {
  patient_name: string;
  invoice_date: string;
  acts: Acte[];
}

export async function generatePdf(data: InvoiceData): Promise<Uint8Array> {
  const { patient_name, invoice_date, acts } = data;

  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const MARGIN = 50;
  const ROW_HEIGHT = 25;
  const BOTTOM_LIMIT = 80;

  let currentY = PAGE_HEIGHT - MARGIN;

  // Helper pour créer une nouvelle page avec en-tête
  const createNewPage = (isFirst = false): PDFPage => {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    currentY = PAGE_HEIGHT - MARGIN;

    if (isFirst) {
      page.drawText("FACTURE MÉDICALE", {
        x: MARGIN,
        y: currentY,
        size: 20,
        font: fontBold,
      });
      currentY -= 30;
      page.drawText(`Patient: ${patient_name}`, {
        x: MARGIN,
        y: currentY,
        size: 12,
        font: fontRegular,
      });
      currentY -= 15;
      page.drawText(`Date: ${invoice_date}`, {
        x: MARGIN,
        y: currentY,
        size: 12,
        font: fontRegular,
      });
      currentY -= 45;
    } else {
      page.drawText(`Suite facture - ${patient_name}`, {
        x: MARGIN,
        y: PAGE_HEIGHT - 35,
        size: 9,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
      });
      currentY -= 20;
    }

    // En-tête du tableau
    page.drawRectangle({
      x: MARGIN,
      y: currentY - 5,
      width: 500,
      height: 20,
      color: rgb(0.95, 0.95, 0.95),
    });
    page.drawText("Désignation de l'acte", {
      x: MARGIN + 10,
      y: currentY,
      size: 10,
      font: fontBold,
    });
    page.drawText("Prix (DZD)", {
      x: 450,
      y: currentY,
      size: 10,
      font: fontBold,
    });

    currentY -= ROW_HEIGHT;
    return page;
  };

  let currentPage = createNewPage(true);

  // Liste des actes
  acts.forEach((acte, index) => {
    if (currentY < BOTTOM_LIMIT) {
      currentPage = createNewPage(false);
    }

    if (index % 2 === 0) {
      currentPage.drawRectangle({
        x: MARGIN,
        y: currentY - 5,
        width: 500,
        height: ROW_HEIGHT,
        color: rgb(0.98, 0.98, 0.98),
      });
    }

    currentPage.drawText(acte.act_name, {
      x: MARGIN + 10,
      y: currentY,
      size: 10,
      font: fontRegular,
    });
    currentPage.drawText(acte.act_price.toLocaleString(), {
      x: 450,
      y: currentY,
      size: 10,
      font: fontRegular,
    });

    currentY -= ROW_HEIGHT;
  });

  // Section Total
  if (currentY < BOTTOM_LIMIT + 40) {
    currentPage = createNewPage(false);
  }

  const total = acts.reduce((sum, a) => sum + a.act_price, 0);
  currentY -= 10;
  currentPage.drawLine({
    start: { x: MARGIN, y: currentY },
    end: { x: 550, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  currentPage.drawText("TOTAL TTC :", {
    x: 300,
    y: currentY - 30,
    size: 14,
    font: fontBold,
  });
  currentPage.drawText(`${total.toLocaleString()} DZD`, {
    x: 450,
    y: currentY - 30,
    size: 14,
    font: fontBold,
    color: rgb(0, 0.4, 0.8),
  });

  // Numérotation des pages
  const pages = pdfDoc.getPages();
  pages.forEach((p, i) => {
    p.drawText(`Page ${i + 1} / ${pages.length}`, {
      x: PAGE_WIDTH / 2 - 20,
      y: 25,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  return await pdfDoc.save();
}
