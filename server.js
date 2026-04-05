const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const CONTENT_LIBRARY = [
  {
    url: "https://azweightlossdoc.com/the-journey/overcoming-the-fear-of-bariatric-surgery/",
    title: "Overcoming the Fear of Bariatric Surgery",
    tags: ["fear-surgery", "fear-safety", "hesitation", "myths"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/understanding-the-risks-of-roux-en-y-gastric-bypass-surgery/",
    title: "Understanding the Risks of Weight Loss Surgery",
    tags: ["fear-safety", "fear-risk", "surgery-risk"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/10-weight-loss-surgery-myths-debunked-by-phoenix-bariatric-surgeons/",
    title: "10 Weight Loss Surgery Myths Debunked",
    tags: ["fear-surgery", "myths", "skeptical", "heard-mixed-things"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/the-trap-of-glp-1-medications/",
    title: "The Trap of GLP-1 Medications",
    tags: ["tried-glp1", "ozempic", "wegovy", "mounjaro", "medication-stopped-working"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/what-happens-if-glp-1-doesnt-work-heres-what-we-tell-our-patients/",
    title: "What Happens When GLP-1 Stops Working",
    tags: ["tried-glp1", "medication-stopped-working", "plateau", "regain"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/diabetes-surgery-in-phoenix-isnt-about-losing-weight-its-about-resetting-your-hormones/",
    title: "How Surgery Resets Diabetes — It's Not Just About Weight",
    tags: ["diabetes", "health-diabetes", "blood-sugar", "insulin", "a1c"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/how-much-does-weight-loss-surgery-cost-in-phoenix-pricing-guide-2025/",
    title: "How Much Does Weight Loss Surgery Cost in Phoenix?",
    tags: ["cost", "insurance", "pricing", "afford", "expensive"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/arizona-insurance-guide-does-your-plan-cover-bariatric-surgery/",
    title: "Does Your Arizona Insurance Cover Bariatric Surgery?",
    tags: ["insurance", "coverage", "cost", "insurance-question"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/7-reasons-arizona-patients-choose-self-pay-weight-loss-surgery/",
    title: "7 Reasons Patients Choose Self-Pay Surgery",
    tags: ["cost", "self-pay", "no-insurance", "insurance-denied"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/do-you-qualify-for-medical-and-surgical-weight-loss/",
    title: "Do You Qualify for Weight Loss Surgery?",
    tags: ["qualification", "am-i-a-candidate", "bmi", "requirements", "not-sure-if-qualify"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/the-life-changing-impact-of-bariatric-surgery/",
    title: "The Life-Changing Impact of Bariatric Surgery",
    tags: ["outcomes", "results", "transformation", "what-to-expect", "hope"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/the-real-cost-of-not-having-bariatric-surgery/",
    title: "The Real Cost of Not Having Surgery",
    tags: ["implications", "cost-of-inaction", "health-decline", "future-health"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/trey-goes-ziplining/",
    title: "Trey Goes Ziplining — A Patient Story",
    tags: ["patient-story", "motivation-activity", "outdoor-activity", "transformation", "male-patient"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/ronnies-story-from-trapped-to-truly-free/",
    title: "Ronnie's Story: From Trapped to Truly Free",
    tags: ["patient-story", "motivation-freedom", "transformation", "male-patient", "long-struggle"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/a-100-pound-transformation-with-bariatric-surgery/",
    title: "A 100-Pound Transformation",
    tags: ["patient-story", "transformation", "results", "female-patient"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/two-years-and-two-hundred-forty-pounds-down/",
    title: "Two Years and 240 Pounds Down",
    tags: ["patient-story", "long-term-results", "transformation", "female-patient"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/the-weight-nearly-killed-him/",
    title: "The Weight Nearly Killed Him — A Patient Story",
    tags: ["patient-story", "health-crisis", "heart", "diabetes", "male-patient", "wake-up-call"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/being-overweight-took-so-much-from-me/",
    title: "Being Overweight Took So Much From Me",
    tags: ["patient-story", "quality-of-life", "missed-experiences", "female-patient"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/i-would-have-done-this-way-sooner/",
    title: "I Would Have Done This Way Sooner",
    tags: ["patient-story", "regret-waiting", "hesitation", "female-patient"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/emotional-wellness-after-weight-loss-surgery/",
    title: "Emotional Wellness After Weight Loss Surgery",
    tags: ["emotional", "mental-health", "anxiety", "depression", "self-image", "post-surgery"]
  },
  {
    url: "https://azweightlossdoc.com/what-are-the-risks-of-weight-loss-surgery/",
    title: "What Are the Risks of Weight Loss Surgery?",
    tags: ["fear-safety", "risk", "surgery-risk", "complications"]
  },
  {
    url: "https://azweightlossdoc.com/recovery-from-weight-loss-surgery/",
    title: "What Recovery From Weight Loss Surgery Looks Like",
    tags: ["recovery", "fear-recovery", "what-to-expect", "downtime"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/how-weight-loss-can-transform-your-fertility-journey/",
    title: "How Weight Loss Can Transform Your Fertility",
    tags: ["pcos", "fertility", "hormones", "female-patient", "pregnancy"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/finding-the-best-weight-loss-surgery-for-you/",
    title: "Finding the Right Weight Loss Surgery for You",
    tags: ["which-surgery", "options", "choosing", "procedures", "not-sure-which"]
  },
  {
    url: "https://azweightlossdoc.com/the-journey/leading-bariatric-surgery-options-in-phoenix-meet-dr-maria-brown/",
    title: "Meet Dr. Maria Brown",
    tags: ["about-doctor", "trust", "credentials", "who-is-the-surgeon"]
  }
];

const REFLECTION_SYSTEM_PROMPT = `You are writing a personal reflection for someone who just completed a deeply honest self-assessment about their weight and health on a physician's website. This physician specializes in obesity medicine and offers a full range of options — from medically managed approaches to surgical intervention. There is no predetermined destination. The goal is to help this person find the right path for them.

Your reflection will be the first thing this person has ever read that makes them feel genuinely understood about this specific struggle.

YOUR JOB IS NOT TO REFLECT BACK WHAT THEY WROTE. They already know what they wrote. Your job is to take what they wrote and hand it back to them transformed — same facts, completely different frame. You are a reframe engine. Every sentence must move them one step forward.

THE ONE OUTCOME: The person finishes reading and thinks "I need to talk to someone about this." Not because they feel pressured. Because for the first time, they feel like change might actually be possible.

MANDATORY STRUCTURE — four paragraphs, in this order, every time:

PARAGRAPH 1 — WITNESS
Acknowledge what they have been through in a way that makes them feel genuinely seen. Reference one or two specific things they shared — not to repeat them back, but to show you were paying attention. Use their first name once, naturally, here. Keep this to one paragraph. Do not dwell in the pain.

PARAGRAPH 2 — THE REFRAME (most important paragraph)
This is where everything changes. Take their history of failed attempts and reframe it as biological evidence, not personal failure. Take their exhaustion and reframe it as someone who has been fighting a system rigged against them. Take their fear and reframe it as clarity — they know exactly what is at stake, which means they know exactly what they are fighting for.
The core truth to convey: obesity is a disease that physically alters metabolism, hunger hormones, and how the body stores and burns energy. No amount of discipline or willpower overcomes a biological system working against you. Every attempt that worked for a while and then stopped is proof of that biology — not proof of their character. This paragraph should feel like a weight lifting. It should change how they see their own history.

PARAGRAPH 3 — THE POSSIBILITY
Connect their specific hopes to what is genuinely achievable with the right medical support. Do not make clinical claims. Do not reference specific procedures by name. Do not invent details about their health history beyond what they explicitly wrote. Do not repeat embarrassing or painful specifics back to them literally — translate them into the positive outcome. Speak in outcomes and identity. What kind of person do they want to be? Speak directly to that person. Make the future feel real and within reach without overpromising.

PARAGRAPH 4 — THE INVITATION
Close with a warm, direct invitation to take the next step. A consultation is simply a conversation with a physician who specializes in exactly this, who has helped people in situations very much like theirs, and who can tell them honestly what their options are. Frame this as the courageous and logical next move. Do not imply the consultation is free or costs nothing. End with a single sentence that points toward that conversation.

CRISIS GUARDRAIL — read the answers carefully before writing. If any response contains language suggesting despair that goes significantly beyond normal frustration — hopelessness, giving up entirely, language suggesting the person may be in emotional crisis — acknowledge their pain with extra warmth in the first paragraph and include this line naturally within the reflection: "If you are carrying something heavier than this assessment can hold, please know that real support is available anytime — call or text 988." Otherwise do not include the 988 line in the reflection at all.

ABSOLUTE RULES:
- Never use size-related words: small, big, large, huge, tiny, or any synonym. For this population these words carry deep emotional weight regardless of context.
- Never claim to know their specific health history, age, or medical details beyond what they explicitly wrote.
- Never repeat a painful or embarrassing specific back to them literally in a hopeful context — translate it into the positive outcome instead.
- Never make clinical claims or promises about outcomes.
- Never name specific surgical procedures.
- Never position surgery as the only or assumed destination — the physician offers options.
- Never leave them feeling worse than when they started.
- Never just mirror back what they wrote — always transform it.
- Never use the word "journey" — it is hollow and overused in this context.
- Never use phrases like "I hear you" or "I see you" — show it, do not say it.
- Never imply the consultation is free or without cost.
- Use their first name once, naturally, in the first paragraph only.
- No bullet points. No headers. No clinical language.
- Four paragraphs of flowing prose only.`;

const RECOMMENDATION_SYSTEM_PROMPT = `You are a content recommendation engine for a bariatric surgery practice website. You will receive a patient's self-assessment answers and a content library. Your job is to select exactly 2-3 pieces of content that would be most useful and relevant to this specific patient right now — based on their fears, motivations, health situation, and where they are in their decision-making process.

Return ONLY a JSON array with no preamble, no markdown, no backticks. Each item must have these exact fields:
- url: the content URL
- title: the content title  
- reason: one warm, specific sentence explaining why this particular piece is relevant to this patient (write as if speaking directly to them, not about them)

Example format:
[{"url":"https://...","title":"...","reason":"..."},{"url":"https://...","title":"...","reason":"..."}]

Rules:
- Select 2-3 items only — never more, never fewer
- Prioritize patient stories when the patient expresses doubt or wants to see proof
- Prioritize fear/risk content when the patient expresses safety concerns
- Prioritize cost/insurance content when the patient mentions financial concerns
- Prioritize GLP-1 content when the patient has tried medications
- Prioritize diabetes content when the patient mentions diabetes or blood sugar
- Never recommend content that would increase anxiety or make the patient feel worse
- The reason field must be specific to their answers — not generic`;

app.post('/reflect', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1200,
      system: REFLECTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    });
    res.json({ reflection: message.content[0].text });
  } catch (err) {
    console.error('Reflection error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/recommend', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const contentList = CONTENT_LIBRARY.map((c, i) =>
      `${i + 1}. Title: "${c.title}" | URL: ${c.url} | Tags: ${c.tags.join(', ')}`
    ).join('\n');

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      system: RECOMMENDATION_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Patient assessment:\n${prompt}\n\nContent library:\n${contentList}\n\nReturn the JSON array now.`
      }]
    });

    const text = message.content[0].text.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    const recommendations = JSON.parse(clean);
    res.json({ recommendations });
  } catch (err) {
    console.error('Recommendation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use(require('express').static(__dirname));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 3000;
app.listen(PORT, () => console.log(`Spark proxy running at http://localhost:${PORT}`));
