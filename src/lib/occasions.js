import { OCCASIONS } from './constants'
import { uid } from './format'

export function slugOccasion(label = '') {
  const slug = String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
  return slug || uid('occ')
}

export function allOccasions(custom = []) {
  const extras = (custom || []).filter((item) => item?.value && !OCCASIONS.some((o) => o.value === item.value))
  return [
    ...OCCASIONS,
    ...extras.map((item) => ({
      value: item.value,
      label: item.label || item.value,
      template: item.template || '',
    })),
  ]
}

export function findOccasion(type, custom = []) {
  return allOccasions(custom).find((item) => item.value === type)
}
