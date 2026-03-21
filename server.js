

require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const https   = require("https");

const API_KEY = process.env.OPENROUTER_API_KEY || "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"; // <-- EDIT THIS LINE ONLY

const app  = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(__dirname));

const cache = {};


const MODELS = [
    "stepfun/step-3.5-flash:free",
    "z-ai/glm-4.5-air:free",
    "arcee-ai/trinity-large-preview:free",
    "arcee-ai/trinity-mini:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "nvidia/nemotron-nano-12b-v2-vl:free"
];

function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

function callModel(model, prompt) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
            temperature: 0.4
        });
        const req = https.request({
            hostname: "openrouter.ai",
            path:     "/api/v1/chat/completions",
            method:   "POST",
            headers:  {
                "Content-Type":   "application/json",
                "Authorization":  `Bearer ${API_KEY}`,
                "HTTP-Referer":   "http://localhost:5000",
                "X-Title":        "VitalCheck",
                "Content-Length": Buffer.byteLength(body)
            }
        }, (res) => {
            let data = "";
            res.on("data", c => data += c);
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.error) { reject(new Error(parsed.error.message)); return; }
                    const text = parsed?.choices?.[0]?.message?.content;
                    if (text) resolve(text);
                    else reject(new Error("Empty"));
                } catch (e) { reject(e); }
            });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

async function callAI(prompt) {
    for (const model of shuffle(MODELS)) {
        try {
            const text = await callModel(model, prompt);
            console.log(`✅ Model: ${model.split("/")[1]}`);
            return text;
        } catch (e) {
            console.log(`⚠️  ${model.split("/")[1]}: ${e.message.substring(0, 50)}`);
        }
    }
    return null;
}

function getFallback({ ageRange = "25-34", diseases = [], allergies = [] }) {
    const al        = allergies.map(a => a.toLowerCase());
    const noSeafood = al.includes("seafood");
    const noHerbs   = al.includes("pollen") || al.includes("dust");

    const recs = [
        { name: "Vitamin D3",          category: "Immunity & Bone Health",  why: `Essential for immune function and calcium absorption. Particularly important for the ${ageRange} age group.`, dosage: "1000–2000 IU daily", timing: "With a fatty meal", warning: "Do not exceed 4000 IU/day without blood tests." },
        { name: noSeafood ? "Omega-3 (Algae Oil)" : "Omega-3 (Fish Oil)", category: "Heart & Brain Health", why: noSeafood ? "Plant-based DHA/EPA — safe for seafood allergies with identical cardiovascular benefits." : "Reduces systemic inflammation and supports cardiovascular and cognitive health.", dosage: "1000–2000 mg daily", timing: "With meals", warning: noSeafood ? "None — safe for seafood allergy." : "Consult doctor if on anticoagulants." },
        { name: "Magnesium Glycinate", category: "Sleep & Muscle Function", why: "Most bioavailable magnesium form. Promotes deep sleep, reduces anxiety, and relaxes muscle tension.", dosage: "200–400 mg daily", timing: "30–60 minutes before bed", warning: "High doses may cause loose stools." },
        { name: "Vitamin B Complex",   category: "Energy & Nerve Health",   why: "All 8 B vitamins convert food into energy and maintain healthy nerve function.", dosage: "1 tablet daily", timing: "With breakfast", warning: "Bright yellow urine from B2 is normal." }
    ];

    if (diseases.includes("Diabetes"))       recs.push({ name: "Berberine",                  category: "Blood Sugar",           why: "Clinically proven to activate AMPK pathway, improving insulin sensitivity and lowering fasting blood glucose.", dosage: "500 mg 2–3x daily", timing: "Before meals", warning: "Consult doctor if on diabetes medication." });
    if (diseases.includes("Hypertension") || diseases.includes("Heart Disease")) recs.push({ name: "CoQ10", category: "Cardiovascular Health", why: "Powers mitochondria in heart muscle cells and helps maintain healthy blood pressure levels.", dosage: "100–200 mg daily", timing: "With a fatty meal", warning: "May interact with warfarin." });
    if (diseases.includes("Arthritis") && !noHerbs) recs.push({ name: "Turmeric + Black Pepper", category: "Anti-Inflammatory", why: "Curcumin inhibits NF-kB inflammation in joints. Black pepper boosts absorption by 2000%.", dosage: "500–1000 mg curcumin daily", timing: "With meals", warning: "Avoid with pollen or dust allergy." });
    if (diseases.includes("Thyroid"))        recs.push({ name: "Selenium",                    category: "Thyroid Support",       why: "Essential cofactor for converting inactive T4 into active T3 thyroid hormone.", dosage: "100–200 mcg daily", timing: "With meals", warning: "Do not exceed 400 mcg/day." });
    if (diseases.includes("Asthma"))         recs.push({ name: "Vitamin C",                   category: "Respiratory Health",    why: "Reduces oxidative stress and airway inflammation, helping manage asthma symptoms effectively.", dosage: "500–1000 mg daily", timing: "With meals", warning: "Above 2000 mg/day may cause digestive upset." });
    if (diseases.includes("Anaemia") || diseases.includes("Anemia")) recs.push({ name: "Iron (Ferrous Bisglycinate)", category: "Blood Health", why: "Gentlest iron form for haemoglobin production with minimal gastrointestinal side effects.", dosage: "18–27 mg daily", timing: "Empty stomach with Vitamin C", warning: "Only use if blood test confirms deficiency." });
    if (diseases.includes("PCOS"))           recs.push({ name: "Inositol (Myo)", category: "Hormonal Health", why: "Improves insulin signalling and restores hormonal balance in PCOS.", dosage: "2g daily", timing: "With meals", warning: "Consult doctor before use." });

    return recs;
}

app.post("/recommend", async (req, res) => {
    const { name="User", ageRange="25-34", gender="Not specified", diseases=[], allergies=[] } = req.body;
    console.log(`\n📋 ${name} | ${ageRange} | ${gender} | ${diseases.join(",")||"none"} | ${allergies.join(",")||"none"}`);

    const cacheKey = [ageRange, gender, ...diseases.sort(), ...allergies.sort()].join("|");

    if (cache[cacheKey]) {
        console.log("⚡ Returning cached response");
        return res.json({ recommendations: cache[cacheKey], source: "ai" });
    }

    const prompt = `You are a clinical nutritionist. Return supplement recommendations as JSON only.
Patient: Age ${ageRange}, ${gender}
Conditions: ${diseases.length ? diseases.join(", ") : "None"}
Allergies: ${allergies.length ? allergies.join(", ") : "None"}
Rules: Seafood allergy = algae omega-3 only. Milk allergy = no whey. Pollen/dust = no turmeric. Include one supplement per condition. 5-6 total.
Return ONLY: {"recommendations":[{"name":"","category":"","why":"","dosage":"","timing":"","warning":""}]}`;

    console.log("🤖 Calling AI...");
    const raw = await callAI(prompt);

    if (raw) {
        try {
            const cleaned = raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
            const start   = cleaned.indexOf("{");
            const end     = cleaned.lastIndexOf("}");
            if (start === -1 || end === -1) throw new Error("No JSON");
            const parsed  = JSON.parse(cleaned.substring(start, end + 1));
            console.log(`✅ AI returned ${parsed.recommendations.length} recommendations`);
            cache[cacheKey] = parsed.recommendations;
            return res.json({ recommendations: parsed.recommendations, source: "ai" });
        } catch (e) {
            console.log("⚠️  JSON parse failed");
        }
    }

    console.log("📦 Using smart fallback");
    const fallback = getFallback({ ageRange, diseases, allergies });
    cache[cacheKey] = fallback;
    res.json({ recommendations: fallback, source: "fallback" });
});

app.get("/health", (_, res) => res.json({ status: "ok", port: PORT }));

app.listen(PORT, () => {
    console.log(`\n✢  VitalCheck running → http://localhost:${PORT}/homepage.html`);
    console.log(API_KEY && API_KEY !== "PASTE_YOUR_NEW_KEY_HERE"
        ? "✅  API key loaded\n"
        : "⚠️  Add your OpenRouter key on line 12\n");
});