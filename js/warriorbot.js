/*
  WarriorBot AI (v2) — Beautiful, effective ChatGPT-powered assistant for sickle cell support
  - Floating bubble, elegant chat panel (light/dark)
  - Triage chips: Crisis, Encouragement, Hydroxyurea, Gene therapy, Nigeria clinics
  - Uses serverless proxy at /api/warriorbot (set OPENAI_API_KEY on host)
  - Accessibility-first, mobile-friendly
*/

class WarriorBot {
  constructor() {
    this.history = [];
    this.render();
    this.bind();
    setTimeout(() => this.bot("Hi warrior! I’m here 24/7 — how can I support you today?"), 500);
  }

  render() {
    const html = `
      <div id="warriorbot" class="wb wb-closed" aria-live="polite">
        <button class="wb-fab" id="wb-fab" aria-label="Open WarriorBot chat" title="Chat with WarriorBot">
          <span class="wb-fab-pulse" aria-hidden="true"></span>
          <span class="wb-neo-icon" aria-hidden="true">
            <span class="wb-moon"></span>
            <span class="wb-robot">
              <span class="wb-antenna"></span>
              <span class="wb-eye left"></span>
              <span class="wb-eye right"></span>
              <span class="wb-mouth"></span>
            </span>
          </span>
        </button>
        <section class="wb-panel" role="dialog" aria-label="WarriorBot chat" aria-modal="false">
          <header class="wb-head">
            <div class="wb-brand">
              <div class="wb-title">
                <h3>WarriorBot AI</h3>
                <p>Premier Sickle Cell Support • 24/7</p>
              </div>
            </div>
            <button class="wb-close" id="wb-close" aria-label="Close chat">×</button>
          </header>
          <div class="wb-body" id="wb-body"></div>
          <div class="wb-quick" id="wb-quick"></div>
          <footer class="wb-foot">
            <input id="wb-input" class="wb-input" type="text" maxlength="600" placeholder="Type your message…" aria-label="Message input" />
            <button id="wb-send" class="wb-send" aria-label="Send message">Send</button>
          </footer>
        </section>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    this.injectStyles();
    // Fallback inline style in case CSS fails to load
    const fab = document.getElementById('wb-fab');
    const root = document.getElementById('warriorbot');
    if (root) root.style.zIndex = '2147483647';
    if (fab) {
      fab.style.cssText += 'position:fixed;bottom:20px;right:20px;z-index:2147483647;display:flex;align-items:center;justify-content:center;';
    }

    // Build quick chips
    const quick = document.getElementById('wb-quick');
    const chips = [
      { k: 'crisis', t: '🚨 Crisis Help' },
      { k: 'encourage', t: '💜 Encouragement' },
      { k: 'hydroxyurea', t: '💊 Hydroxyurea' },
      { k: 'gene', t: '🧬 Gene Therapy' },
      { k: 'clinics', t: '🏥 Clinics (NG)' }
    ];
    quick.innerHTML = chips.map(c => `<button class="wb-chip" data-k="${c.k}">${c.t}</button>`).join('');
  }

  bind() {
    const fab = document.getElementById('wb-fab');
    const close = document.getElementById('wb-close');
    const send = document.getElementById('wb-send');
    const input = document.getElementById('wb-input');

    fab.addEventListener('click', () => this.toggle(true));
    close.addEventListener('click', () => this.toggle(false));
    send.addEventListener('click', () => this.send());
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); } });

    document.querySelectorAll('.wb-chip').forEach(b => b.addEventListener('click', () => this.quick(b.dataset.k)));
  }

  toggle(open) {
    const root = document.getElementById('warriorbot');
    const isOpen = open !== undefined ? open : root.classList.contains('wb-closed');
    root.classList.toggle('wb-open', isOpen);
    root.classList.toggle('wb-closed', !isOpen);
    if (isOpen) document.getElementById('wb-input').focus();
  }

  user(text) { this.add('user', text); }
  bot(text) { this.add('bot', text); }

  add(role, text) {
    const body = document.getElementById('wb-body');
    const el = document.createElement('div');
    el.className = `wb-msg wb-${role}`;
    el.innerHTML = this.format(text);
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    this.history.push({ sender: role === 'user' ? 'user' : 'bot', message: text });
    if (this.history.length > 24) this.history = this.history.slice(-24);
  }

  typing(show = true) {
    const body = document.getElementById('wb-body');
    let t = document.getElementById('wb-typing');
    if (show) {
      if (t) return;
      t = document.createElement('div');
      t.id = 'wb-typing';
      t.className = 'wb-typing';
      t.innerHTML = `<span>WarriorBot is thinking</span><i></i><i></i><i></i>`;
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
    } else if (t) t.remove();
  }

  format(t) {
    return t
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  send() {
    const input = document.getElementById('wb-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.user(text);
    this.route(text);
  }

  quick(k) {
    const map = {
      crisis: "I'm having a pain crisis. Give me immediate steps and when to go to ER.",
      encourage: "I need encouragement and a short Bible verse.",
      hydroxyurea: "Explain hydroxyurea and common questions in simple terms.",
      gene: "What is the latest on gene therapy for sickle cell?",
      clinics: "I’m in Nigeria — help me find sickle cell clinics near me."
    };
    const msg = map[k];
    this.user(msg);
    this.route(msg);
  }

  async route(message) {
    // Crisis fast-path notice
    const crisis = ['crisis', 'emergency', "can't breathe", 'chest pain', 'stroke', 'severe pain'];
    if (crisis.some(w => message.toLowerCase().includes(w))) {
      this.bot("🚨 If you’re in severe distress, call emergency services now.\n\nAt home: heat on painful areas, hydrate steadily, take prescribed meds, deep breathing (in 4, hold 4, out 4).\nGo to ER if pain 8/10+, fever >101°F/38.3°C, chest pain, breathing trouble, or stroke signs.");
    }
    await this.askOpenAI(message);
  }

  getApiEndpoint() {
    const meta = document.querySelector('meta[name="warriorbot-endpoint"]');
    if (meta && meta.content) return meta.content;
    if (window.WARRIORBOT_API) return window.WARRIORBOT_API;
    return '/api/warriorbot';
  }

  async localFallback(userMessage) {
    try {
      if (window.WarriorBotAI) {
        const ai = new window.WarriorBotAI();
        if (ai.initialize) await ai.initialize();
        const resp = await ai.generateResponse(userMessage, this.history.slice(-8));
        return resp;
      }
      if (window.EnhancedWarriorBotAI) {
        const ai2 = new window.EnhancedWarriorBotAI();
        const resp2 = await ai2.generateEnhancedResponse(userMessage, {});
        return resp2;
      }
    } catch (err) { console.warn('Local fallback failed', err); }

    const prefix = "😅 My superpowered AI brain is not available right now — but don’t worry, Dante made me smart!\n\n";
    const m = userMessage.toLowerCase();
    if (m.includes('crisis') || m.includes("can't breathe") || m.includes('emergency')) {
      return prefix + "🚨 Immediate Crisis Support\n\n1) Call emergency services if pain is 8/10+, fever >101°F/38.3°C, chest pain, breathing trouble, or stroke signs.\n2) At home: apply gentle heat, hydrate steadily (sips every 5–10 min), take prescribed meds, do slow deep breathing (in 4, hold 4, out 4).\n3) Pack an ER bag (ID, meds list, prior records).\n\nRed flags: chest pain, confusion, one-sided weakness, severe belly swelling, priapism >2 hrs.\n\nYou’re not alone — what symptoms are you feeling right now?";
    }
    if (m.includes('encourage') || m.includes('encouragement') || m.includes('hope')) {
      return prefix + "💜 You are a mighty warrior. Your courage in the unseen battles is real and admirable.\n\n‘Those who hope in the Lord will renew their strength; they will soar on wings like eagles.’ – Isaiah 40:31\n\nTry a 60‑second reset: breathe in hope 4s, hold 4s, breathe out tension 6s. Name one small win from today — I’m celebrating it with you. 🦅";
    }
    if (m.includes('hydroxyurea') || m.includes('hydrox')) {
      return prefix + "💊 Hydroxyurea (Droxia/Siklos) overview\n\nHow it helps: raises fetal hemoglobin (HbF), reduces sickling, fewer crises/hospitalizations, may lower transfusion needs.\nWhat to expect: daily pill, labs every 4–8 weeks at start, benefits build over 3–6 months.\nCommon Qs: it’s not a cure, side effects usually mild (mouth sores, nail changes).\nSafety: use reliable contraception; discuss pregnancy plans with your care team.\n\nGeneral info only — always follow your clinician’s guidance. What would you like to know more about?";
    }
    if (m.includes('gene') && m.includes('therapy')) {
      return prefix + "🧬 Gene therapy for SCD (high‑level)\n\nApproach: edit or boost hemoglobin genes (e.g., CRISPR) to prevent sickling.\nBenefits: many participants report dramatic crisis reduction.\nConsiderations: eligibility, conditioning (chemo), hospital stay, cost/access vary by region.\nNext steps: talk to a hematology center about trials/referrals; ask about risks, fertility, and follow‑up.\n\nI can help draft questions for your doctor. Want that?";
    }
    if (m.includes('nigeria') || m.includes('clinic') || m.includes('clinics')) {
      return prefix + "🇳🇬 SCD care centers (examples)\n• LUTH – Lagos University Teaching Hospital (Lagos)\n• UCH – University College Hospital (Ibadan)\n• UNTH – University of Nigeria Teaching Hospital (Enugu)\n• ABU Teaching Hospital (Zaria)\nTips: ask about SCD clinics/day hospitals, vaccination schedules, hydroxyurea programs, and NHIS coverage.\n\nTell me your city and I’ll try to narrow options.";
    }

    return prefix + "I'm here for you, warrior. 💜 Stay warm, hydrate, take prescribed meds, and seek urgent care for red flags (fever >101°F/38.3°C, chest pain, trouble breathing, stroke signs). You can also tap the quick chips for crisis steps, hydroxyurea, gene therapy, or clinics in Nigeria.";
  }

  async askOpenAI(userMessage) {
    this.typing(true);
    let reply = '';
    try {
      const endpoint = this.getApiEndpoint();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', system: this.systemPrompt(), history: this.history.slice(-8), message: userMessage })
      });

      // Try to parse JSON safely
      const ct = res.headers.get('content-type') || '';
      let data = null;
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text };
      }

      if (!res.ok) {
        console.warn('WarriorBot API error:', res.status, data && (data.error || data.details || data));
        // Show user the error for debugging
        this.bot(`🔧 API Error (${res.status}): ${data.error || JSON.stringify(data)}\n\nFalling back to offline mode...`);
        reply = await this.localFallback(userMessage);
      } else {
        reply = data.reply || '';
      }
    } catch (e) {
      console.error('WarriorBot API fetch failed:', e);
      // Show user the network error for debugging
      this.bot(`🔧 Network Error: ${e.message}\n\nFalling back to offline mode...`);
      reply = await this.localFallback(userMessage);
    } finally {
      this.typing(false);
    }

    this.bot(this.postProcess(reply || ''));
  }

  postProcess(txt) {
    const L = txt.toLowerCase();
    if (/(treatment|medication|hydroxy|transfusion|gene|dose|doctor|clinic)/.test(L)) {
      return txt + "\n\n*This is general information, not medical advice. Always consult your healthcare provider.*";
    }
    return txt;
  }

  systemPrompt() {
    return `You are WarriorBot, a compassionate ChatGPT assistant for people with sickle cell disease and their supporters on the We Warriors website.
STYLE:
- Warm, concise paragraphs, actionable bullet points, friendly emojis (💪🦅💜🙏) when helpful.
- Empathetic and faith-friendly when asked; never judgmental.
- Provide general information only; include emergency guidance and disclaimers for medical topics.

COVER WELL:
- Pain crisis steps + ER red flags.
- Treatments: hydroxyurea, blood transfusions, pain management, gene therapy progress.
- Daily living: hydration, warmth, triggers, exercise, stress, sleep.
- Nigeria: LUTH Lagos, UCH Ibadan, UNTH Enugu, ABU Zaria; NHIS basics.
- Encouragement: short verses/affirmations if requested.

ALWAYS end with a gentle question to continue the conversation.`;
  }

  injectStyles() {
    const s = document.createElement('style');
    s.textContent = ''
      + '.wb{position:fixed;bottom:20px;right:20px;z-index:2147483647;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-sizing:border-box;}'
      + '.wb *{box-sizing:inherit;}'
      + '.wb-fab{position:relative;width:62px;height:62px;border-radius:50%;border:none;cursor:pointer;background:radial-gradient(120% 120% at 30% 20%,#ff6b6b 0%,#c41e3a 55%,#8b0000 120%);color:#111;box-shadow:0 12px 26px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transition:transform .18s ease, filter .2s ease, box-shadow .2s ease;}'
      + '.wb-fab:hover{transform:translateY(-1px) scale(1.04);filter:brightness(1.06);box-shadow:0 16px 34px rgba(0,0,0,.45);}'
      + '.wb-fab-pulse{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(239,68,68,.45);animation:wb-pulse 2s ease-out infinite;}'
      + '@keyframes wb-pulse{0%{box-shadow:0 0 0 0 rgba(239,68,68,.45)}70%{box-shadow:0 0 0 18px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}'
      + '.wb-neo-icon{position:relative;width:28px;height:28px;display:inline-block;}'
      + '.wb-robot{position:absolute;left:0;bottom:0;width:22px;height:16px;background:rgba(255,255,255,.95);border:1px solid rgba(17,24,39,.15);border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.18) inset, 0 1px 2px rgba(255,255,255,.6);}'
      + '.wb-antenna{position:absolute;left:9px;top:-6px;width:2px;height:6px;background:rgba(255,255,255,.95);border:1px solid rgba(17,24,39,.15);border-bottom:none;border-top-left-radius:2px;border-top-right-radius:2px;box-shadow:0 1px 0 rgba(255,255,255,.6) inset;}'
      + '.wb-antenna:after{content:"";position:absolute;left:-2px;top:-5px;width:6px;height:6px;border-radius:50%;background:#64ffda;box-shadow:0 0 6px rgba(100,255,218,.8);}'
      + '.wb-eye{position:absolute;top:5px;width:4px;height:4px;border-radius:50%;background:#0ea5e9;box-shadow:0 0 6px rgba(14,165,233,.7);transform-origin:center;animation:wb-blink 4.5s infinite;}'
      + '.wb-eye.left{left:5px;}'
      + '.wb-eye.right{right:5px;animation-delay:1.1s;}'
      + '@keyframes wb-blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.08)}}'
      + '.wb-mouth{position:absolute;left:5px;right:5px;bottom:3px;height:3px;border-radius:2px;background:linear-gradient(90deg,rgba(14,165,233,.9),rgba(100,255,218,.9));box-shadow:0 0 6px rgba(14,165,233,.6);}'
      + '.wb-moon{position:absolute;right:-3px;top:-4px;width:16px;height:16px;border-radius:50%;background:#ff6b6b;box-shadow:0 0 8px rgba(244,63,94,.55);animation:wb-orbit 3.2s ease-in-out infinite alternate;}'
      + '.wb-moon:after{content:"";position:absolute;left:4px;top:1px;width:14px;height:14px;border-radius:50%;background:radial-gradient(120% 120% at 30% 20%,#ff6b6b 0%,#c41e3a 55%,#8b0000 120%);}'
      + '@keyframes wb-orbit{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-2px) rotate(8deg)}}'
      + '.wb-open .wb-panel{display:flex;}'
      + '.wb-closed .wb-panel{display:none;}'
      + '.wb-panel{position:absolute;bottom:80px;right:0;width:392px;height:620px;max-width:96vw;max-height:82vh;background:#ffffff;color:#0f172a;border:1px solid rgba(0,0,0,.06);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden;padding-top:60px;}'
      + '.wb-head{position:absolute;top:0;left:0;right:0;height:60px;display:flex;align-items:center;justify-content:center;padding:8px 46px;background:linear-gradient(135deg,#8B0000,#C41E3A);color:#fff;border-top-left-radius:18px;border-top-right-radius:18px;}'
      + '.wb-brand{display:flex;align-items:center;justify-content:center;width:100%;}'
      + '.wb-title h3{margin:0;font-weight:700;font-size:18px;line-height:1.2;letter-spacing:.2px;text-align:center;}'
      + '.wb-title p{margin:2px 0 0;font-size:12.5px;opacity:.95;text-align:center;}'
      + '.wb-close{position:absolute;top:6px;right:6px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:50%;width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
      + '.wb-body{flex:1;padding:14px 12px;overflow:auto;display:flex;flex-direction:column;gap:12px;background:linear-gradient(180deg,#ffffff 0%, #fafafa 100%);color:#0f172a;}'
      + '.wb-msg{max-width:86%;padding:12px 14px;border-radius:16px;font-size:15px;line-height:1.6;letter-spacing:.2px;word-wrap:break-word;box-shadow:0 2px 8px rgba(0,0,0,.06);}'
      + '.wb-msg a{color:#8B0000;text-decoration:underline;}'
      + '.wb-bot{align-self:flex-start;background:#f3f4f6;border:1px solid #e5e7eb;color:#0f172a;}'
      + '.wb-user{align-self:flex-end;background:linear-gradient(135deg,#8B0000,#C41E3A);color:#fff;box-shadow:0 4px 12px rgba(196,30,58,.35);}'
      + '.wb-typing{display:flex;gap:6px;align-items:center;align-self:flex-start;background:#f3f4f6;padding:10px 14px;border-radius:16px;color:#0f172a;}'
      + '.wb-typing i{width:7px;height:7px;background:#C41E3A;border-radius:50%;animation:wb-dot 1.2s infinite;opacity:.9;}'
      + '@keyframes wb-dot{0%,80%,100%{transform:scale(1);opacity:.45}40%{transform:scale(1.25);opacity:1}}'
      + '.wb-quick{display:flex;gap:8px;flex-wrap:wrap;padding:0 12px 8px;}'
      + '.wb-chip{border:1px solid rgba(139,0,0,.28);background:rgba(139,0,0,.08);color:#7a0010;border-radius:999px;padding:5px 9px;font-size:11px;cursor:pointer;backdrop-filter:saturate(120%);}'
      + '.wb-chip:hover{filter:brightness(1.05);}'
      + '.wb-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(0,0,0,.06);background:rgba(255,255,255,.9);backdrop-filter:blur(4px);}'
      + '.wb-input{flex:1;border:2px solid rgba(139,0,0,.18);border-radius:22px;padding:11px 12px;background:#ffffff;color:#0f172a;font-size:14px;}'
      + '.wb-input::placeholder{color:#6b7280;}'
      + 'html[data-theme=\"dark\"] .wb-fab{border-color:rgba(255,255,255,.16);}'
      + '.wb-send{background:linear-gradient(135deg,#8B0000,#C41E3A);color:#fff;border:none;border-radius:18px;padding:10px 14px;cursor:pointer;font-weight:700;letter-spacing:.2px;box-shadow:0 6px 14px rgba(196,30,58,.35);}'
      + '@media(max-width:480px){.wb-panel{width:86vw;height:60vh;right:7vw}}'
      + 'html[data-theme=\"dark\"] .wb-panel{background:rgba(8,10,14,.6);color:#e5e7eb;border:1px solid rgba(255,255,255,.08);box-shadow:0 22px 70px rgba(0,0,0,.6);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);}'
      + 'html[data-theme=\"dark\"] .wb-head{background:transparent!important;color:#e5e7eb;border-bottom:1px solid rgba(255,255,255,.08);box-shadow:none;}'
      + 'html[data-theme=\"dark\"] .wb-body{background:transparent;color:#e5e7eb;}'
      + 'html[data-theme=\"dark\"] .wb-msg a{color:#fda4af;}'
      + 'html[data-theme=\"dark\"] .wb-bot{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#e5e7eb;box-shadow:none;}'
      + 'html[data-theme=\"dark\"] .wb-typing{background:rgba(255,255,255,.06);color:#e5e7eb;box-shadow:none;}'
      + 'html[data-theme="dark"] .wb-typing i{background:#f87171;opacity:.95;}'
      + 'html[data-theme="dark"] .wb-chip{border:1px solid rgba(244,63,94,.5);background:rgba(244,63,94,.15);color:#ffe4e6;}'
      + 'html[data-theme=\"dark\"] .wb-input{background:#0f172a;color:#e5e7eb;border-color:#334155;}'
      + 'html[data-theme=\"dark\"] .wb-input::placeholder{color:#94a3b8;}'
      + 'html[data-theme=\"dark\"] .wb-robot{background:rgba(11,15,20,.95);border-color:rgba(255,255,255,.12);box-shadow:0 2px 6px rgba(0,0,0,.5) inset, 0 1px 2px rgba(255,255,255,.06);}'
    ;
    document.head.appendChild(s);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window.WarriorBot = new WarriorBot(); });
} else {
  window.WarriorBot = new WarriorBot();
}

