export interface AssessmentItem {
  id: string;
  text: string;
  factor: string;
  keying: '+' | '-';
}

export const assessmentItems: AssessmentItem[] = [
  // OPENNESS TO EXPERIENCE (12 items)
  { id: "Q001", text: "I actively seek new approaches to improve work processes.", factor: "openness", keying: "+" },
  { id: "Q002", text: "I prefer sticking with proven methods over experimenting.", factor: "openness", keying: "-" },
  { id: "Q003", text: "I enjoy exploring unconventional solutions to problems.", factor: "openness", keying: "+" },
  { id: "Q004", text: "I find comfort in following established procedures.", factor: "openness", keying: "-" },
  { id: "Q005", text: "I'm curious about learning skills outside my expertise.", factor: "openness", keying: "+" },
  { id: "Q006", text: "I avoid taking on projects that require new approaches.", factor: "openness", keying: "-" },
  { id: "Q007", text: "I propose creative ideas during team brainstorming sessions.", factor: "openness", keying: "+" },
  { id: "Q008", text: "I'm skeptical of unproven methods and theories.", factor: "openness", keying: "-" },
  { id: "Q009", text: "I adapt quickly when facing unexpected challenges.", factor: "openness", keying: "+" },
  { id: "Q010", text: "I feel uneasy when routines are disrupted.", factor: "openness", keying: "-" },
  { id: "Q011", text: "I seek out diverse perspectives before making decisions.", factor: "openness", keying: "+" },
  { id: "Q012", text: "I prefer clear guidelines over open-ended assignments.", factor: "openness", keying: "-" },

  // CONSCIENTIOUSNESS (12 items)
  { id: "Q013", text: "I create detailed plans before starting major projects.", factor: "conscientiousness", keying: "+" },
  { id: "Q014", text: "I often start tasks without much planning.", factor: "conscientiousness", keying: "-" },
  { id: "Q015", text: "I meet deadlines consistently without last-minute rushing.", factor: "conscientiousness", keying: "+" },
  { id: "Q016", text: "I frequently need deadline extensions to complete work.", factor: "conscientiousness", keying: "-" },
  { id: "Q017", text: "I maintain organized systems for tracking my tasks.", factor: "conscientiousness", keying: "+" },
  { id: "Q018", text: "My workspace tends to be cluttered and disorganized.", factor: "conscientiousness", keying: "-" },
  { id: "Q019", text: "I double-check my work for accuracy before submitting.", factor: "conscientiousness", keying: "+" },
  { id: "Q020", text: "I overlook minor details when completing assignments.", factor: "conscientiousness", keying: "-" },
  { id: "Q021", text: "I follow through on commitments I make to colleagues.", factor: "conscientiousness", keying: "+" },
  { id: "Q022", text: "I sometimes forget to complete tasks I've agreed to.", factor: "conscientiousness", keying: "-" },
  { id: "Q023", text: "I set clear goals and monitor my progress toward them.", factor: "conscientiousness", keying: "+" },
  { id: "Q024", text: "I work more effectively under time pressure than planning ahead.", factor: "conscientiousness", keying: "-" },

  // EXTRAVERSION (12 items)
  { id: "Q025", text: "I feel energized after collaborating with colleagues.", factor: "extraversion", keying: "+" },
  { id: "Q026", text: "I prefer working alone to recharge my energy.", factor: "extraversion", keying: "-" },
  { id: "Q027", text: "I actively participate in team discussions and meetings.", factor: "extraversion", keying: "+" },
  { id: "Q028", text: "I listen more than I speak in group settings.", factor: "extraversion", keying: "-" },
  { id: "Q029", text: "I enjoy networking and meeting new professional contacts.", factor: "extraversion", keying: "+" },
  { id: "Q030", text: "I find large social gatherings draining.", factor: "extraversion", keying: "-" },
  { id: "Q031", text: "I volunteer to lead presentations or facilitate meetings.", factor: "extraversion", keying: "+" },
  { id: "Q032", text: "I prefer written communication over face-to-face interaction.", factor: "extraversion", keying: "-" },
  { id: "Q033", text: "I thrive in fast-paced, dynamic work environments.", factor: "extraversion", keying: "+" },
  { id: "Q034", text: "I need quiet, uninterrupted time to do my best work.", factor: "extraversion", keying: "-" },
  { id: "Q035", text: "I readily share my ideas and opinions with the team.", factor: "extraversion", keying: "+" },
  { id: "Q036", text: "I reflect privately before sharing my thoughts publicly.", factor: "extraversion", keying: "-" },

  // AGREEABLENESS (12 items)
  { id: "Q037", text: "I prioritize team harmony when conflicts arise.", factor: "agreeableness", keying: "+" },
  { id: "Q038", text: "I directly challenge ideas I disagree with.", factor: "agreeableness", keying: "-" },
  { id: "Q039", text: "I go out of my way to help colleagues succeed.", factor: "agreeableness", keying: "+" },
  { id: "Q040", text: "I focus on my own goals rather than supporting others.", factor: "agreeableness", keying: "-" },
  { id: "Q041", text: "I consider how my decisions affect my teammates.", factor: "agreeableness", keying: "+" },
  { id: "Q042", text: "I make decisions based primarily on logic, not feelings.", factor: "agreeableness", keying: "-" },
  { id: "Q043", text: "I actively listen to understand others' perspectives.", factor: "agreeableness", keying: "+" },
  { id: "Q044", text: "I become impatient when others work slowly.", factor: "agreeableness", keying: "-" },
  { id: "Q045", text: "I trust my colleagues' intentions and competence.", factor: "agreeableness", keying: "+" },
  { id: "Q046", text: "I prefer to verify others' work rather than assume it's correct.", factor: "agreeableness", keying: "-" },
  { id: "Q047", text: "I compromise to reach solutions everyone can accept.", factor: "agreeableness", keying: "+" },
  { id: "Q048", text: "I advocate firmly for my position in disagreements.", factor: "agreeableness", keying: "-" },

  // EMOTIONAL STABILITY (12 items)
  { id: "Q049", text: "I remain calm when facing unexpected obstacles.", factor: "stability", keying: "+" },
  { id: "Q050", text: "I feel anxious when plans change suddenly.", factor: "stability", keying: "-" },
  { id: "Q051", text: "I handle criticism constructively without becoming defensive.", factor: "stability", keying: "+" },
  { id: "Q052", text: "Negative feedback affects my mood for the rest of the day.", factor: "stability", keying: "-" },
  { id: "Q053", text: "I maintain focus during high-pressure situations.", factor: "stability", keying: "+" },
  { id: "Q054", text: "I feel overwhelmed when juggling multiple deadlines.", factor: "stability", keying: "-" },
  { id: "Q055", text: "I bounce back quickly from setbacks or failures.", factor: "stability", keying: "+" },
  { id: "Q056", text: "I dwell on mistakes I've made at work.", factor: "stability", keying: "-" },
  { id: "Q057", text: "I stay positive even when projects face challenges.", factor: "stability", keying: "+" },
  { id: "Q058", text: "I worry about things that might go wrong.", factor: "stability", keying: "-" },
  { id: "Q059", text: "I manage stress through healthy coping strategies.", factor: "stability", keying: "+" },
  { id: "Q060", text: "I find it hard to relax after a difficult workday.", factor: "stability", keying: "-" },
];

export const factorInfo = {
  openness: {
    name: "Openness to Experience",
    icon: "🎨",
    description: "Your tendency to seek out new experiences, embrace creativity, and think abstractly.",
  },
  conscientiousness: {
    name: "Conscientiousness",
    icon: "📋",
    description: "Your organizational skills, reliability, and commitment to achieving goals.",
  },
  extraversion: {
    name: "Extraversion",
    icon: "⚡",
    description: "Your energy source, sociability, and preference for interaction vs. solitude.",
  },
  agreeableness: {
    name: "Agreeableness",
    icon: "🤝",
    description: "Your cooperativeness, empathy, and approach to interpersonal relationships.",
  },
  stability: {
    name: "Emotional Stability",
    icon: "🧘",
    description: "Your resilience, stress management, and emotional composure under pressure.",
  },
};
