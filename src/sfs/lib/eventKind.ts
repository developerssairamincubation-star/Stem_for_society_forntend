/**
 * The platform's event records carry an audience (for example "Undergraduate") but no event type. A label is only shown when the
 * event's own title says what it is; otherwise it is the neutral "Event", so nothing is ever mislabelled.
 */
const KINDS: [RegExp, string][] = [
  [/webinar/i, 'Webinar'],
  [/workshop/i, 'Workshop'],
  [/expert|masterclass|talk|fireside/i, 'Expert Session'],
  [/industry (interaction|visit|connect)/i, 'Industry Interaction'],
  [/bootcamp|programme|program|course|training|certificate|sprint/i, 'Training Programme'],
]

export const eventKind = (title: string) => KINDS.find(([re]) => re.test(title))?.[1] ?? 'Event'
