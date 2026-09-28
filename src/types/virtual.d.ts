declare module 'virtual:portfolio' {
  const data: import('../../content/schema').Portfolio & {
    metadata: Record<string, import('../../content/seo').PageMeta>;
    origin: string; noindex: boolean;
  }
  export default data
}

declare module 'virtual:portfolio-runtime-config' {
  const config: { source: 'local' | 'sanity'; projectId?: string; dataset?: string }
  export default config
}
