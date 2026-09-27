declare module 'virtual:portfolio' {
  const data: import('../../content/schema').Portfolio & {
    metadata: Record<string, import('../../content/seo').PageMeta>;
    origin: string; noindex: boolean;
  }
  export default data
}
