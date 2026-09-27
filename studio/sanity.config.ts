import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schema'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
if (!projectId || !dataset) throw new Error('Sanity project not connected. Set SANITY_PROJECT_ID and SANITY_DATASET in root .env.local; see CMS-SETUP.md.')
const singletonTypes = new Set(['siteSettings', 'profile', 'home'])
export default defineConfig({
  name: 'ghnworks', title: 'GHNWORKS Content', projectId, dataset,
  plugins: [structureTool({ structure: S => S.list().title('Content').items([
    S.documentTypeListItem('visualProject').title('VISUAL'),
    S.documentTypeListItem('codeProject').title('CODE'),
    S.divider(),
    ...[ ['home', 'INDEX'], ['profile', 'PROFILE'], ['siteSettings', 'CONTACT & CV'] ].map(([type, title]) => S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type))),
  ]) })],
  schema: { types: schemaTypes, templates: templates => templates.filter(template => !singletonTypes.has(template.schemaType)) },
  document: {
    actions: (actions, context) => singletonTypes.has(context.schemaType) ? actions.filter(action => action.action && ['publish', 'discardChanges', 'restore'].includes(action.action)) : actions,
    newDocumentOptions: options => options.filter(option => !singletonTypes.has(option.templateId)),
  },
})
