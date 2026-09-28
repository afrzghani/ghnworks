import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@sanity/client'
import { query, normalizeSanity } from '../../content/sanity'
import initialContent from 'virtual:portfolio'
import runtimeConfig from 'virtual:portfolio-runtime-config'
import type { Portfolio } from '../../content/schema'

const PortfolioContext = createContext<Portfolio>(initialContent)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialContent)

  useEffect(() => {
    if (runtimeConfig.source !== 'sanity' || !runtimeConfig.projectId || !runtimeConfig.dataset) return
    let active = true
    const client = createClient({
      projectId: runtimeConfig.projectId,
      dataset: runtimeConfig.dataset,
      apiVersion: '2025-02-19',
      useCdn: false,
      perspective: 'published',
    })
    client.fetch<Record<string, unknown>>(query)
      .then(raw => normalizeSanity(raw, false))
      .then(next => { if (active) setPortfolio(next) })
      .catch(() => {
        console.error('Could not refresh published portfolio content.')
      })
    return () => { active = false }
  }, [])

  return <PortfolioContext.Provider value={portfolio}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  return useContext(PortfolioContext)
}
