import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";
import fs from "fs";
import path from "path";
import { getActsByIds } from "./services/ActsService.js";

const THEME = {
  NAVY: rgb(0.01, 0.12, 0.25),
  ACCENT: rgb(0, 0.45, 0.85),
  TEXT: rgb(0.1, 0.1, 0.1),
  GHOST: rgb(0.96, 0.97, 0.98),
  SLATE: rgb(0.5, 0.5, 0.5),
};

const PAGE = { WIDTH: 595, HEIGHT: 842, MARGIN: 45, FOOTER_SPACE: 100 };

const SERVICES_TEXT =
  "Urgences 24h/24 • Gynécologie-Obstétrique • Accouchements • Chirurgie Générale • Coeliochirurgie • Orthopédie • Traumatologie • Plastique & Esthétique • Réanimation • Laboratoire • Radiologie • IRM • Hémodialyse • Cardiologie • ORL • Neurochirurgie • Pédiatrie • Dermatologie";

// --- Clean encoding for French Locale ---
const clean = (text: string) => text.replace(/[\u202f\u00a0]/g, " ");

function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number,
) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(testLine, fontSize) < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  lines.push(currentLine);
  return lines;
}

/** * Draws Logo and Title at the top
 */
function drawHeader(page: PDFPage, assets: any) {
  const { bold, logo } = assets;
  const topY = PAGE.HEIGHT - PAGE.MARGIN;

  if (logo) {
    const dims = logo.scale(0.35);
    page.drawImage(logo, {
      x: PAGE.MARGIN,
      y: topY - dims.height,
      width: dims.width,
      height: dims.height,
    });
  }

  const title = "FACTURE";
  const titleSize = 28;
  const titleW = bold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: PAGE.WIDTH - PAGE.MARGIN - titleW,
    y: topY - titleSize,
    size: titleSize,
    font: bold,
    color: THEME.NAVY,
  });

  return topY - 80; // Returns starting Y for the next section
}

/** * Draws the Service List at the very bottom
 */
function drawFooter(
  page: PDFPage,
  assets: any,
  pageNum: number,
  totalPages: number,
) {
  const { reg } = assets;
  const maxWidth = PAGE.WIDTH - PAGE.MARGIN * 2;
  const serviceLines = wrapText(SERVICES_TEXT, maxWidth, reg, 7);

  let footerY = 50; // Starting from bottom up

  // Page Counter
  const pgText = `Page ${pageNum} / ${totalPages}`;
  const pgW = reg.widthOfTextAtSize(pgText, 8);
  page.drawText(pgText, {
    x: (PAGE.WIDTH - pgW) / 2,
    y: 20,
    size: 8,
    font: reg,
    color: THEME.SLATE,
  });

  // Services (Centered)
  serviceLines.reverse().forEach((line) => {
    const lineWidth = reg.widthOfTextAtSize(line, 7);
    page.drawText(line, {
      x: (PAGE.WIDTH - lineWidth) / 2,
      y: footerY,
      size: 7,
      font: reg,
      color: THEME.SLATE,
    });
    footerY += 10;
  });
}

function drawTableHeader(page: PDFPage, y: number, assets: any) {
  page.drawRectangle({
    x: PAGE.MARGIN,
    y: y - 5,
    width: PAGE.WIDTH - PAGE.MARGIN * 2,
    height: 22,
    color: THEME.ACCENT,
  });
  page.drawText("DÉSIGNATION", {
    x: PAGE.MARGIN + 12,
    y: y,
    size: 8,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("MONTANT (DZD)", {
    x: 460,
    y: y,
    size: 8,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });
}

export async function generatePdf(data: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const assets = await {
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    reg: await pdfDoc.embedFont(StandardFonts.Helvetica),
    italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
    logo: fs.existsSync(path.join(process.cwd(), "src/assets/logo.png"))
      ? await pdfDoc.embedPng(
          fs.readFileSync(path.join(process.cwd(), "src/assets/logo.png")),
        )
      : null,
  };

  let page = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);
  let currentY = drawHeader(page, assets);

  // --- Patient & Date ---
  page.drawRectangle({
    x: PAGE.MARGIN,
    y: currentY - 50,
    width: 220,
    height: 65,
    color: THEME.GHOST,
  });
  page.drawText("PATIENT", {
    x: PAGE.MARGIN + 12,
    y: currentY + 3,
    size: 7,
    font: assets.bold,
    color: THEME.ACCENT,
  });
  page.drawText(String(data.patient_name || "N/A").toUpperCase(), {
    x: PAGE.MARGIN + 12,
    y: currentY - 18,
    size: 12,
    font: assets.bold,
    color: THEME.NAVY,
  });

  // --- Patient Card (Left) ---
  page.drawRectangle({
    x: PAGE.MARGIN,
    y: currentY - 50,
    width: 220,
    height: 65,
    color: THEME.GHOST,
  });
  page.drawText("PATIENT", {
    x: PAGE.MARGIN + 12,
    y: currentY + 3,
    size: 7,
    font: assets.bold,
    color: THEME.ACCENT,
  });
  page.drawText(String(data.patient_name || "N/A").toUpperCase(), {
    x: PAGE.MARGIN + 12,
    y: currentY - 18,
    size: 12,
    font: assets.bold,
    color: THEME.NAVY,
  });

  // --- Meta Info (Right) ---
  const metaX = PAGE.WIDTH - PAGE.MARGIN - 130; // Position for the right-aligned block

  // RESTORED: The "DATE" title label
  page.drawText("DATE", {
    x: metaX,
    y: currentY + 3, // Aligned with the "PATIENT" label on the left
    size: 7,
    font: assets.bold,
    color: THEME.SLATE,
  });

  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dateStr = clean(dateFormatter.format(new Date()));
  page.drawText(dateStr, {
    x: PAGE.WIDTH - PAGE.MARGIN - assets.italic.widthOfTextAtSize(dateStr, 11),
    y: currentY - 12,
    size: 11,
    font: assets.italic,
  });

  currentY -= 110;
  drawTableHeader(page, currentY, assets);
  currentY -= 25;

  // --- Acts ---
  const acts = getActsByIds(data.acts_ids) || [];
  acts.forEach((act: any) => {
    if (currentY < PAGE.FOOTER_SPACE + 20) {
      page = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);
      currentY = PAGE.HEIGHT - PAGE.MARGIN - 20;
      drawTableHeader(page, currentY, assets);
      currentY -= 25;
    }

    page.drawText(act.act_name, {
      x: PAGE.MARGIN + 12,
      y: currentY,
      size: 10,
      font: assets.reg,
    });
    const price = clean(act.act_price.toLocaleString("fr-FR"));
    const priceW = assets.reg.widthOfTextAtSize(price, 10);
    page.drawText(price, {
      x: PAGE.WIDTH - PAGE.MARGIN - priceW - 12,
      y: currentY,
      size: 10,
      font: assets.reg,
    });
    currentY -= 22;
  });

  // --- Total Block ---
  if (currentY < PAGE.FOOTER_SPACE + 60) {
    page = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);
    currentY = PAGE.HEIGHT - PAGE.MARGIN - 20;
  }

  const totalStr = clean(
    `${acts.reduce((s: number, a: any) => s + (a.act_price || 0), 0).toLocaleString("fr-FR")} DZD`,
  );
  currentY -= 40;
  page.drawRectangle({
    x: PAGE.WIDTH - PAGE.MARGIN - 190,
    y: currentY - 10,
    width: 190,
    height: 50,
    color: THEME.NAVY,
  });
  page.drawText("TOTAL À RÉGLER", {
    x: PAGE.WIDTH - PAGE.MARGIN - 175,
    y: currentY + 25,
    size: 8,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(totalStr, {
    x:
      PAGE.WIDTH -
      PAGE.MARGIN -
      assets.bold.widthOfTextAtSize(totalStr, 18) -
      15,
    y: currentY + 2,
    size: 18,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });

  // --- Apply Footer to ALL pages ---
  const pages = pdfDoc.getPages();
  pages.forEach((p, i) => drawFooter(p, assets, i + 1, pages.length));

  return await pdfDoc.save();
}
