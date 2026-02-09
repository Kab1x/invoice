import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFPage,
  PDFFont,
  PDFImage,
} from "pdf-lib";
import fs from "fs";
import path from "path";

const THEME = {
  NAVY: rgb(0.01, 0.12, 0.25),
  ACCENT: rgb(0, 0.45, 0.85),
  TEXT: rgb(0.1, 0.1, 0.1),
  GHOST: rgb(0.96, 0.97, 0.98),
  SLATE: rgb(0.5, 0.5, 0.5),
};

const PAGE = { WIDTH: 595, HEIGHT: 842, MARGIN: 45 };

// The long string of services
const SERVICES_TEXT =
  "Urgences 24h/24 • Gynécologie-Obstétrique • Accouchements • Chirurgie Générale • Coeliochirurgie • Orthopédie • Traumatologie • Plastique & Esthétique • Réanimation • Laboratoire • Radiologie • IRM • Hémodialyse • Cardiologie • ORL • Neurochirurgie • Pédiatrie • Dermatologie";

// --- Helper: Simple Text Wrapping ---
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

async function loadAssets(pdfDoc: PDFDocument) {
  const logoPath = path.join(process.cwd(), "src", "assets", "logo.png");
  return {
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    reg: await pdfDoc.embedFont(StandardFonts.Helvetica),
    logo: fs.existsSync(logoPath)
      ? await pdfDoc.embedPng(fs.readFileSync(logoPath))
      : null,
  };
}

function drawTopHeader(page: PDFPage, assets: any) {
  const { reg, bold, logo } = assets;
  const maxWidth = PAGE.WIDTH - PAGE.MARGIN * 2;

  // 1. Services Header (Top Block - wrapped properly)
  const serviceLines = wrapText(SERVICES_TEXT, maxWidth, reg, 7);
  let serviceY = PAGE.HEIGHT - 25;
  serviceLines.forEach((line) => {
    page.drawText(line, {
      x: PAGE.MARGIN,
      y: serviceY,
      size: 7,
      font: reg,
      color: THEME.SLATE,
    });
    serviceY -= 10;
  });

  // 2. Branding Section (Vertically Centered Logo & Title)
  const brandingY = serviceY - 45; // Starts below the services block
  const titleSize = 28;

  if (logo) {
    const dims = logo.scale(0.35);
    // Calculating exact vertical midpoint
    const logoY = brandingY - dims.height / 2;
    const titleY = brandingY - titleSize / 3; // Adjust for font baseline

    page.drawImage(logo, {
      x: PAGE.MARGIN,
      y: logoY,
      width: dims.width,
      height: dims.height,
    });

    const title = "FACTURE";
    const titleW = bold.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: PAGE.WIDTH - PAGE.MARGIN - titleW,
      y: titleY,
      size: titleSize,
      font: bold,
      color: THEME.NAVY,
    });

    return logoY - 50; // New Y for the next section
  }

  return brandingY - 40;
}

export async function generatePdf(data: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const assets = await loadAssets(pdfDoc);
  let page = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);

  let currentY = drawTopHeader(page, assets);

  // --- Patient Card ---
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

  // --- Meta Info (Right Side) ---
  const metaX = PAGE.WIDTH - PAGE.MARGIN - 110;
  page.drawText("DATE", {
    x: metaX,
    y: currentY,
    size: 7,
    font: assets.bold,
    color: THEME.SLATE,
  });
  page.drawText(data.invoice_date, {
    x: metaX,
    y: currentY - 12,
    size: 10,
    font: assets.reg,
  });

  currentY -= 100;

  // --- Table Header ---
  page.drawRectangle({
    x: PAGE.MARGIN,
    y: currentY - 5,
    width: 505,
    height: 22,
    color: THEME.NAVY,
  });
  page.drawText("DÉSIGNATION", {
    x: PAGE.MARGIN + 12,
    y: currentY,
    size: 8,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("MONTANT (DZD)", {
    x: 475,
    y: currentY,
    size: 8,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });

  currentY -= 25;

  // --- Acts List ---
  const acts = data.acts || [];
  acts.forEach((act: any) => {
    page.drawText(act.act_name, {
      x: PAGE.MARGIN + 12,
      y: currentY,
      size: 10,
      font: assets.reg,
    });
    const price = act.act_price.toLocaleString();
    const priceW = assets.reg.widthOfTextAtSize(price, 10);
    page.drawText(price, {
      x: PAGE.WIDTH - PAGE.MARGIN - priceW - 12,
      y: currentY,
      size: 10,
      font: assets.reg,
    });
    currentY -= 22;
  });

  // --- High Contrast Total Block ---
  const total = acts.reduce((s: number, a: any) => s + (a.act_price || 0), 0);
  const totalStr = `${total.toLocaleString()} DZD`;

  currentY -= 30;
  page.drawRectangle({
    x: PAGE.WIDTH - PAGE.MARGIN - 190,
    y: currentY - 40,
    width: 190,
    height: 50,
    color: THEME.NAVY,
  });

  page.drawText("TOTAL À RÉGLER", {
    x: PAGE.WIDTH - PAGE.MARGIN - 175,
    y: currentY - 5,
    size: 8,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });
  const totalW = assets.bold.widthOfTextAtSize(totalStr, 18);
  page.drawText(totalStr, {
    x: PAGE.WIDTH - PAGE.MARGIN - totalW - 15,
    y: currentY - 28,
    size: 18,
    font: assets.bold,
    color: rgb(1, 1, 1),
  });

  // --- Footer Pass: Page Counter ---
  const pages = pdfDoc.getPages();
  pages.forEach((p, i) => {
    p.drawText(`Page ${i + 1} / ${pages.length}`, {
      x: PAGE.WIDTH / 2 - 20,
      y: 25,
      size: 8,
      font: assets.reg,
      color: THEME.SLATE,
    });
  });

  return await pdfDoc.save();
}
