(function () {
  const sectionEl = document.getElementById("clime-quiz-section");
  const root = document.getElementById("cq-content");
  const nextBtn = document.getElementById("cq-next");
  const actionsEl = document.getElementById("cq-actions");
  const progressFill = document.getElementById("cq-progress-fill");
  const cardEl = sectionEl ? sectionEl.querySelector(".cq-card") : null;

  if (!sectionEl || !root || !nextBtn || !cardEl) return;

    /* ===== QUESTIONS & FLOW ===== */

    const QUESTIONS = [
      {
        id: "q1",
        text: "How do your energy levels usually feel throughout the day?",
        options: [
          { label: "Slow mornings", scoring: {} },
          { label: "Strong start but I crash midday", scoring: {} },
          { label: "Mostly steady with unpredictable dips", scoring: {} },
          { label: "Ok, but I sometimes need a boost", scoring: {} },
        ],
      },
      {
        id: "q2",
        text: "When do you usually feel your energy drop?",
        options: [
          { label: "First 1–2 hours after waking", scoring: {} },
          { label: "Early afternoon (1–5 p.m.)", scoring: {} },
          { label: "Late evenings / long shifts / travel", scoring: {} },
          { label: "It doesn’t drop — I just want better performance", scoring: {} },
        ],
      },
      {
        id: "q3",
        text: "How does caffeine usually make you feel?",
        options: [
          {
            label: "Jittery or anxious, then tired",
            scoring: { caffeine: -2, balance: 2 },
          },
          {
            label: "Awake but unfocused",
            scoring: { focus: 2, balance: 1 },
          },
          {
            label: "Alert and steady",
            scoring: { caffeine: 2, focus: 1 },
          },
          {
            label: "I barely feel it. I think I’m tolerant",
            scoring: { caffeine: 3 },
          },
        ],
      },
      {
        id: "q4",
        text: "How consistent is your sleep schedule over a typical week?",
        options: [
          {
            label: "All over the place — bedtime and wake time shift a lot",
            scoring: { balance: 1 },
          },
          {
            label: "Fairly consistent, but I don’t always feel rested",
            scoring: {},
          },
          {
            label: "Very consistent, but I still feel low on energy",
            scoring: { focus: 1 },
          },
          {
            label: "I sleep well and usually feel rested",
            scoring: {},
          },
        ],
      },
      {
        id: "q5",
        text: "On busy days, how many caffeinated drinks do you typically have?",
        options: [
          { label: "None or very rarely", scoring: { caffeine: -1 } },
          { label: "1–2 servings", scoring: {} },
          { label: "3–4 servings", scoring: { caffeine: 1 } },
          { label: "5+ or I lose track", scoring: { caffeine: 2, balance: -1 } },
        ],
      },
      {
        id: "q6",
        text: "When stress hits, what best describes your state?",
        options: [
          {
            label: "Wired and restless — hard to turn my brain off",
            scoring: { balance: 2 },
          },
          {
            label: "Foggy — I’m awake but my focus tanks",
            scoring: { focus: 2 },
          },
          {
            label: "I push through, but feel wiped after",
            scoring: { caffeine: 1, balance: 1 },
          },
          {
            label: "I handle it pretty smoothly",
            scoring: {},
          },
        ],
      },
      {
        id: "q7",
        text: "How does your energy tend to feel on an average day?",
        options: [
          { label: "It’s fine, then suddenly low", scoring: { balance: 1 } },
          { label: "It slowly drains as the day goes on", scoring: { caffeine: 1 } },
          { label: "It’s uneven with peaks and valleys", scoring: { balance: 1 } },
          {
            label: "It’s steady, just not strong enough",
            scoring: { focus: 1 },
          },
        ],
      },
      {
        id: "q8",
        text: "What do you want most from your energy?",
        options: [
          {
            label: "Smooth, steady energy without a crash",
            scoring: { balance: 1 },
          },
          {
            label: "Clear, focused thinking",
            scoring: { focus: 1 },
          },
          {
            label: "Stronger physical or mental performance",
            scoring: { caffeine: 1 },
          },
        ],
      },
    ];

    const QUESTION_IDS = QUESTIONS.map((q) => q.id);

    const FLOW = [
      { type: "splash1", id: "splash1" },
      { type: "splash2", id: "splash2" },
      { type: "demographics", id: "demographics" },
      // Questions
      ...QUESTION_IDS.map((qid) => ({ type: "question", id: qid })),
      { type: "analysis", id: "analysis" },
      { type: "summary", id: "summary" },
      // Problem pages - consolidated first 4 symptoms into one page, then transition page
      { type: "problem", id: "p1-4" }, // Combined symptoms page
      { type: "problem", id: "p5" },   // Transition page
      // How we can help - all ingredients on one page
      { type: "help", id: "h1-5" },
      // Final reveal - personalized pouch
      { type: "final", id: "final" },
    ];

    const PROBLEM_PAGES = {
      p1: {
        title: "Fatigue quietly destroys productivity",
        stat: "Up to 38% of workers report fatigue on the job in a typical week.",
        body:
          "Fatigue doesn’t just make you feel tired — it quietly erodes focus, decision-making, and reaction time, turning routine days into uphill battles.",
      },
      p2: {
        title: "Energy crashes erase entire afternoons",
        stat:
          "Midday energy crashes can cost 1–3 hours of peak focus — every single workday.",
        body:
          "By the time your energy dips, your most important tasks are often still unfinished. That drag compounds into missed goals and chronic frustration.",
      },
      p3: {
        title: "Stimulant overuse keeps you stuck",
        stat:
          "Relying heavily on caffeine can worsen sleep and drive a cycle of dependence and burnout.",
        body:
          "Piling on coffee and energy drinks pushes the gas pedal harder — but never fixes the engine. Over time, your baseline energy gets lower, not higher.",
      },
      p4: {
        title: "Low energy has real long-term costs",
        stat:
          "Chronic fatigue is linked to higher stress, more errors, and greater risk of long-term health issues.",
        body:
          "When your system runs in survival mode, your brain, hormones, and nervous system pay the price. Fixing energy isn’t a luxury — it’s preventive maintenance.",
      },
      p5: {
        title: "Your Path to Better Energy",
        stat: "",
        body:
          "Personalized caffeine, focus support, and crash control tailored to your exact needs.",
      },
    };
// Map each diagnosis to a sequence of 5 problem pages
// (using the shared PROBLEM_PAGES p1–p5)
const DIAGNOSIS_PROBLEM_FLOW = {
  // Caffeine overreacts, stimulants are the main villain
  "Caffeine Sensitivity": ["p3", "p1", "p2", "p4", "p5"],

  // Pushes hard, runs out of gas midday
  "High-Output Fatigue": ["p2", "p1", "p3", "p4", "p5"],

  // Classic midday fade
  "Midday Decline Pattern": ["p2", "p1", "p4", "p3", "p5"],

  // Long hard days + stress
  "Overextension Fatigue": ["p4", "p1", "p2", "p3", "p5"],

  // Slower but steady late-day leak
  "Late-Day Decline": ["p2", "p4", "p1", "p3", "p5"],

  // Slow mornings, low gear
  "Delayed Activation": ["p1", "p2", "p4", "p3", "p5"],

  // Needs strong push to wake up
  "High-Tolerance Activation": ["p1", "p3", "p2", "p4", "p5"],

  // Stress + stimulants = wired but unstable
  "Stress-Induced Overarousal": ["p3", "p4", "p1", "p2", "p5"],

  // Stress kills clarity more than energy
  "Cognitive Drift Pattern": ["p1", "p2", "p4", "p3", "p5"],

  // Bouncy / unpredictable energy
  "Energy Variability Disorder": ["p2", "p1", "p3", "p4", "p5"],

  // Flat, underpowered baseline
  "Suboptimal Baseline Energy": ["p1", "p4", "p2", "p3", "p5"],

  // Fallback / mixed pattern
  "Mixed Energy Pattern": ["p1", "p2", "p3", "p4", "p5"],

  // Generic default if anything is off
  default: ["p1", "p2", "p3", "p4", "p5"],
};
// Diagnosis-specific problem copy: 5 slides per diagnosis
// Each index (0–4) = first through fifth Problem slide.
const DIAGNOSIS_PROBLEM_CONTENT = {
  "Caffeine Sensitivity": [
    {
      title: "Overreactive to Stimulants",
      body: "Small caffeine hits feel like too much, too fast."
    },
    {
      title: "Jitters, Not Real Energy",
      body: "You feel wired and uneasy, but not truly energized."
    },
    {
      title: "Crash After Every Spike",
      body: "Energy pops briefly, then falls off harder than before."
    },
    {
      title: "Sleep and Recovery Strain",
      body: "Stimulant stress keeps your system from fully resetting overnight."
    },
    {
      title: "Path Out of Overdrive",
      body: "Dialed-back caffeine plus balance support stabilizes your day."
    }
  ],

  "High-Output Fatigue": [
    {
      title: "Running Hot All Morning",
      body: "You push hard early and burn resources quickly."
    },
    {
      title: "Fatigue Behind Performance",
      body: "Your output stays high while your reserves quietly drain."
    },
    {
      title: "Afternoons Fall Off Hard",
      body: "You lose your sharpness right when work still matters."
    },
    {
      title: "Body Stuck in Overdrive",
      body: "Constant pushing blunts recovery and lowers your baseline over time."
    },
    {
      title: "Structured Refuel Needed",
      body: "Smarter stimulation and recovery cues can extend your runway."
    }
  ],

  "Midday Decline Pattern": [
    {
      title: "Strong Start, Weak Middle",
      body: "Mornings feel fine, but momentum fades too soon."
    },
    {
      title: "Productivity Lost After Lunch",
      body: "Your best work hours end earlier than they should."
    },
    {
      title: "Unreliable Afternoon Focus",
      body: "Important tasks compete with a heavy energy dip."
    },
    {
      title: "Compensating With Quick Fixes",
      body: "Random snacks and caffeine never fully solve the slump."
    },
    {
      title: "Targeted Midday Support",
      body: "Timed focus and crash control can reclaim your afternoons."
    }
  ],

  "Overextension Fatigue": [
    {
      title: "Long Days, Little Margin",
      body: "Your schedule demands more than your energy budget allows."
    },
    {
      title: "Chronic Stress Load",
      body: "Your nervous system runs hot for too many hours."
    },
    {
      title: "Late-Day Performance Slide",
      body: "Precision and patience drop off when days run long."
    },
    {
      title: "Recovery Debt Builds Up",
      body: "Your body never fully catches up between heavy days."
    },
    {
      title: "Protecting Your Reserves",
      body: "Steadier support helps you last without burning out."
    }
  ],

  "Late-Day Decline": [
    {
      title: "Slow Leak of Energy",
      body: "You don’t crash—your energy just steadily drifts downward."
    },
    {
      title: "Evenings Feel Heavier",
      body: "Work, family, or training feel harder than they should."
    },
    {
      title: "Stimulants Come Too Late",
      body: "Late caffeine props you up but punishes your sleep."
    },
    {
      title: "Recovery Window Shrinks",
      body: "Poor timing squeezes the hours when your body can reset."
    },
    {
      title: "Better Timed Support",
      body: "Earlier, smarter boosts can help evenings feel lighter."
    }
  ],

  "Delayed Activation": [
    {
      title: "Slow Morning Boot-Up",
      body: "Your brain and body take too long to come online."
    },
    {
      title: "Lost Early Hours",
      body: "You waste your quietest, most valuable time feeling half-awake."
    },
    {
      title: "Playing Catch-Up All Day",
      body: "A sluggish start makes the rest of the day feel rushed."
    },
    {
      title: "Sleep Isn’t Translating",
      body: "Even decent sleep doesn’t convert into strong morning energy."
    },
    {
      title: "Gentle Morning Activation",
      body: "Well-timed stimulation and focus support lift your launch."
    }
  ],

  "High-Tolerance Activation": [
    {
      title: "Blunted Caffeine Response",
      body: "Normal doses barely move the needle anymore."
    },
    {
      title: "Stacking Cups to Function",
      body: "You keep increasing intake just to feel baseline awake."
    },
    {
      title: "Hidden Fatigue Under Output",
      body: "You look productive, but your system is running depleted."
    },
    {
      title: "Escalating Stimulant Cycle",
      body: "More caffeine today means an even higher bar tomorrow."
    },
    {
      title: "Strategic Stronger Support",
      body: "Calibrated dosing and focus aids can replace blind overuse."
    }
  ],

  "Stress-Induced Overarousal": [
    {
      title: "Stress Fuels Overdrive",
      body: "Pressure plus stimulants push your system past comfortable alertness."
    },
    {
      title: "Wired, Not Productive",
      body: "You feel amped up, but clarity and control suffer."
    },
    {
      title: "Hard to Power Down",
      body: "Your brain doesn’t easily switch off after demanding days."
    },
    {
      title: "Recovery Channels Blocked",
      body: "Nervous system overactivation blunts real rest and reset."
    },
    {
      title: "Calmer, Focused Activation",
      body: "Balance ingredients smooth the edge while keeping you sharp."
    }
  ],

  "Cognitive Drift Pattern": [
    {
      title: "Energy Without Precision",
      body: "You’re technically awake, but mentally off target."
    },
    {
      title: "Focus Slips Under Load",
      body: "Complex or sustained tasks quickly start to feel blurry."
    },
    {
      title: "Stimulants Don’t Fix Clarity",
      body: "More caffeine raises arousal, not high-quality thinking."
    },
    {
      title: "Mental Fatigue Builds Quietly",
      body: "Your brain tires faster than your body signals."
    },
    {
      title: "True Cognitive Support",
      body: "Nootropic focus aids help stabilize attention and clarity."
    }
  ],

  "Energy Variability Disorder": [
    {
      title: "Unpredictable Daily Pattern",
      body: "Some hours feel great, others suddenly fall apart."
    },
    {
      title: "Hard to Plan Output",
      body: "You can’t reliably match energy to important work."
    },
    {
      title: "Overcorrecting With Stimulants",
      body: "You chase dips with random boosts that worsen swings."
    },
    {
      title: "System Never Fully Settles",
      body: "Your nervous system rarely lives in a steady middle gear."
    },
    {
      title: "Smoothing the Curve",
      body: "Balanced support narrows peaks and valleys into something usable."
    }
  ],

  "Suboptimal Baseline Energy": [
    {
      title: "Always Slightly Undercharged",
      body: "You rarely crash, but never feel truly powerful."
    },
    {
      title: "Low Ceiling on Performance",
      body: "Even good days don’t reach your real potential."
    },
    {
      title: "Underwhelming Response to Effort",
      body: "More discipline and work don’t translate into higher energy."
    },
    {
      title: "Quiet Long-Term Cost",
      body: "Living underpowered slowly drags on mood and confidence."
    },
    {
      title: "Raising the Baseline",
      body: "Targeted stimulation and support can lift your whole curve."
    }
  ],

  "Mixed Energy Pattern": [
    {
      title: "No Single Clear Pattern",
      body: "Your answers show overlapping stress, stimulant, and timing issues."
    },
    {
      title: "Different Days, Different Problems",
      body: "Sometimes you crash, other times you just feel flat."
    },
    {
      title: "Random Fixes, Random Results",
      body: "You’ve likely tried many things without a consistent plan."
    },
    {
      title: "System Needs Rebalancing",
      body: "Your energy controls work independently, not as a coordinated whole."
    },
    {
      title: "Unified Support Strategy",
      body: "A balanced build can gradually stabilize mixed, shifting patterns."
    }
  ],

  // Fallback if anything is missing
  default: [
    {
      title: "Energy Working Against You",
      body: "Your current pattern quietly limits your daily performance."
    },
    {
      title: "Productivity Left on Table",
      body: "Energy dips and drags pull focus from what matters."
    },
    {
      title: "Quick Fixes, Weak Results",
      body: "Random caffeine or snacks never address the root pattern."
    },
    {
      title: "Compounded Long-Term Strain",
      body: "Unmanaged fatigue slowly taxes mood, health, and confidence."
    },
    {
      title: "Path to Better Days",
      body: "Targeted support can realign your energy with your goals."
    }
  ]
};

    const HELP_PAGES = {
      h1: {
        title: "Welcome to CLIME",
        subtitle:
          "CLIME builds personalized gel pouches customized around your energy pattern.",
        body: "",
      },
      h2: {
        title: "Caffeine",
        subtitle: "Precision Caffeine",
        body:
          "0–300 mg from organic green coffee beans. Tailored to your needs.",
      },
      h3: {
        title: "Focus",
        subtitle: "Mangiferin Extract",
        body:
          "Clinically shown to improve focus and processing speed.",
      },
      h4: {
        title: "Balance",
        subtitle: "L-Theanine & Taurine",
        body:
          "Reduces jitters and smooths out stimulant edge.",
      },
      h5: {
        title: "Nootropic Mushrooms",
        subtitle: "Lion's Mane & Reishi",
        body:
          "Supports calm clarity and resilience to stress.",
      },
    };
    
    // ===== ICON / IMAGE MAPS =====
    const PROBLEM_MEDIA = {
      p1: {
        // Draining battery icon
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Prob_Page_1_-_Draining_Battery.png?v=1764201089",
        alt: "Battery icon showing energy draining"
      },
      p2: {
        // Empty fuel gauge icon
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Prob_Page_2_-_Empty_Fuel.png?v=1764201089",
        alt: "Fuel gauge icon near empty"
      },
      p3: {
        // Trash can with coffee cups / cans
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Prob_Page_3_-_Trash_can.png?v=1764201089",
        alt: "Trash can with discarded coffee cups"
      },
      p4: {
        // Head on desk icon
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Prob_Page_4_-_Head_on_Desk.png?v=1764201089",
        alt: "Person resting head on desk"
      },
      p5: {
        // Sunflower / better path icon
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Better_Path_Page_-_Sunflower.png?v=1764201089",
        alt: "Sunflower icon symbolizing better energy path"
      }
    };

    const HELP_MEDIA = {
      h1: {
        // CLIME pouch / bottle
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Pouch_Icon_a634d238-2efd-4fd5-ac07-db014e012e83.png?v=1764201089",
        alt: "CLIME pouch icon"
      },
      h2: {
        // Coffee beans (caffeine)
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Coffee_Bean_Icon_f802977b-50d5-4c9c-b4fc-7fb008bbe4d1.png?v=1764201089",
        alt: "Coffee bean branch icon"
      },
      h3: {
        // Mango (mangiferin)
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Mangiferin_Icon_4358808d-e9d6-4ba1-9048-afa8d1f1f997.png?v=1764201089",
        alt: "Mango fruit icon"
      },
      h4: {
        // Balance scale
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Balance_Icon_044c3731-c428-497a-a18e-45bd84d4071f.png?v=1764201089",
        alt: "Balance scale icon"
      },
      h5: {
        // Mushrooms
        src: "https://cdn.shopify.com/s/files/1/0965/9003/7310/files/Mushroom_Icon_134caf25-4d4e-47d6-b5ba-c178437baf3c.png?v=1764201089",
        alt: "Mushroom icon"
      }
    };

    /* ===== STATE ===== */

    const state = {
      stepIndex: 0,
      answers: {},
      scores: { caffeine: 0, focus: 0, balance: 0 },
      firstName: "",
      age: "",
      diagnosis: null,
      build: null,
      energyBars: null,
      analysisTimer: null,
      introTimer: null,
    };

    function getQuestionById(id) {
      return QUESTIONS.find((q) => q.id === id);
    }

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* ===== PROGRESS ===== */

    function countAnsweredQuestions() {
      let count = 0;
      QUESTION_IDS.forEach((qid) => {
        if (state.answers[qid]) count++;
      });
      return count;
    }

    function updateProgressBar() {
      const total = QUESTION_IDS.length;
      const answered = countAnsweredQuestions();
      const pct = total > 0 ? (answered / total) * 100 : 0;
      if (progressFill) {
        progressFill.style.height = pct + "%";
      }
    }

    /* ===== RENDER HELPERS ===== */

    function setSectionMode(mode) {
      sectionEl.classList.remove(
        "mode-star",
        "mode-star-sunrise",
        "mode-problem",
        "mode-help",
        "mode-final"
      );
      sectionEl.classList.add(mode);
    }

    function setCardFrame(isSplash) {
      if (!cardEl) return;
      cardEl.classList.toggle("cq-card--splash", !!isSplash);
    }

    function setCardDark(isDark) {
      if (!cardEl) return;
      cardEl.classList.toggle("cq-card--dark", !!isDark);
    }

    function setActionsVisibility(show, label) {
      if (!actionsEl) return;
      if (show) {
        actionsEl.classList.remove("cq-actions--hidden");
        if (label) nextBtn.textContent = label;
      } else {
        actionsEl.classList.add("cq-actions--hidden");
      }
    }

    function renderSplash1() {
      setSectionMode("mode-star");
      setCardFrame(true); // full-bleed splash card
      setCardDark(true);  // dark background, white text
      setActionsVisibility(false); // no Next button

      root.innerHTML =
        '<div class="cq-splash">' +
          '<div class="cq-splash-logo">' +
            '<img src="https://cdn.shopify.com/s/files/1/0965/9003/7310/files/CLIME_Logo_White_1.png?v=1762910146" alt="CLIME" class="cq-splash-logo-img" />' +
          "</div>" +
          '<p class="cq-splash-tagline">Energy, personalized.</p>' +
          '<p class="cq-splash-subtitle">' +
            "Everyone\u2019s energy needs are different." +
          "</p>" +
        "</div>";

      // After full fade-in (~5s), fade OUT, then move to next screen
if (state.introTimer) {
  clearTimeout(state.introTimer);
}

// Start fade-out at 5s
state.introTimer = setTimeout(function () {
  const splashEl = document.querySelector('.cq-splash');
  if (splashEl) {
    splashEl.classList.add('cq-splash--fade-out');
  }

  // Advance after fade-out completes (1.0s)
  setTimeout(nextStep, 1000);

}, 3000); // 3s fade-in duration before fade-out begins

    }

    function renderSplash2() {
  setSectionMode("mode-star-sunrise");
  setCardFrame(false);
  setCardDark(true); // still on dark quiz card
  setActionsVisibility(true, "Begin the Assessment");

  root.innerHTML =
    '<div style="text-align:center; margin-bottom:36px;">' +
      '<h2 class="cq-title" style="text-align:center;">Welcome!</h2>' +
      '<p class="cq-subtitle" style="text-align:center; max-width:480px; margin:12px auto 0;">' +
        'Let’s start by finding out what your energy patterns are.' +
      '</p>' +
    '</div>';

  // 🔥 Center the CTA for this screen
  if (actionsEl) {
    actionsEl.style.justifyContent = "center";  // override flex-end
    actionsEl.style.marginTop = "28px";         // a bit more space under the copy
  }
}

        function renderDemographics() {
      setSectionMode("mode-star-sunrise");
      setCardFrame(false);
      setCardDark(true); // quiz screen: dark card
      setActionsVisibility(true, "Next");

      const nameValue = state.firstName || "";

      root.innerHTML =
        '<div style="text-align:center; margin-bottom:32px;">' +
          '<h2 class="cq-title" style="text-align:center;">Start by telling us about you</h2>' +
          '<p class="cq-subtitle" style="text-align:center; max-width:520px; margin:12px auto 0;">' +
            'We’ll use this to personalize your CLIME pouch and your results.' +
          '</p>' +
        '</div>' +
        '<div class="cq-field-group" style="text-align:center; margin-top:20px;">' +
          '<label class="cq-field-label" for="cq-first-name" style="display:block; text-align:center;">Please enter your first name</label>' +
          '<input id="cq-first-name" class="cq-input" type="text" ' +
            'style="margin:0 auto;" value="' + escapeHtml(nameValue) + '"/>' +
        '</div>';

      // Center the CTA on this screen
      if (actionsEl) {
        actionsEl.style.justifyContent = "center";
        actionsEl.style.marginTop = "28px";
      }

      const nameInput = document.getElementById("cq-first-name");

      if (nameInput) {
        nameInput.addEventListener("input", function () {
          state.firstName = this.value.trim();
          this.classList.remove("cq-input--error");
        });
      }
    }

    function renderQuestion(step) {
      const q = getQuestionById(step.id);
      if (!q) return;

      setSectionMode("mode-star");
      setCardFrame(false);
      setCardDark(true);      // quiz questions: dark card
      setActionsVisibility(false); // auto-advance on selection

      const qIndex = QUESTION_IDS.indexOf(q.id);
      const questionNumber = qIndex + 1;
      const totalQuestions = QUESTION_IDS.length;
      const alreadyAnswered = !!state.answers[q.id];

      let html = "";

      html +=
        '<div class="cq-question-meta">' +
        '<div class="cq-question-number' +
        (alreadyAnswered ? " cq-question-number--done" : "") +
        '">' +
        questionNumber +
        "</div>" +
        '<div class="cq-question-label">Question ' +
        questionNumber +
        " of " +
        totalQuestions +
        "</div>" +
        "</div>";

      html += '<h2 class="cq-question-text">' + escapeHtml(q.text) + "</h2>";
      html += '<div class="cq-options">';

      q.options.forEach(function (opt) {
        const isSelected = state.answers[q.id] === opt.label;
        html +=
          '<button type="button" class="cq-option' +
          (isSelected ? " is-selected" : "") +
          '" data-qid="' +
          q.id +
          '" data-label="' +
          escapeHtml(opt.label) +
          '">' +
          '<div class="cq-option-circle">' +
          '<span class="cq-option-check">\u2713</span>' +
          "</div>" +
          '<div class="cq-option-text">' +
          escapeHtml(opt.label) +
          "</div>" +
          "</button>";
      });

      html += "</div>";

      root.innerHTML = html;

      const optionEls = root.querySelectorAll(".cq-option");
            optionEls.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const qid = this.getAttribute("data-qid");
          const label = this.getAttribute("data-label");
          const question = getQuestionById(qid);
          if (!qid || !label || !question) return;

          // Update selected styling
          optionEls.forEach((el) => el.classList.remove("is-selected"));
          this.classList.add("is-selected");

          // Record answer & update scores
          state.answers[qid] = label;
          const opt = question.options.find((o) => o.label === label);
          if (opt && opt.scoring) {
            Object.keys(opt.scoring).forEach((dim) => {
              const delta = opt.scoring[dim] || 0;
              state.scores[dim] = (state.scores[dim] || 0) + delta;
            });
          }

          updateProgressBar();

          setTimeout(nextStep, 500);
        });
      });
    }

 function renderAnalysis() {
  setSectionMode("mode-star-sunrise");
  setCardFrame(false);
  setCardDark(true);

  // Hide Next while analysis runs
  setActionsVisibility(false);

  const durationMs = 4000;
  const startTime = performance.now();

  root.innerHTML =
    '<div class="cq-analysis-wrapper-container">' +
      '<h2 class="cq-title cq-title--analysis">Analyzing your responses...</h2>' +
      '<div class="cq-analysis-wrapper">' +
        '<div class="cq-analysis-circle">' +
          '<div class="cq-analysis-circle-inner" id="cq-analysis-percent">0%</div>' +
        '</div>' +
        '<div class="cq-analysis-status" id="cq-analysis-status">Analyzing Responses</div>' +
      '</div>' +
    '</div>';

  const percentEl = document.getElementById("cq-analysis-percent");
  const statusEl = document.getElementById("cq-analysis-status");
  const circleEl = root.querySelector(".cq-analysis-circle");

  function tick(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / durationMs);
    const pct = Math.round(t * 100);

    if (circleEl) {
      const angle = Math.round(360 * t);
      circleEl.style.background =
        "conic-gradient(from 0deg, #22c55e 0deg, #22c55e " +
        angle +
        "deg, #e5e7eb " +
        angle +
        "deg, #e5e7eb 360deg)";
    }

    if (percentEl) {
      percentEl.textContent = pct + "%";
    }

    if (statusEl) {
      if (t < 0.34) {
        statusEl.textContent = "Analyzing Responses";
      } else if (t < 0.67) {
        statusEl.textContent = "Analyzing Patterns";
      } else {
        statusEl.textContent = "Building custom plan";
      }
    }

    if (t < 1) {
      state.analysisTimer = requestAnimationFrame(tick);
    } else {
      // When analysis finishes, compute everything and move on
      computeDiagnosisAndBuild();
      state.stepIndex = FLOW.findIndex((step) => step.type === "summary");
      if (state.stepIndex === -1) state.stepIndex = 0;
      renderStep();
    }
  }

  state.analysisTimer = requestAnimationFrame(tick);
}
    function makeEnergyBars(diagnosis) {
      // Simple default bar values
      let potential = 90;
      let current = 45;

      const title = diagnosis && diagnosis.title ? diagnosis.title : "";

      // Optionally tweak current based on diagnosis type
      if (title === "High-Output Fatigue" || title === "Overextension Fatigue") {
        current = 35;
      } else if (title === "Midday Decline Pattern" || title === "Late-Day Decline") {
        current = 40;
      } else if (title === "Suboptimal Baseline Energy") {
        current = 45;
      } else if (title === "Caffeine Sensitivity" || title === "Stress-Induced Overarousal") {
        current = 50;
      } else if (title === "Energy Variability Disorder" || title === "Mixed Energy Pattern") {
        current = 42;
      }

      return { potential, current };
    }

    function computeDiagnosisAndBuild() {
      const diagnosis = chooseDiagnosis();
      const build = mapScoresToBuild(state.scores);
      const bars = makeEnergyBars(diagnosis);

      state.diagnosis = diagnosis;
      state.build = build;
      state.energyBars = bars;
    }

    function chooseDiagnosis() {
  const a1 = (state.answers["q1"] || "").toLowerCase();
  const a2 = (state.answers["q2"] || "").toLowerCase();
  const a3 = (state.answers["q3"] || "").toLowerCase();
  const a5 = (state.answers["q5"] || "").toLowerCase();
  const a6 = (state.answers["q6"] || "").toLowerCase();
  const a7 = (state.answers["q7"] || "").toLowerCase();
  const a8 = (state.answers["q8"] || "").toLowerCase();
  const s = state.scores || {};

  const caffeineScore = s.caffeine || 0;
  const focusScore = s.focus || 0;
  const balanceScore = s.balance || 0;

  // ---- PATTERN (WHEN + HOW ENERGY DROPS) ----
  let pattern;
  if (a2.indexOf("early afternoon") !== -1) {
    pattern = "midday";
  } else if (
    a2.indexOf("late evenings") !== -1 ||
    a2.indexOf("long shifts") !== -1 ||
    a2.indexOf("travel") !== -1
  ) {
    pattern = "late";
  } else if (a2.indexOf("first 1–2 hours") !== -1) {
    pattern = "morning";
  } else if (
    a7.indexOf("peaks and valleys") !== -1 ||
    a7.indexOf("suddenly low") !== -1
  ) {
    pattern = "swingy";
  } else {
    pattern = "steadyLow";
  }

  // ---- CAFFEINE / STRESS PROFILE ----
  const caffeineSensitive =
    a3.indexOf("jittery or anxious") !== -1 ||
    caffeineScore < 0 ||
    (a5.indexOf("none or very rarely") !== -1 && caffeineScore <= 0);

  const highTolerance =
    a3.indexOf("barely feel it") !== -1 ||
    caffeineScore >= 3 ||
    a5.indexOf("5+ or i lose track") !== -1;

  const wiredStressed =
    a6.indexOf("wired and restless") !== -1 && balanceScore >= 1;

  const foggyStressed =
    a6.indexOf("foggy") !== -1 && focusScore >= 1;

  // Defaults (fallback)
  let key = "Mixed Pattern – Needs Calibration";
  let title = "Mixed Energy Pattern";
  let fiveWords = "Mixed energy signals; pattern needs better tuning.";

  // ---- DECISION TREE ----

  // 1) Midday crash variants
  if (pattern === "midday" && caffeineSensitive) {
    key = "Midday Crash – Caffeine Sensitive";
    title = "Caffeine Sensitivity";
    fiveWords = "Afternoon crash; caffeine makes crashes worse.";
  } else if (pattern === "midday" && highTolerance) {
    key = "Midday Crash – High Output";
    title = "High-Output Fatigue";
    fiveWords = "Pushes hard early, pays with afternoon crash.";
  } else if (pattern === "midday") {
    key = "Midday Crash – Underpowered";
    title = "Midday Decline Pattern";
    fiveWords = "Decent mornings, afternoons quietly fade out.";

  // 2) Late-day fatigue variants
  } else if (pattern === "late" && wiredStressed) {
    key = "Late-Day Fatigue – Overextended";
    title = "Overextension Fatigue";
    fiveWords = "Long days plus stress drain energy late.";
  } else if (pattern === "late") {
    key = "Late-Day Fatigue – Slow Fade";
    title = "Late-Day Decline";
    fiveWords = "Energy slowly leaks away on long days.";

  // 3) Morning slump
  } else if (pattern === "morning" && !highTolerance) {
    key = "Morning Slump – Activation Lag";
    title = "Delayed Activation";
    fiveWords = "Slow to start; brain boots up late.";
  } else if (pattern === "morning" && highTolerance) {
    key = "Morning Slump – High-Tolerance";
    title = "High-Tolerance Activation";
    fiveWords = "Needs strong push just to feel awake.";

  // 4) Stress-driven patterns
  } else if (wiredStressed) {
    key = "Stressed & Wired – Jitter-Prone";
    title = "Stress-Induced Overarousal";
    fiveWords = "Stress plus caffeine creates wired, unstable energy.";
  } else if (foggyStressed) {
    key = "Foggy Under Load – Focus Drift";
    title = "Cognitive Drift Pattern";
    fiveWords = "Stress keeps energy up, but melts focus.";

  // 5) Swingy / unstable energy
  } else if (pattern === "swingy") {
    key = "Unstable Energy – Peaks & Dips";
    title = "Energy Variability Disorder";
    fiveWords = "Sharp energy bursts followed by hard crashes.";

  // 6) Steady but too low
  } else if (pattern === "steadyLow") {
    key = "Steady But Underpowered – Flat Curve";
    title = "Suboptimal Baseline Energy";
    fiveWords = "Stable all day, but never truly sharp.";
  }

  return {
    key: key,          // internal pattern label
    title: title,      // short clinical diagnosis
    fiveWords: fiveWords, // 6–8 word blurb
  };
}

    function mapScoresToBuild(scores) {
      let c = scores.caffeine || 0;
      const f = scores.focus || 0;
      const b = scores.balance || 0;

      // clamp caffeine score
      c = Math.max(-2, Math.min(8, c));

      // map caffeine score → mg
      let caffeineMg;
      if (c <= -1) {
        caffeineMg = 0;
      } else if (c <= 1) {
        caffeineMg = 75;
      } else if (c <= 3) {
        caffeineMg = 150;
      } else if (c <= 5) {
        caffeineMg = 225;
      } else {
        caffeineMg = 300;
      }

      // map focus score → none / medium / high
      let focusLevel;
      if (f <= 0) {
        focusLevel = "none";
      } else if (f >= 3) {
        focusLevel = "high";
      } else {
        focusLevel = "medium";
      }

      // map balance score → none / medium / high
      let balanceLevel;
      if (b <= 0) {
        balanceLevel = "none";
      } else if (b >= 3) {
        balanceLevel = "high";
      } else {
        balanceLevel = "medium";
      }

      // simple labels for UI
      const focusLabelSimple =
        focusLevel === "none" ? "None" :
        focusLevel === "high" ? "High" : "Medium";

      const balanceLabelSimple =
        balanceLevel === "none" ? "None" :
        balanceLevel === "high" ? "High" : "Medium";

      return {
        caffeineMg,
        focusLevel,
        balanceLevel,
        focusLabelSimple,
        balanceLabelSimple,
      };
    }

function renderSummary() {
  // Safety net: if somehow we got here without a diagnosis, compute it now
  if (!state.diagnosis) {
    computeDiagnosisAndBuild();
  }

  const diagnosis = state.diagnosis;
  const bars = state.energyBars;

  setSectionMode("mode-star");
  setCardFrame(false);
  setCardDark(true);
  setActionsVisibility(true, "Next");

  const dxLabel = diagnosis.title;      // always a real diagnosis
  const fiveWords = diagnosis.fiveWords;

  const potential = bars ? bars.potential : 90;
  const current   = bars ? bars.current   : 45;

  root.innerHTML =
    '<h2 class="cq-title cq-title--clinical">ANALYSIS COMPLETE. YOUR DIAGNOSIS:</h2>' +
    // Centered, clear capsule headline
    '<div class="cq-dx-headline">' +
      '<div class="cq-dx-pill cq-dx-pill--clinical">' +
        escapeHtml(dxLabel) +
      '</div>' +
    '</div>' +
    // Centered diagnosis description
    '<p class="cq-result-summary cq-result-summary--centered cq-result-summary--clinical">' +
      escapeHtml(fiveWords) +
    '</p>' +
    // Bar chart
    '<div class="cq-bar-chart">' +
      '<div class="cq-bar-col">' +
        '<div class="cq-bar">' +
          '<div class="cq-bar-fill cq-bar-fill--green" style="height:' + potential + '%;">' +
            potential + '%</div>' +
        '</div>' +
        '<div class="cq-bar-label">POTENTIAL</div>' +
      '</div>' +
      '<div class="cq-bar-col">' +
        '<div class="cq-bar">' +
          '<div class="cq-bar-fill cq-bar-fill--red" style="height:' + current + '%;">' +
            current + '%</div>' +
        '</div>' +
        '<div class="cq-bar-label">YOUR ENERGY</div>' +
      '</div>' +
    '</div>';
}

function renderProblem(step) {
  setSectionMode("mode-star-sunrise");
  setCardFrame(false);
  setCardDark(true);

  const diagnosis = state.diagnosis;
  const diagTitle =
    diagnosis && diagnosis.title ? diagnosis.title : "default";

  // Handle the combined symptoms page (p1-4)
  if (step.id === "p1-4") {
    setActionsVisibility(true, "Next");
    
    const diagList =
      DIAGNOSIS_PROBLEM_CONTENT[diagTitle] ||
      DIAGNOSIS_PROBLEM_CONTENT.default;

    const flowForDiag =
      DIAGNOSIS_PROBLEM_FLOW[diagTitle] ||
      DIAGNOSIS_PROBLEM_FLOW.default;

    // Get all 4 symptom items (indices 0-3)
    let symptomsHtml = "";
    for (let i = 0; i < 4; i++) {
      const pageId = flowForDiag[i] || flowForDiag[0];
      const baseData = PROBLEM_PAGES[pageId] || PROBLEM_PAGES.p1;
      const diagContent = diagList[i] || DIAGNOSIS_PROBLEM_CONTENT.default[i];
      
      const finalTitle = diagContent.title || (baseData ? baseData.title : "");
      const finalBody = diagContent.body || (baseData ? baseData.body : "");
      const stat = (baseData && baseData.stat) ? baseData.stat : "";
      const mediaCfg = PROBLEM_MEDIA[pageId];

      const mediaHtml = mediaCfg
        ? '<div class="cq-problem-media">' +
            '<img src="' + mediaCfg.src + '" alt="' + escapeHtml(mediaCfg.alt) + '" class="cq-media-img" />' +
          '</div>'
        : "";

      symptomsHtml +=
        '<div class="cq-symptom-item">' +
          mediaHtml +
          '<h3 class="cq-problem-title">' + escapeHtml(finalTitle) + "</h3>" +
          '<p class="cq-problem-subtitle">' + escapeHtml(finalBody) + "</p>" +
        '</div>';
    }

    const firstName = (state.firstName || "").trim();
    const introText = firstName 
      ? escapeHtml(firstName) + ', here\'s what your energy pattern reveals'
      : 'Here\'s what your energy pattern reveals:';

    root.innerHTML =
      '<div class="cq-symptoms-header">' +
        '<h2 class="cq-symptoms-title">Understanding ' + escapeHtml(diagTitle) + '</h2>' +
        '<p class="cq-symptoms-intro">' + introText + '</p>' +
      '</div>' +
      '<div class="cq-symptoms-container">' +
        symptomsHtml +
      '</div>';

    // Center the Next button on problem pages
    if (actionsEl) {
      actionsEl.style.justifyContent = "center";
      actionsEl.style.marginTop = "24px";
    }
    return;
  }

  // Handle the transition page (p5)
  if (step.id === "p5") {
    setActionsVisibility(true, "Next");
    setSectionMode("mode-star-sunrise"); // Use the sunrise gradient for excitement
    
    const baseData = PROBLEM_PAGES.p5;
    if (!baseData) return;

    const mediaCfg = PROBLEM_MEDIA.p5;
    const mediaHtml = mediaCfg
      ? '<div class="cq-solution-media">' +
          '<img src="' + mediaCfg.src + '" alt="' + escapeHtml(mediaCfg.alt) + '" class="cq-solution-icon" />' +
        '</div>'
      : "";

    root.innerHTML =
      '<div class="cq-solution-wrapper">' +
        '<div class="cq-solution-particles"></div>' +
        '<div class="cq-solution-glow"></div>' +
        mediaHtml +
        '<div class="cq-solution-content">' +
          '<div class="cq-solution-badge">' +
            '<span class="cq-badge-sparkle">✨</span>' +
            '<span>The Solution</span>' +
            '<span class="cq-badge-sparkle">✨</span>' +
          '</div>' +
          '<h2 class="cq-solution-title">' +
            escapeHtml(baseData.title) +
          "</h2>" +
          '<p class="cq-solution-body">' +
          escapeHtml(baseData.body) +
          "</p>" +
        '</div>' +
      '</div>';

    // Center the Next button on problem pages
    if (actionsEl) {
      actionsEl.style.justifyContent = "center";
      actionsEl.style.marginTop = "32px";
    }
    return;
  }
}



function renderHelp(step) {
  setSectionMode("mode-star-sunrise");
  setCardFrame(false);
  setCardDark(true);
  setActionsVisibility(true, "Next");

  // Handle the combined ingredients page (h1-5)
  if (step.id === "h1-5") {
    const order = ["h1", "h2", "h3", "h4", "h5"];
    let ingredientsHtml = "";

    // First item (h1) is the intro - show it separately
    const introData = HELP_PAGES.h1;
    const introMedia = HELP_MEDIA.h1;
    const introMediaHtml = introMedia
      ? '<div class="cq-help-media">' +
          '<img src="' + introMedia.src + '" alt="' + escapeHtml(introMedia.alt) + '" class="cq-media-img" />' +
        '</div>'
      : "";

    // Then show the 4 ingredients (h2-h5)
    for (let i = 1; i < order.length; i++) {
      const helpId = order[i];
      const data = HELP_PAGES[helpId];
      const mediaCfg = HELP_MEDIA[helpId];

      if (!data) continue;

      const mediaHtml = mediaCfg
        ? '<div class="cq-ingredient-media">' +
            '<img src="' + mediaCfg.src + '" alt="' + escapeHtml(mediaCfg.alt) + '" class="cq-ingredient-icon" />' +
          '</div>'
        : "";

      ingredientsHtml +=
        '<div class="cq-ingredient-item">' +
          mediaHtml +
          '<h3 class="cq-ingredient-title">' + escapeHtml(data.title) + "</h3>" +
          '<p class="cq-ingredient-subtitle">' + escapeHtml(data.subtitle || "") + "</p>" +
          '<p class="cq-ingredient-body">' + escapeHtml(data.body) + "</p>" +
        '</div>';
    }

    const introBodyHtml = introData.body && introData.body.trim()
      ? '<p class="cq-help-body">' + escapeHtml(introData.body) + "</p>"
      : "";

    root.innerHTML =
      '<div class="cq-help-wrapper">' +
        '<div class="cq-help-intro">' +
          introMediaHtml +
          '<h2 class="cq-help-title">' + escapeHtml(introData.title) + "</h2>" +
          '<p class="cq-help-subtitle">' + escapeHtml(introData.subtitle || "") + "</p>" +
          introBodyHtml +
        '</div>' +
        '<div class="cq-ingredients-container">' +
          ingredientsHtml +
        '</div>' +
      '</div>';

    // Center the Next button
    if (actionsEl) {
      actionsEl.style.justifyContent = "center";
      actionsEl.style.marginTop = "20px";
    }
    return;
  }
}


function renderFinal() {
  // Make sure we have a build + diagnosis
  if (!state.diagnosis || !state.build) {
    computeDiagnosisAndBuild();
  }

  const build =
    state.build ||
    mapScoresToBuild(state.scores || { caffeine: 0, focus: 0, balance: 0 });
  const diagnosis = state.diagnosis;

  const firstName = (state.firstName || "Your").trim();
  const pouchName = firstName + "’s Energy";

        const caffeinePretty = build.caffeineMg + " mg caffeine";

      // Lines for the pouch label
      const caffeineLine =
        "Caffeine \u2013 " + build.caffeineMg + " mg";
      const focusLine =
        "Focus \u2013 " + (build.focusLabelSimple || "Medium");
      const balanceLine =
        "Balance \u2013 " + (build.balanceLabelSimple || "Medium");

  // Long-form descriptions (same logic you already had)
  const caffeineDesc =
    build.caffeineMg === 0
      ? "No added caffeine — ideal if you’re highly sensitive or already have a fixed caffeine routine."
      : build.caffeineMg <= 100
      ? "A lighter dose tailored for sensitivity and jitter control, with room to add your own coffee if needed."
      : build.caffeineMg <= 200
      ? "A solid daily dose tuned for clear alertness without pushing you into overload."
      : "A higher-but-controlled dose aimed at high-tolerance days where you need stronger output.";

  const focusDesc =
    build.focusLevel === "none"
      ? "Built without extra focus nootropics for people who prefer a simpler, cleaner stimulant profile."
      : build.focusLevel === "high"
      ? "Higher focus support for demanding days that require sustained concentration and mental endurance."
      : "Balanced focus support to keep you locked-in on tasks without feeling amped up.";

  const balanceDesc =
    build.balanceLevel === "none"
      ? "Minimal crash/jitter support, best for people who rarely feel wired, edgy, or overamped from stimulants."
      : build.balanceLevel === "high"
      ? "Extra support aimed at smoothing jitters, edge, and post-caffeine crashes."
      : "Balanced crash/jitter control to keep your energy smoother and less crash-prone.";

  // Final screen styling
  setSectionMode("mode-star-sunrise");  // Use dark background consistent with other pages
  setCardFrame(false);
  setCardDark(true);                     // Dark card for consistency
  setActionsVisibility(true, "Build Your Pouch");

  root.innerHTML =
    '<h2 class="cq-final-title">' + escapeHtml(firstName) + '\'s Customized Energy</h2>' +
    '<p class="cq-final-subtitle">Based on your responses, this is the optimized energy build that best matches your energy pattern.</p>' +
    '<div class="cq-final-attributes">' +
      '<dl>' +
        '<div class="cq-attr-row">' +
          '<dt>' +
            '<div class="cq-attr-heading">Caffeine</div>' +
            '<div class="cq-attr-sub">' + escapeHtml(caffeineDesc) + '</div>' +
          '</dt>' +
          '<dd>' +
            '<div class="cq-attr-value">' + escapeHtml(caffeinePretty) + '</div>' +
          '</dd>' +
        '</div>' +

        '<div class="cq-attr-row">' +
          '<dt>' +
            '<div class="cq-attr-heading">Focus support</div>' +
            '<div class="cq-attr-sub">' + escapeHtml(focusDesc) + '</div>' +
          '</dt>' +
          '<dd>' +
            '<div class="cq-attr-value">' + escapeHtml(build.focusLabelSimple || "Medium") + '</div>' +
          '</dd>' +
        '</div>' +

        '<div class="cq-attr-row">' +
          '<dt>' +
            '<div class="cq-attr-heading">Crash & jitter control</div>' +
            '<div class="cq-attr-sub">' + escapeHtml(balanceDesc) + '</div>' +
          '</dt>' +
          '<dd>' +
            '<div class="cq-attr-value">' + escapeHtml(build.balanceLabelSimple || "Medium") + '</div>' +
          '</dd>' +
        '</div>' +
      '</dl>' +
    '</div>';
}
        /* ===== STEP CONTROLLER ===== */

    // Simple helper to fade the page container (used only on first three screens)
    function triggerPageFade() {
      if (!root) return;
      root.classList.remove("cq-page-animate");
      // Force reflow so animation restarts
      void root.offsetWidth;
      root.classList.add("cq-page-animate");
    }

    function renderStep() {
      const step = FLOW[state.stepIndex];
      if (!step) return;

      // Clear any running timers
      if (state.analysisTimer) {
        cancelAnimationFrame(state.analysisTimer);
        state.analysisTimer = null;
      }
      if (state.introTimer) {
        clearTimeout(state.introTimer);
        state.introTimer = null;
      }

      // ✅ Only fade the FIRST THREE screens:
      //    - splash1 (title page)
      //    - splash2 (Welcome page)
      //    - demographics (Start by telling us about you)
      const shouldFade =
        step.type === "splash1" ||
        step.type === "splash2" ||
        step.type === "demographics";

      // Card-level fade (slide feel)
      if (cardEl) {
        cardEl.classList.remove("cq-step-fade");
        if (shouldFade) {
          void cardEl.offsetWidth; // restart animation
          cardEl.classList.add("cq-step-fade");
        }
      }

      // Render the actual step content
      switch (step.type) {
        case "splash1":
          renderSplash1();
          break;
        case "splash2":
          renderSplash2();
          break;
        case "demographics":
          renderDemographics();
          break;
        case "question":
          renderQuestion(step);
          break;
        case "analysis":
          renderAnalysis();
          break;
        case "summary":
          renderSummary();
          break;
        case "problem":
          renderProblem(step);
          break;
        case "help":
          renderHelp(step);
          break;
        case "final":
          renderFinal();
          break;
      }

      // 🔑 Page fade only on the first three screens
      if (shouldFade) {
        triggerPageFade();
      }

      // Update debug modal if open
      const modal = document.getElementById('cq-debug-modal');
      if (modal && modal.classList.contains('is-open')) {
        renderDebugSteps();
      }
    }

    function nextStep() {
      const step = FLOW[state.stepIndex];
      if (!step) return;

      if (step.type === "demographics") {
        if (!state.firstName) {
          const nameInput = document.getElementById("cq-first-name");
          if (nameInput) {
            nameInput.focus();
            nameInput.classList.add("cq-input--error");
          }
          return;
        }
      }

      if (step.type === "final") {
        handoffToBuilder();
        return;
      }

      state.stepIndex = Math.min(FLOW.length - 1, state.stepIndex + 1);
      renderStep();
    }

    nextBtn.addEventListener("click", function () {
      nextStep();
    });

    function escapeHtml(str) {
      if (str == null) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function handoffToBuilder() {
      const build = state.build || mapScoresToBuild(state.scores || {});
const diagnosis = state.diagnosis;

const payload = {
  caffeineMg: build.caffeineMg,
  focusLevel: build.focusLevel,
  balanceLevel: build.balanceLevel,
  personaLabel: diagnosis ? diagnosis.title : "Personalized Energy",
  personaSummary: diagnosis ? diagnosis.fiveWords : "",
  firstName: state.firstName || "",
  age: state.age || "",
};


      if (typeof climeSendToPouchBuilder === "function") {
        climeSendToPouchBuilder(payload);
      } else {
        try {
          localStorage.setItem("climeQuizResult", JSON.stringify(payload));
          window.location.href = "/products/custom-energy-pouch?from_quiz=1";
        } catch (e) {
          console.error("CLIME quiz handoff error:", e);
        }
      }
    }

    /* ===== DEBUG MODAL ===== */
    
    // Create debug modal HTML
    function createDebugModal() {
      const modal = document.createElement('div');
      modal.className = 'cq-debug-modal';
      modal.id = 'cq-debug-modal';
      modal.innerHTML = 
        '<div class="cq-debug-content">' +
          '<div class="cq-debug-header">' +
            '<h3 class="cq-debug-title">Quiz Debug Navigator</h3>' +
            '<button class="cq-debug-close" id="cq-debug-close" aria-label="Close">×</button>' +
          '</div>' +
          '<div class="cq-debug-info" id="cq-debug-info">Current step: 0</div>' +
          '<div class="cq-debug-steps" id="cq-debug-steps"></div>' +
          '<div class="cq-debug-shortcut">Press Ctrl+D (Cmd+D on Mac) to toggle</div>' +
        '</div>';
      document.body.appendChild(modal);
      return modal;
    }

    // Get step display label
    function getStepLabel(step, index) {
      if (step.type === 'splash1') return 'Splash Screen 1';
      if (step.type === 'splash2') return 'Splash Screen 2';
      if (step.type === 'demographics') return 'Demographics';
      if (step.type === 'question') {
        const q = getQuestionById(step.id);
        return q ? 'Q' + (QUESTION_IDS.indexOf(step.id) + 1) + ': ' + (q.text.length > 50 ? q.text.substring(0, 50) + '...' : q.text) : 'Question ' + step.id;
      }
      if (step.type === 'analysis') return 'Analysis';
      if (step.type === 'summary') return 'Summary';
      if (step.type === 'problem') {
        if (step.id === 'p1-4') return 'Problem: Combined Symptoms';
        if (step.id === 'p5') return 'Problem: Solution Path';
        return 'Problem: ' + step.id;
      }
      if (step.type === 'help') {
        if (step.id === 'h1-5') return 'Help: Combined Ingredients';
        return 'Help: ' + step.id;
      }
      if (step.type === 'final') return 'Final: Custom Pouch';
      return step.type + ': ' + step.id;
    }

    // Render debug modal steps
    function renderDebugSteps() {
      const stepsEl = document.getElementById('cq-debug-steps');
      const infoEl = document.getElementById('cq-debug-info');
      if (!stepsEl || !infoEl) return;

      const currentIndex = state.stepIndex;
      infoEl.textContent = 'Current step: ' + (currentIndex + 1) + ' of ' + FLOW.length + ' (' + getStepLabel(FLOW[currentIndex], currentIndex) + ')';

      stepsEl.innerHTML = '';
      FLOW.forEach(function(step, index) {
        const stepEl = document.createElement('div');
        stepEl.className = 'cq-debug-step' + (index === currentIndex ? ' is-current' : '');
        stepEl.setAttribute('data-step-index', index);
        
        stepEl.innerHTML = 
          '<div class="cq-debug-step-number">' + (index + 1) + '</div>' +
          '<div class="cq-debug-step-info">' +
            '<div class="cq-debug-step-type">' + step.type + '</div>' +
            '<div class="cq-debug-step-label">' + escapeHtml(getStepLabel(step, index)) + '</div>' +
          '</div>';
        
        stepEl.addEventListener('click', function() {
          const targetIndex = parseInt(this.getAttribute('data-step-index'), 10);
          if (targetIndex >= 0 && targetIndex < FLOW.length) {
            state.stepIndex = targetIndex;
            renderStep();
            closeDebugModal();
          }
        });
        
        stepsEl.appendChild(stepEl);
      });
    }

    // Open debug modal
    function openDebugModal() {
      let modal = document.getElementById('cq-debug-modal');
      if (!modal) {
        modal = createDebugModal();
        
        // Set up event handlers once
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            closeDebugModal();
          }
        });
        
        const closeBtn = document.getElementById('cq-debug-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', closeDebugModal);
        }
      }
      
      modal.classList.add('is-open');
      renderDebugSteps();
    }

    // Close debug modal
    function closeDebugModal() {
      const modal = document.getElementById('cq-debug-modal');
      if (modal) {
        modal.classList.remove('is-open');
      }
    }

    // Keyboard shortcut handler
    document.addEventListener('keydown', function(e) {
      // Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const modal = document.getElementById('cq-debug-modal');
        if (modal && modal.classList.contains('is-open')) {
          closeDebugModal();
        } else {
          openDebugModal();
        }
      }
      // ESC to close
      if (e.key === 'Escape') {
        closeDebugModal();
      }
    });

    // Floating button click handler
    const debugButton = document.getElementById('cq-debug-button');
    if (debugButton) {
      debugButton.addEventListener('click', function() {
        const modal = document.getElementById('cq-debug-modal');
        if (modal && modal.classList.contains('is-open')) {
          closeDebugModal();
        } else {
          openDebugModal();
        }
      });
    }

  updateProgressBar();
  renderStep();
})();
