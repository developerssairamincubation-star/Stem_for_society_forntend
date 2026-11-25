import { describe, expect, it } from 'vitest'
import { trainingPlans } from './trainingPlans'

describe('training plans', () => {
  it('has the four plans in order with the agreed skill counts, durations and levels', () => {
    expect(trainingPlans.map((p) => [p.category, p.title, p.skills.length, p.duration, p.level])).toEqual([
      ['Plan 1', 'Foundation', 6, '3 Months', 'Basic to Beginner'],
      ['Plan 2', 'Career Launch', 7, '4 Months', 'Beginner to Intermediate'],
      ['Plan 3', 'Leadership & Thinking', 6, '4 Months', 'Intermediate'],
      ['Plan 4', 'Innovator & Entrepreneur', 5, '4 Months', 'Advanced'],
    ])
  })

  it('covers 24 distinct skills and gives every plan its own image', () => {
    const skills = trainingPlans.flatMap((p) => p.skills)
    expect(skills).toHaveLength(24)
    expect(new Set(skills).size).toBe(24)
    expect(new Set(trainingPlans.map((p) => p.image)).size).toBe(4)
  })
})
