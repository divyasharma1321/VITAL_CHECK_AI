
(function () {

    var BACKEND = "http://localhost:5000";
    var history = [];

    
    var KB = [
        { kw:["hello","hi","hey","hii","start","help"], reply:"👋 Hi! I'm Vita, your supplement advisor.\n\nAsk me about vitamins, minerals, health conditions, or supplement safety. How can I help?" },
        { kw:["thank","thanks","thankyou","thank you"],  reply:"😊 You're welcome! Stay consistent and stay healthy!" },
        { kw:["bye","goodbye","see you"],                reply:"👋 Take care! Come back anytime. 🌱" },
        { kw:["vitamin c","vit c"],       reply:"Vitamin C 🍊\n\n• Boosts immune system\n• Powerful antioxidant\n• Helps absorb iron\n• Supports skin health\n\nDose: 500–1000 mg/day with meals." },
        { kw:["vitamin d","vit d","sunshine"], reply:"Vitamin D ☀️\n\n• Strengthens bones\n• Boosts immunity\n• Improves mood\n\nMost people are deficient.\nDose: 1000–2000 IU/day with a fatty meal." },
        { kw:["vitamin b12","b12"],        reply:"Vitamin B12 ⚡\n\n• Energy production\n• Nerve health\n• Red blood cell formation\n\nEssential for vegans.\nDose: 500–1000 mcg/day." },
        { kw:["vitamin e","vit e"],        reply:"Vitamin E 🌻\n\n• Antioxidant protection\n• Skin health\n• Immune support\n\nDose: 15 mg/day with food." },
        { kw:["zinc"],                     reply:"Zinc 🛡️\n\n• Immune defence\n• Wound healing\n• Acne control\n\nDose: 8–11 mg/day with food." },
        { kw:["magnesium"],                reply:"Magnesium 🌙\n\n• Muscle relaxation\n• Better sleep\n• Reduces anxiety\n\nBest form for sleep: Glycinate.\nDose: 200–400 mg/day before bed." },
        { kw:["iron"],                     reply:"Iron 🩸\n\n• Makes haemoglobin\n• Prevents anaemia\n• Boosts energy\n\nTake with Vitamin C.\nAvoid tea/coffee with iron tablets." },
        { kw:["calcium"],                  reply:"Calcium 🦷\n\n• Strong bones and teeth\n• Nerve and muscle function\n\nAlways pair with Vitamin D3.\nAdults need ~1000 mg/day." },
        { kw:["omega","fish oil","algae","flaxseed"], reply:"Omega-3 🐟\n\n• Reduces inflammation\n• Heart and brain health\n• Lowers triglycerides\n\nSeafood allergy? Use Algae-based Omega-3.\nDose: 1000–2000 mg/day with meals." },
        { kw:["probiotics","probiotic","gut"], reply:"Probiotics 🦠\n\n• Restores healthy gut bacteria\n• Boosts immunity\n• Reduces bloating\n\nLook for Lactobacillus and Bifidobacterium strains." },
        { kw:["collagen"],                 reply:"Collagen ✨\n\n• Skin elasticity\n• Joint cartilage\n• Hair and nail strength\n\nAlways take with Vitamin C for best results." },
        { kw:["biotin"],                   reply:"Biotin 💇\n\n• Hair growth\n• Nail strength\n• Skin health\n\nDose: 2500–5000 mcg/day.\nResults take 3–6 months." },
        { kw:["creatine"],                 reply:"Creatine 💪\n\n• Increases strength\n• Speeds recovery\n• Safe for healthy adults\n\nDose: 3–5 g/day. No loading phase needed." },
        { kw:["ashwagandha"],              reply:"Ashwagandha 🌿\n\n• Reduces stress and cortisol\n• Improves sleep\n• Supports energy\n\nDose: 300–600 mg/day for 4–8 weeks." },
        { kw:["turmeric","curcumin"],      reply:"Turmeric 🟡\n\n• Anti-inflammatory\n• Relieves joint pain\n• Supports digestion\n\n⭐ Always take with black pepper — increases absorption by 2000%!" },
        { kw:["melatonin"],                reply:"Melatonin 😴\n\n• Regulates sleep cycles\n• Helps with jet lag\n\nStart low: 0.5–1 mg, 30 min before bed." },
        { kw:["coq10","coenzyme"],         reply:"CoQ10 ❤️\n\n• Heart energy\n• Cellular energy production\n• Important if on statins\n\nDose: 100–300 mg/day with food." },
        { kw:["immunity","immune","cold","flu","sick"], reply:"Immune Support 🛡️\n\nTop supplements:\n• Vitamin C – 500–1000 mg/day\n• Vitamin D3 – 1000–2000 IU/day\n• Zinc – 8–11 mg/day\n• Elderberry Extract\n• Probiotics\n\nAlso: 7–9 hrs sleep and stay hydrated!" },
        { kw:["energy","fatigue","tired","exhausted"], reply:"Energy & Fatigue ⚡\n\nTop supplements:\n• Vitamin B12 – energy production\n• Iron – if deficient\n• Magnesium – muscle function\n• CoQ10 – mitochondrial energy\n• Ashwagandha – adrenal support" },
        { kw:["skin","acne","glow","hair","nails"], reply:"Skin & Hair ✨\n\nTop supplements:\n• Collagen – skin elasticity\n• Biotin – hair and nails\n• Vitamin E – antioxidant\n• Zinc – acne control\n• Omega-3 – skin hydration" },
        { kw:["fitness","muscle","gym","workout","sport"], reply:"Fitness & Muscle 💪\n\nTop supplements:\n• Creatine – strength and power\n• Protein Powder – muscle repair\n• BCAAs – recovery\n• Magnesium – muscle relaxation\n• Omega-3 – reduces inflammation" },
        { kw:["diabetes","blood sugar","glucose"], reply:"Diabetes Support 🩺\n\n• Magnesium – insulin sensitivity\n• Chromium – glucose metabolism\n• Vitamin D – insulin function\n• Berberine – natural glucose regulator\n\n⚠️ Never replace diabetes medication." },
        { kw:["arthritis","joint","joint pain","inflammation"], reply:"Arthritis & Joints 🦴\n\n• Omega-3 – anti-inflammatory\n• Turmeric + Black Pepper – pain relief\n• Glucosamine & Chondroitin – cartilage\n• Vitamin D – bone health\n• Collagen Type II" },
        { kw:["thyroid"],                  reply:"Thyroid Support 🦋\n\n• Selenium – hormone conversion\n• Zinc – T3/T4 balance\n• Vitamin D\n• B-Complex\n\n⚠️ Always work with your doctor." },
        { kw:["pcos","hormones","hormone"], reply:"PCOS & Hormones 🌸\n\n• Inositol – insulin sensitivity\n• Magnesium – cortisol reduction\n• Vitamin D – hormone regulation\n• Zinc – androgen balance\n• Omega-3 – inflammation" },
        { kw:["anxiety","stress","nervous"], reply:"Anxiety & Stress 🧘\n\n• Ashwagandha – lowers cortisol\n• Magnesium Glycinate – calming\n• L-Theanine – calm focus\n• Vitamin B Complex\n• Omega-3 – brain health" },
        { kw:["sleep","insomnia","cant sleep","poor sleep"], reply:"Sleep Support 😴\n\n• Magnesium Glycinate – relaxation\n• Melatonin 0.5–1 mg – 30 min before bed\n• Ashwagandha – reduces pre-sleep stress\n• L-Theanine – calm\n\nAvoid caffeine after 2pm." },
        { kw:["digestion","bloating","gut health","constipation","ibs"], reply:"Gut & Digestion 🌿\n\n• Probiotics – good bacteria\n• Digestive Enzymes – nutrient breakdown\n• Psyllium Husk – natural fibre\n• Ginger Extract – bloating\n• Glutamine – gut lining repair" },
        { kw:["heart","cholesterol","cardiovascular"], reply:"Heart Health ❤️\n\n• Omega-3 – lowers triglycerides\n• CoQ10 – heart energy\n• Vitamin K2 – arterial health\n• Magnesium – blood pressure\n\n⚠️ Always work with your doctor." },
        { kw:["hypertension","blood pressure","high bp"], reply:"Blood Pressure 💓\n\n• Magnesium – vasodilation\n• Potassium – sodium balance\n• CoQ10 – heart function\n• Omega-3 – arterial inflammation\n\n⚠️ Medical supervision required." },
        { kw:["anaemia","anemia","low iron"], reply:"Anaemia 🩸\n\n• Iron (Ferrous Bisglycinate – gentlest form)\n• Vitamin C – boosts iron absorption\n• Vitamin B12\n• Folic Acid\n\nEat: lentils, spinach, red meat." },
        { kw:["vegan","vegetarian","plant based"], reply:"Vegan Supplements 🌱\n\n• Vitamin B12 – essential, not in plants\n• Vitamin D3 (lichen-based)\n• Omega-3 (algae-based)\n• Iron – take with Vitamin C\n• Zinc, Calcium, Iodine" },
        { kw:["allergy","allergic","seafood allergy","dairy allergy"], reply:"Allergy Conflicts 🚨\n\n• Seafood → Algae Omega-3, Vegan Glucosamine\n• Dairy → avoid Whey protein\n• Pollen/Herb → avoid Turmeric, Quercetin\n\nAlways read ingredient labels!" },
        { kw:["safe","side effect","dangerous","overdose"], reply:"Supplement Safety ⚠️\n\n• More is NOT always better\n• Fat-soluble vitamins (A,D,E,K) accumulate\n• Always follow recommended doses\n• Consult doctor if pregnant or on medication\n\nVitalCheck is educational, not medical advice." },
    ];

    var FALLBACK_REPLY = "🤔 I'm not sure about that. Try asking:\n• 'What helps with arthritis?'\n• 'Supplements for immunity'\n• 'How does Vitamin D help?'\n\nI'm here to help!";

    function getLocalReply(msg) {
        msg = msg.toLowerCase().replace(/[^\w\s]/g, " ");
        for (var i = 0; i < KB.length; i++)
            for (var j = 0; j < KB[i].kw.length; j++)
                if (msg.indexOf(KB[i].kw[j]) !== -1) return KB[i].reply;
        return FALLBACK_REPLY;
    }

    
    document.body.insertAdjacentHTML("beforeend", `
        <button id="vitaFab" aria-label="Open Vita chatbot">💊<span id="vitaBadge"></span></button>
        <div id="vitaChat" role="dialog">
            <div class="vc-header">
                <div class="vc-header-left">
                    <div class="vc-avatar-wrap">
                        <div class="vc-avatar">✢</div>
                        <div class="vc-online-dot"></div>
                    </div>
                    <div>
                        <div class="vc-name">Vita</div>
                        <div class="vc-status" id="vitaStatus">Supplement Assistant · Online</div>
                    </div>
                </div>
                <div class="vc-header-actions">
                    <button class="vc-clear" id="vitaClear" title="Clear">🗑</button>
                    <button class="vc-close" id="vitaClose">✕</button>
                </div>
            </div>
            <div class="vc-messages" id="vitaMsgs"></div>
            <div class="vc-input-area">
                <textarea id="vitaInput" placeholder="Ask me anything about supplements…" rows="1" maxlength="500"></textarea>
                <button id="vitaSend">➤</button>
            </div>
            <div class="vc-chips">
                <button class="vc-chip" data-q="What supplements help with immunity?">🛡️ Immunity</button>
                <button class="vc-chip" data-q="Best supplements for joint pain?">🦴 Joints</button>
                <button class="vc-chip" data-q="What helps with energy and fatigue?">⚡ Energy</button>
                <button class="vc-chip" data-q="How does Vitamin D help the body?">☀️ Vitamin D</button>
                <button class="vc-chip" data-q="What supplements improve sleep?">😴 Sleep</button>
                <button class="vc-chip" data-q="Best supplements for skin and hair?">✨ Skin</button>
            </div>
        </div>
    `);

    var fab      = document.getElementById("vitaFab");
    var chat     = document.getElementById("vitaChat");
    var closeBtn = document.getElementById("vitaClose");
    var clearBtn = document.getElementById("vitaClear");
    var msgs     = document.getElementById("vitaMsgs");
    var input    = document.getElementById("vitaInput");
    var sendBtn  = document.getElementById("vitaSend");
    var statusEl = document.getElementById("vitaStatus");
    var chips    = document.querySelectorAll(".vc-chip");
    var greeted  = false;

    fab.addEventListener("click", function () {
        chat.classList.add("vc-open");
        document.getElementById("vitaBadge").style.display = "none";
        input.focus();
        if (!greeted) {
            addBot("👋 Hi! I'm Vita, your supplement advisor.\n\nAsk me about vitamins, minerals, health conditions, or supplement safety. How can I help?");
            greeted = true;
        }
    });

    closeBtn.addEventListener("click", function () { chat.classList.remove("vc-open"); });

    clearBtn.addEventListener("click", function () {
        msgs.innerHTML = "";
        history = [];
        greeted = false;
        addBot("Chat cleared! Ask me anything about supplements. 💊");
        greeted = true;
    });

    for (var c = 0; c < chips.length; c++) {
        (function (chip) {
            chip.addEventListener("click", function () { sendMsg(chip.getAttribute("data-q")); });
        })(chips[c]);
    }

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(input.value); }
    });

    input.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 100) + "px";
    });

    sendBtn.addEventListener("click", function () { sendMsg(input.value); });

    async function sendMsg(text) {
        text = (text || "").trim();
        if (!text) return;

        addUser(text);
        history.push({ role: "user", content: text });
        input.value = "";
        input.style.height = "auto";

        var tid = showTyping();

        try {
           
            var r = await fetch(BACKEND + "/chat", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ message: text, history: history.slice(-8) })
            });
            var d = await r.json();
            removeTyping(tid);
            var reply = d.reply || getLocalReply(text);
            addBot(reply);
            history.push({ role: "assistant", content: reply });
        } catch (err) {
            // Backend unavailable — use local knowledge base
            removeTyping(tid);
            var localReply = getLocalReply(text);
            addBot(localReply);
            history.push({ role: "assistant", content: localReply });
        }

        if (history.length > 20) history = history.slice(-20);
    }

    function addUser(t) { msgs.appendChild(mkBubble("user", t)); scroll(); }
    function addBot(t)  { msgs.appendChild(mkBubble("bot",  t)); scroll(); }

    function mkBubble(role, text) {
        var w = document.createElement("div"); w.className = "vc-msg " + role;
        var b = document.createElement("div"); b.className = "vc-bubble"; b.textContent = text;
        var t = document.createElement("div"); t.className = "vc-time";
        t.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        w.appendChild(b); w.appendChild(t);
        return w;
    }

    function showTyping() {
        var id = "vt" + Date.now();
        var w  = document.createElement("div");
        w.className = "vc-msg bot vc-typing"; w.id = id;
        w.innerHTML = '<div class="vc-bubble"><div class="vc-dot"></div><div class="vc-dot"></div><div class="vc-dot"></div></div>';
        msgs.appendChild(w); scroll(); return id;
    }

    function removeTyping(id) { var el = document.getElementById(id); if (el) el.remove(); }
    function scroll() { msgs.scrollTop = msgs.scrollHeight; }

})();
