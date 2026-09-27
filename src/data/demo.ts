import type { Experiment, Project } from '../types/content.ts'
const media = (name: string, alt: string) => ({ src: `/images/demo/${name}.svg`, alt, width: 1200, height: 900 })
export const demoProjects: Project[] = [
  { slug: 'visual-identity-study', title: 'Visual Identity Study — Demo', category: 'Branding', summary: 'An abstract composition for reviewing an identity project layout. Real artwork and case study pending.', cover: media('identity', 'Demo composition of interlocking blue geometric forms; artwork pending.'), gallery: [], featured: true, status: 'demo' },
  { slug: 'event-poster-study', title: 'Event Poster Study — Demo', category: 'Graphic Design', summary: 'A typographic placeholder for an event poster. No actual event or client is represented.', cover: media('poster', 'Demo poster composition with oversized type and an orange circle; artwork pending.'), gallery: [], featured: true, status: 'demo' },
  { slug: 'interface-study', title: 'Interface Study — Demo', category: 'UI/UX', summary: 'An abstract interface placeholder. This is not a completed product or interactive demo.', cover: media('interface', 'Demo wireframe composition on a pale blue background; artwork pending.'), gallery: [], featured: true, status: 'demo' },
]
export const demoExperiments: Experiment[] = [
  { slug: 'type-study-01', title: 'Type Renderer — Demo', category: 'Creative Coding', summary: 'A static concept preview for a future code-driven typography experiment. No implementation or source code is available yet.', preview: media('type', 'Static typography placeholder for a proposed code experiment; no working demo.'), status: 'demo' },
  { slug: 'card-interaction', title: 'Card Interaction — Demo', category: 'Front-End', summary: 'A static concept preview for a future interactive component. The implementation is pending.', preview: media('cards', 'Static card composition illustrating a proposed front-end component; not an interactive demo.'), status: 'demo' },
  { slug: 'layout-experiment', title: 'Layout Experiment — Demo', category: 'Web Development', summary: 'A static concept preview for a future layout implementation. No completed application is represented.', preview: media('layout', 'Static modular layout placeholder; code implementation pending.'), status: 'demo' },
]
