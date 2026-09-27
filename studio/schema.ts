import { defineType, defineField, defineArrayMember } from 'sanity'

const reviewed = defineField({ name: 'contentReviewed', title: 'Content reviewed', type: 'boolean', initialValue: false,
  description: 'Enable only after verifying facts, image rights, captions, and public links. Publishing makes content public.',
  validation: rule => rule.required().custom(value => value === true || 'Review the content before publishing. Drafts can still be saved.') })
const strings = (name: string, title: string) => defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'string' })] })
const url = (name: string, title: string) => defineField({ name, title, type: 'url', validation: rule => rule.uri({ scheme: ['https'] }) })
const image = defineType({ name: 'portfolioImage', title: 'Image', type: 'image',
  description: '4:3 frame; recommended 1600 × 1200 px. The detail gallery displays the full image.',
  validation: rule => rule.required().custom(value => value?.asset?._ref ? true : 'Upload an image.'),
  fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: rule => rule.required(), description: 'Describe what is actually visible, in English.' }),
    defineField({ name: 'caption', type: 'text', rows: 2 }),
    defineField({ name: 'fit', title: 'Preview fit', type: 'string', initialValue: 'contain', options: { list: [{ title: 'Full image (recommended)', value: 'contain' }, { title: 'Fill preview / crop edges', value: 'cover' }] }, validation: rule => rule.required() }),
  ],
})
const common = [
  defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, description: 'Stable page address. Changing this breaks old links.', validation: rule => rule.required().custom(value => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) || 'Use lowercase words separated by hyphens.') }),
  defineField({ name: 'category', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'summary', type: 'text', rows: 3, validation: rule => rule.required() }),
  defineField({ name: 'cover', type: 'portfolioImage', validation: rule => rule.required() }),
  defineField({ name: 'gallery', type: 'array', of: [defineArrayMember({ type: 'portfolioImage' })], description: 'Additional images. The cover is automatically first; drag to reorder.' }),
  defineField({ name: 'featured', title: 'Highlight on INDEX', type: 'boolean', initialValue: false }),
  defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 0, description: 'Lower numbers appear first. INDEX shows up to 5 visual and 3 code highlights.', validation: rule => rule.required().integer() }),
  strings('tools', 'Tools'), reviewed,
]
const visual = defineType({ name: 'visualProject', title: 'Visual project', type: 'document', fields: [
  ...common,
  defineField({ name: 'role', type: 'string' }),
  defineField({ name: 'year', type: 'number', validation: rule => rule.integer().min(1900).max(2100) }),
  strings('collaborators', 'Collaborators'),
  defineField({ name: 'sections', type: 'array', of: [defineArrayMember({ type: 'object', name: 'section', fields: [
    defineField({ name: 'heading', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'body', title: 'Paragraphs', type: 'array', of: [defineArrayMember({ type: 'text' })], validation: rule => rule.required().min(1) }),
  ], preview: { select: { title: 'heading' } } })] }),
  url('liveUrl', 'Live project URL'), url('sourceUrl', 'Source URL'),
], preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } }, orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }] })
const code = defineType({ name: 'codeProject', title: 'Code project', type: 'document', fields: [
  ...common,
  defineField({ name: 'idea', title: 'The idea', type: 'text' }),
  defineField({ name: 'approach', title: 'Implementation', type: 'text' }),
  defineField({ name: 'finding', title: 'What I learned', type: 'text' }),
  url('demoUrl', 'Live demo URL'), url('sourceUrl', 'Source URL'),
], preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } }, orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }] })
const site = defineType({ name: 'siteSettings', title: 'Contact & site', type: 'document', fields: [
  defineField({ name: 'brand', type: 'string', initialValue: 'GHNWORKS', readOnly: true, validation: rule => rule.required() }),
  defineField({ name: 'displayName', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'shortBio', type: 'text', validation: rule => rule.required() }),
  defineField({ name: 'email', type: 'string', validation: rule => rule.email() }),
  defineField({ name: 'socialLinks', type: 'array', of: [defineArrayMember({ type: 'object', name: 'socialLink', fields: [
    defineField({ name: 'label', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'url', type: 'url', validation: rule => rule.required().uri({ scheme: ['https'] }) }),
  ] })] }),
  defineField({ name: 'resume', title: 'CV PDF', type: 'file', options: { accept: 'application/pdf' }, description: 'Only upload a public CV with details you intend to share.' }),
  defineField({ name: 'availability', type: 'string' }),
  defineField({ name: 'contactTitle', type: 'text', rows: 2, validation: rule => rule.required() }),
  defineField({ name: 'contactIntro', type: 'text', rows: 2, validation: rule => rule.required() }),
  defineField({ name: 'elsewhere', title: 'Elsewhere description', type: 'text', rows: 2, validation: rule => rule.required() }), reviewed,
] })
const profile = defineType({ name: 'profile', title: 'Profile', type: 'document', fields: [
  defineField({ name: 'photo', title: 'Profile photo', type: 'image', options: { hotspot: true }, description: 'Optional portrait displayed in a square frame. Upload only a photo approved for public display.', fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: rule => rule.required(), description: 'Describe the person and visible setting in English.' }),
  ] }),
  defineField({ name: 'introduction', type: 'text', validation: rule => rule.required() }),
  defineField({ name: 'body', type: 'text', validation: rule => rule.required() }),
  defineField({ name: 'areas', type: 'array', of: [defineArrayMember({ name: 'area', type: 'object', fields: [
    defineField({ name: 'title', type: 'string', validation: rule => rule.required() }), strings('items', 'Areas of focus'),
  ] })] }),
  defineField({ name: 'approach', type: 'array', of: [defineArrayMember({ name: 'step', type: 'object', fields: [
    defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'body', type: 'text', validation: rule => rule.required() }),
  ] })] }),
  defineField({ name: 'education', type: 'object', fields: [
    defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'institution', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'description', type: 'text', validation: rule => rule.required() }),
  ] }), reviewed,
] })
const home = defineType({ name: 'home', title: 'INDEX copy', type: 'document', fields: [
  defineField({ name: 'eyebrow', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'headline', type: 'text', rows: 3, description: 'Line breaks are preserved. The last line uses the accent colour.', validation: rule => rule.required() }),
  defineField({ name: 'introTitle', type: 'text', rows: 2, validation: rule => rule.required() }),
  defineField({ name: 'intro', type: 'text', validation: rule => rule.required() }),
  strings('areas', 'Focus list'),
  defineField({ name: 'closing', type: 'text', rows: 2, validation: rule => rule.required() }), reviewed,
] })
export const schemaTypes = [image, visual, code, site, profile, home]
