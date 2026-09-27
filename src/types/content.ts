export type Media = { src: string; alt: string; width: number; height: number; caption?: string; fit?: 'cover' | 'contain' }
export type ContentStatus = 'demo' | 'draft' | 'published'
export type Project = {
  slug: string; title: string; category: string; summary: string; cover: Media;
  gallery: Media[]; featured: boolean; status: ContentStatus; order?: number;
  year?: number; role?: string; tools?: string[]; collaborators?: string[];
  sections?: { heading: string; body: string[] }[]; liveUrl?: string; sourceUrl?: string;
}
export type Experiment = {
  slug: string; title: string; category: string; summary: string; preview: Media;
  status: ContentStatus; gallery?: Media[]; tools?: string[]; idea?: string; approach?: string; featured?: boolean; order?: number;
  finding?: string; demoUrl?: string; sourceUrl?: string;
}
