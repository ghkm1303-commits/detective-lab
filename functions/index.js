const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize Anthropic with API key from environment
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// CORS middleware
const cors = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
};

// PROMPT TEMPLATES
const PROMPTS = {
  pharmacology: `Generate 5 NEW unique drugs for pharmacology students. Make them REALISTIC and DIFFERENT.

For EACH drug, provide EXACTLY this JSON format (no markdown, ONLY JSON):

{
  "names": {"en": "Drug Name", "fr": "Nom Français"},
  "class": "Drug Class",
  "therapeuticClass": "Therapeutic Class",
  "category": "Category",
  "subcategory": "Subcategory",
  "mechanism": "Mechanism of action",
  "effects": ["Effect 1", "Effect 2"],
  "indications": "Indications",
  "route": "Route",
  "sideEffects": ["Side effect 1"],
  "contraindications": ["Contraindication 1"],
  "metabolism": "Metabolism",
  "elimination": "Elimination",
  "halfLife": "Half-life",
  "proteinBinding": "90%",
  "bioavailability": "80%",
  "absorption": "Well absorbed",
  "distribution": "Wide distribution",
  "dosing": {"standard": "10mg", "maxDose": "50mg", "frequency": "Daily"},
  "onsetOfAction": "1-2 hours",
  "durationOfAction": "12 hours",
  "fdaApproval": "2020",
  "clinicalPearls": ["Pearl 1"]
}

Return ONLY valid JSON array: [{...}, {...}]
NO markdown backticks
NO explanations`,

  pharmacognosy: `Generate 5 NEW medicinal plants for pharmacognosy.

For EACH plant, provide EXACTLY this JSON format:

{
  "names": {"en": "Plant Name", "fr": "Nom Français"},
  "class": "Plant Type",
  "therapeuticClass": "Therapeutic Use",
  "category": "Category",
  "subcategory": "Subcategory",
  "mechanism": "Active compounds",
  "effects": ["Effect 1"],
  "indications": "Uses",
  "route": "Preparation",
  "sideEffects": ["Side effect"],
  "contraindications": ["Contraindication"],
  "metabolism": "Metabolism",
  "elimination": "Elimination",
  "halfLife": "Duration",
  "proteinBinding": "N/A",
  "bioavailability": "Variable",
  "absorption": "Absorption",
  "distribution": "Distribution",
  "dosing": {"standard": "Standard", "maxDose": "Max", "frequency": "Frequency"},
  "onsetOfAction": "Onset",
  "durationOfAction": "Duration",
  "fdaApproval": "Status",
  "clinicalPearls": ["Pearl"]
}

Return ONLY JSON array
NO markdown
NO explanations`,

  parasitology: `Generate 5 NEW parasites for parasitology.

For EACH parasite, provide EXACTLY this JSON format:

{
  "names": {"en": "Parasite", "fr": "Nom"},
  "class": "Type",
  "therapeuticClass": "Disease",
  "category": "Category",
  "subcategory": "Subcategory",
  "mechanism": "Pathogenesis",
  "effects": ["Symptom 1"],
  "indications": "Diseases",
  "route": "Transmission",
  "sideEffects": ["Complication"],
  "contraindications": ["Contraindication"],
  "metabolism": "Survival",
  "elimination": "Clearance",
  "halfLife": "Lifecycle",
  "proteinBinding": "Host interaction",
  "bioavailability": "Infectivity",
  "absorption": "Entry",
  "distribution": "Organs",
  "dosing": {"standard": "Treatment", "maxDose": "Duration", "frequency": "Frequency"},
  "onsetOfAction": "Incubation",
  "durationOfAction": "Duration",
  "fdaApproval": "Approval",
  "clinicalPearls": ["Pearl"]
}

Return ONLY JSON array
NO markdown
NO explanations`
};

// Generate drugs function
async function generateDrugsForSpecialty(specialty, count = 5) {
  try {
    console.log(`Generating ${count} ${specialty} items...`);

    const prompt = PROMPTS[specialty];
    if (!prompt) {
      throw new Error(`Unknown specialty: ${specialty}`);
    }

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;
    console.log("Response:", responseText);

    const drugs = JSON.parse(responseText);

    if (!Array.isArray(drugs)) {
      throw new Error("Response is not an array");
    }

    console.log(`Parsed ${drugs.length} items`);

    const collectionRef = db.collection(specialty);
    const snapshot = await collectionRef.orderBy('id', 'desc').limit(1).get();
    let nextId = snapshot.empty ? 1 : snapshot.docs[0].data().id + 1;

    const batch = db.batch();
    drugs.forEach((drug) => {
      const docRef = collectionRef.doc(
        drug.names.en.replace(/\s+/g, '_').toLowerCase()
      );
      batch.set(docRef, {
        id: nextId,
        ...drug,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        specialty: specialty
      });
      nextId++;
    });

    await batch.commit();

    console.log(`✅ Saved ${drugs.length} ${specialty} items`);

    return {
      success: true,
      specialty: specialty,
      count: drugs.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// HTTP TRIGGER with CORS
exports.generateDrugsHTTP = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const apiKey = req.query.apiKey || req.body.apiKey;
    const ADMIN_API_KEY = 'test-key-local';

    if (apiKey !== ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
      const { specialty, count } = req.query;

      if (!specialty) {
        return res.status(400).json({ error: 'Missing specialty' });
      }

      const result = await generateDrugsForSpecialty(specialty, parseInt(count) || 5);
      return res.json(result);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  });
});

// GET LOGS with CORS
exports.getGenerationLogs = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const apiKey = req.query.apiKey || req.body.apiKey;
    const ADMIN_API_KEY = 'test-key-local';

    if (apiKey !== ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
      const snapshot = await db
        .collection('generation_logs')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();

      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()
      }));

      return res.json(logs);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
});