// lib/scoring.ts
export type Persona =
  | 'City Visionary'
  | 'Adventurous Scholar'
  | 'Dynamic Explorer'
  | 'Creative Innovator'
  | 'Focused Scholar'
  | 'Balanced Adventurer'
  | 'Nature-Loving Learner'
  | 'Mindful Learner';

export const TIE_BREAK_ORDER: Persona[] = [
  'City Visionary',
  'Adventurous Scholar',
  'Dynamic Explorer',
  'Creative Innovator',
  'Focused Scholar',
  'Balanced Adventurer',
  'Nature-Loving Learner',
  'Mindful Learner',
];

/**
 * answers is an object like:
 * {
 *   q1: 'Kangaroo Jumper',               // examples
 *   q2: 'Endless Gold',
 *   q3: 'All Work, No Play',
 *   q4: 'Big and Creative City Life',
 *   q5: 'City Explorer',
 *   q6: 'Top 100 or bust!',
 *   q7: 'Power Up Your Knowledge and Enter the Arena'
 * }
 */
export type Answers = Record<string, string>;

// Map each possible answer text to the personas it supports (+1 point)
const WEIGHTS: Record<string, Persona[] | undefined> = {
  // q1 Wild Partner
  'Kangaroo Jumper': ['City Visionary','Balanced Adventurer'],
  'Crocodile Survivor': ['Adventurous Scholar','Dynamic Explorer'],
  'Koala Chill': ['Mindful Learner','Focused Scholar'],
  'Wombat Wanderer': ['Nature-Loving Learner','Balanced Adventurer'],
  'Platypus Explorer': ['Creative Innovator'],

  // q2 Treasure
  'Endless Gold': ['City Visionary','Adventurous Scholar'],
  'Treasure Trove': ['Adventurous Scholar','Creative Innovator'],
  'Well-Stocked': ['Dynamic Explorer','Balanced Adventurer','Creative Innovator'],
  'Small Fortune': ['Mindful Learner','Nature-Loving Learner'],

  // q3 Fun Balance
  'All Work, No Play': ['City Visionary','Focused Scholar'],
  'Balanced Adventurer': ['Adventurous Scholar','Creative Innovator'],
  'Party Expert': ['Dynamic Explorer'],
  'Relaxed Scholar': ['Mindful Learner','Nature-Loving Learner'],

  // q4 Basecamp
  'Big and Creative City Life': ['City Visionary','Creative Innovator'],
  'Fast-Paced and Exciting': ['Adventurous Scholar','Dynamic Explorer'],
  'Quiet and Relaxed': ['Focused Scholar','Mindful Learner'],
  'A Mix of City and Nature': ['Balanced Adventurer','Nature-Loving Learner'],

  // q5 Downtime
  'City Explorer': ['City Visionary','Creative Innovator'],
  'Surf the Waves': ['Adventurous Scholar','Dynamic Explorer','Balanced Adventurer'],
  'Hike the Outback': ['Focused Scholar','Mindful Learner','Nature-Loving Learner'],
  'Wildlife Watcher': ['Nature-Loving Learner','Mindful Learner'],

  // q6 Ranking
  'Top 100 or bust!': ['City Visionary','Adventurous Scholar'],
  'Top 200 works for me': ['Dynamic Explorer','Nature-Loving Learner'],
  'It’s all about the program': ['Creative Innovator','Balanced Adventurer'],
  'Who cares about rankings?': ['Mindful Learner'],

  // q7 After graduation
  'Power Up Your Knowledge and Enter the Arena': ['City Visionary','Adventurous Scholar'],
  'Embark on a World Tour': ['Dynamic Explorer','Mindful Learner','Creative Innovator'],
  'Enter the Arena': ['Focused Scholar','Balanced Adventurer'],
  'Build Your Own Path': ['Nature-Loving Learner','Creative Innovator','Balanced Adventurer'],
  'Power Up Your Knowledge': ['Adventurous Scholar'], // if you also use this short label
};

export function computePersona(answers: Answers): Persona {
  const score: Record<Persona, number> = Object.fromEntries(
    TIE_BREAK_ORDER.map(p => [p, 0])
  ) as Record<Persona, number>;

  // +1 for each matched persona per question
  Object.values(answers).forEach(val => {
    const personas = WEIGHTS[val];
    personas?.forEach(p => { score[p] += 1; });
  });

  // pick max with tie-breaker
  let best: Persona = TIE_BREAK_ORDER[0];
  for (const p of TIE_BREAK_ORDER) {
    if (
      score[p] > score[best] ||
      (score[p] === score[best] && TIE_BREAK_ORDER.indexOf(p) < TIE_BREAK_ORDER.indexOf(best))
    ) best = p;
  }
  return best;
}
