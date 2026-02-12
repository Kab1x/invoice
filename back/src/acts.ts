const allActs = [
  // CONSULTATIONS & VISITES
  { act_id: "C1", act_name: "Consultation Médecine Générale", act_price: 2000 },
  { act_id: "C2", act_name: "Consultation Spécialisée", act_price: 3500 },
  { act_id: "C3", act_name: "Consultation de Nuit / Urgence", act_price: 4500 },
  { act_id: "C4", act_name: "Visite à domicile", act_price: 5000 },
  { act_id: "C5", act_name: "Certificat d'aptitude physique", act_price: 1500 },
  { act_id: "C6", act_name: "Consultation de contrôle", act_price: 1000 },

  // SOINS INFIRMIERS
  { act_id: "I1", act_name: "Injection intramusculaire (IM)", act_price: 300 },
  { act_id: "I2", act_name: "Injection intraveineuse (IV)", act_price: 500 },
  { act_id: "I3", act_name: "Pansement simple", act_price: 800 },
  { act_id: "I4", act_name: "Pansement complexe / Brûlure", act_price: 1500 },
  { act_id: "I5", act_name: "Prélèvement sanguin", act_price: 400 },
  { act_id: "I6", act_name: "Ablation de fils / agrafes", act_price: 1000 },
  { act_id: "I7", act_name: "Pose de perfusion", act_price: 2000 },
  { act_id: "I8", act_name: "Lavage d'oreille", act_price: 1200 },
  { act_id: "I9", act_name: "Sondage urinaire", act_price: 2500 },
  { act_id: "I10", act_name: "Nébulisation / Aérosol", act_price: 1000 },

  // ANALYSES DE SANG (BIOLOGIE)
  {
    act_id: "B1",
    act_name: "FNS (Numération Formule Sanguine)",
    act_price: 1200,
  },
  { act_id: "B2", act_name: "Glycémie à jeun", act_price: 400 },
  { act_id: "B3", act_name: "Urée / Créatinine", act_price: 1000 },
  {
    act_id: "B4",
    act_name: "Bilan Lipidique (Cholestérol/Trigly)",
    act_price: 1800,
  },
  { act_id: "B5", act_name: "ASAT / ALAT (Bilan hépatique)", act_price: 1400 },
  { act_id: "B6", act_name: "Vitesse de sédimentation (VS)", act_price: 500 },
  { act_id: "B7", act_name: "CRP (Protéine C Réactive)", act_price: 1500 },
  { act_id: "B8", act_name: "Hémoglobine Glyquée (HbA1c)", act_price: 2000 },
  { act_id: "B9", act_name: "Groupage sanguin (ABO/Rh)", act_price: 800 },
  { act_id: "B10", act_name: "TP / INR", act_price: 1200 },
  { act_id: "B11", act_name: "ECBU (Urine)", act_price: 1500 },
  { act_id: "B12", act_name: "Test de grossesse (HCG)", act_price: 1000 },
  { act_id: "B13", act_name: "TSH (Thyroïde)", act_price: 2200 },
  { act_id: "B14", act_name: "Vitamine D", act_price: 4500 },
  { act_id: "B15", act_name: "Ferritine", act_price: 2500 },
  { act_id: "B16", act_name: "Calcium / Magnésium", act_price: 1200 },
  { act_id: "B17", act_name: "Acide Urique", act_price: 800 },
  { act_id: "B18", act_name: "PSA (Prostate)", act_price: 2800 },
  { act_id: "B19", act_name: "Hépatite B (HBs)", act_price: 1800 },
  { act_id: "B20", act_name: "Sérologie VIH", act_price: 2000 },

  // RADIOLOGIE & IMAGERIE
  { act_id: "R1", act_name: "Radiographie Thorax face", act_price: 2500 },
  { act_id: "R2", act_name: "Radiographie ASP (Abdomen)", act_price: 2800 },
  { act_id: "R3", act_name: "Radiographie Rachis Cervical", act_price: 3000 },
  { act_id: "R4", act_name: "Radiographie Rachis Lombaire", act_price: 3500 },
  {
    act_id: "R5",
    act_name: "Radiographie Genou (Face/Profil)",
    act_price: 2500,
  },
  { act_id: "R6", act_name: "Échographie Abdominale", act_price: 4000 },
  { act_id: "R7", act_name: "Échographie Pelvienne", act_price: 3500 },
  { act_id: "R8", act_name: "Échographie Rénale", act_price: 3000 },
  { act_id: "R9", act_name: "Échographie Thyroïdienne", act_price: 3200 },
  { act_id: "R10", act_name: "Échographie Mammaire", act_price: 4500 },
  { act_id: "R11", act_name: "Mammographie bilatérale", act_price: 6000 },
  {
    act_id: "R12",
    act_name: "Scanner Cérébral (sans injection)",
    act_price: 8000,
  },
  {
    act_id: "R13",
    act_name: "Scanner Cérébral (avec injection)",
    act_price: 12000,
  },
  { act_id: "R14", act_name: "Scanner Abdomino-pelvien", act_price: 15000 },
  { act_id: "R15", act_name: "IRM Cérébrale", act_price: 22000 },
  { act_id: "R16", act_name: "IRM Rachidienne", act_price: 20000 },
  { act_id: "R17", act_name: "Panoramique dentaire", act_price: 2500 },
  {
    act_id: "R18",
    act_name: "Écho-Doppler des membres inférieurs",
    act_price: 6500,
  },
  { act_id: "R19", act_name: "Ostéodensitométrie", act_price: 5500 },
  { act_id: "R20", act_name: "Hystérosalpingographie", act_price: 8500 },

  // CARDIOLOGIE
  { act_id: "CAR1", act_name: "Électrocardiogramme (ECG)", act_price: 1500 },
  { act_id: "CAR2", act_name: "Échographie Cardiaque", act_price: 6000 },
  { act_id: "CAR3", act_name: "Épreuve d'effort", act_price: 8000 },
  { act_id: "CAR4", act_name: "Holter Rythmique (24h)", act_price: 7000 },
  { act_id: "CAR5", act_name: "MAPA (Holter tensionnel)", act_price: 5000 },

  // OPHTALMOLOGIE
  { act_id: "OPH1", act_name: "Examen du fond d'œil", act_price: 2500 },
  {
    act_id: "OPH2",
    act_name: "Mesure de la tension oculaire",
    act_price: 1500,
  },
  { act_id: "OPH3", act_name: "Champ visuel", act_price: 4000 },
  {
    act_id: "OPH4",
    act_name: "OCT (Tomographie cohérence optique)",
    act_price: 8000,
  },
  {
    act_id: "OPH5",
    act_name: "Extraction corps étranger conjonctival",
    act_price: 3000,
  },

  // GYNÉCOLOGIE & OBSTÉTRIQUE
  { act_id: "GYN1", act_name: "Frottis cervico-vaginal", act_price: 3000 },
  { act_id: "GYN2", act_name: "Pose de stérilet", act_price: 5000 },
  { act_id: "GYN3", act_name: "Échographie obstétricale T1", act_price: 4500 },
  {
    act_id: "GYN4",
    act_name: "Échographie obstétricale T2 (Morpho)",
    act_price: 7000,
  },
  { act_id: "GYN5", act_name: "Échographie obstétricale T3", act_price: 5000 },
  { act_id: "GYN6", act_name: "Monitoring fœtal", act_price: 3000 },

  // DERMATOLOGIE / PETITE CHIRURGIE
  { act_id: "DER1", act_name: "Suture plaie simple (< 5 cm)", act_price: 2500 },
  { act_id: "DER2", act_name: "Suture plaie complexe", act_price: 4500 },
  { act_id: "DER3", act_name: "Exérèse petit kyste sébacé", act_price: 6000 },
  {
    act_id: "DER4",
    act_name: "Cryothérapie verrue (la séance)",
    act_price: 1500,
  },
  { act_id: "DER5", act_name: "Biopsie cutanée", act_price: 4000 },
  { act_id: "DER6", act_name: "Incision d'abcès", act_price: 3500 },
  { act_id: "DER7", act_name: "Ablation ongle incarné", act_price: 5500 },

  // ORL / STOMATOLOGIE
  { act_id: "ORL1", act_name: "Audiogramme", act_price: 3500 },
  { act_id: "ORL2", act_name: "Fibroscopie laryngée", act_price: 5000 },
  {
    act_id: "ORL3",
    act_name: "Extraction bouchon de cérumen",
    act_price: 1500,
  },
  { act_id: "STO1", act_name: "Extraction dentaire simple", act_price: 3000 },
  { act_id: "STO2", act_name: "Détartrage complet", act_price: 4500 },
  { act_id: "STO3", act_name: "Obturation composite (Carie)", act_price: 4000 },

  // PÉDIATRIE
  { act_id: "PED1", act_name: "Suivi nourrisson", act_price: 2000 },
  { act_id: "PED2", act_name: "Vaccination (acte seul)", act_price: 500 },
  { act_id: "PED3", act_name: "Test de Guthrie", act_price: 3000 },

  // AUTRES SPÉCIALITÉS
  { act_id: "GAS1", act_name: "Fibroscopie Gastrique", act_price: 9000 },
  { act_id: "GAS2", act_name: "Coloscopie", act_price: 18000 },
  { act_id: "PNE1", act_name: "Spirométrie", act_price: 4000 },
  { act_id: "RHU1", act_name: "Infiltration articulation", act_price: 3500 },
  { act_id: "RHU2", act_name: "Ponction articulaire", act_price: 4000 },
  {
    act_id: "KIN1",
    act_name: "Séance Rééducation (Kinésithérapie)",
    act_price: 1500,
  },
  { act_id: "PSY1", act_name: "Séance Psychothérapie", act_price: 3000 },

  // RÉÉDUCATION & APPAREILLAGE
  { act_id: "REA1", act_name: "Bilan orthophonique", act_price: 4000 },
  { act_id: "REA2", act_name: "Séance d'orthophonie", act_price: 2000 },
  { act_id: "REA3", act_name: "Bilan orthoptique", act_price: 3500 },
];
export default allActs;
