// lib/scoring.ts
import type { Answers } from './answers';

export type Persona =
  | 'City Visionary'
  | 'Adventurous Scholar'
  | 'Dynamic Explorer'
  | 'Creative Innovator'
  | 'Focused Scholar'
  | 'Balanced Adventurer'
  | 'Nature-Loving Learner'
  | 'Mindful Learner';

/** Tie-break priority (left wins on equal scores) */
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
 * Each *exact* answer text contributes +1 to one or more personas.
 * Ensure your q1–q7 pages save exactly these strings.
 */
const WEIGHTS: Record<string, readonly Persona[] | undefined> = {
  // q1 — Wild Partner
  'Kangaroo Jumper': ['City Visionary', 'Creative Innovator', 'Balanced Adventurer'],
  'Crocodile Survivor': ['Adventurous Scholar', 'Dynamic Explorer'],
  'Koala Chill': ['Focused Scholar', 'Mindful Learner'],
  'Wombat Wanderer': ['Focused Scholar', 'Balanced Adventurer', 'Nature-Loving Learner'],

  // q2 — Treasure Chest
  'Endless Gold': ['City Visionary', 'Adventurous Scholar'],
  'Treasure Trove': ['Adventurous Scholar', 'Dynamic Explorer', 'Creative Innovator'],
  'Well-Stocked': ['Dynamic Explorer', 'Creative Innovator', 'Focused Scholar', 'Balanced Adventurer'],
  'Small Fortune': ['Nature-Loving Learner', 'Mindful Learner'],

  // q3 — Fun Balance
  'All Work, No Play': ['City Visionary', 'Focused Scholar'],
  'Party Expert': ['Dynamic Explorer'],
  'Balanced Adventurer': ['Adventurous Scholar', 'Creative Innovator', 'Balanced Adventurer'],
  'Relaxed Scholar': ['Nature-Loving Learner', 'Mindful Learner'],

  // q4 — Basecamp
  'Big and Creative': ['City Visionary', 'Creative Innovator'],
  'Fast-Paced and Exciting': ['Adventurous Scholar', 'Dynamic Explorer'],
  'Quiet and Relaxed': ['Focused Scholar', 'Mindful Learner'],
  'A Mix of City and Nature': ['Balanced Adventurer', 'Nature-Loving Learner'],

  // q5 — Downtime Activity
  'City Explorer': ['City Visionary', 'Creative Innovator'],
  'Surf the Waves': ['Adventurous Scholar', 'Dynamic Explorer', 'Balanced Adventurer'],
  'Hike the Outback': ['Focused Scholar', 'Nature-Loving Learner', 'Mindful Learner'],
  'Wildlife Watcher': ['Nature-Loving Learner', 'Mindful Learner'],

  // q6 — Ranking View
  'Top 100 or bust!': ['City Visionary', 'Adventurous Scholar'],
  'Top 200 works for me': ['Dynamic Explorer', 'Balanced Adventurer', 'Nature-Loving Learner'],
  'It’s all about the program': ['Creative Innovator', 'Focused Scholar', 'Balanced Adventurer'],
  'Who cares about rankings?': ['Mindful Learner'],

  // q7 — After graduation
  // Per your rule: choosing EITHER of these should also count for City Visionary.
  'Power Up Your Knowledge': ['City Visionary', 'Adventurous Scholar'],
  'Enter the Arena': ['City Visionary', 'Focused Scholar', 'Balanced Adventurer'],
  'Build Your Own Path': ['Creative Innovator', 'Nature-Loving Learner'],
  'Embark on a World Tour': ['Dynamic Explorer', 'Creative Innovator', 'Mindful Learner'],
};

/** Compute the winning persona from stored answers. */
export function computePersona(answers: Answers): Persona {
  // init scores
  const scores: Record<Persona, number> = Object.fromEntries(
    TIE_BREAK_ORDER.map((p) => [p, 0]),
  ) as Record<Persona, number>;

  // add +1 for each matched persona per answer
  for (const val of Object.values(answers)) {
    const hit = WEIGHTS[val];
    if (!hit) continue;
    for (const p of hit) scores[p] += 1;
  }

  // pick max; break ties using TIE_BREAK_ORDER
  let best = TIE_BREAK_ORDER[0];
  for (const p of TIE_BREAK_ORDER) {
    if (
      scores[p] > scores[best] ||
      (scores[p] === scores[best] && TIE_BREAK_ORDER.indexOf(p) < TIE_BREAK_ORDER.indexOf(best))
    ) {
      best = p;
    }
  }
  return best;
}
