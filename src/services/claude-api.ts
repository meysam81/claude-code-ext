/**
 * Claude API service for fetching sessions and organization data
 */

import type { Organization, Session, SessionsResponse, SearchResult } from '@/types/api'

const BASE_URL = 'https://claude.ai'

class ClaudeApiService {
  private orgUuid: string | null = null
  private sessionsCache: Session[] | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_TTL = 60_000 // 1 minute cache

  /**
   * Get the organization UUID for the current user
   */
  async getOrganizationId(): Promise<string> {
    if (this.orgUuid) {
      return this.orgUuid
    }

    const response = await fetch(`${BASE_URL}/api/organizations`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.status} ${response.statusText}. Please check your authentication status or try logging in again.`)
    }

    const orgs: Organization[] = await response.json()

    if (!orgs.length) {
      throw new Error('No organizations found')
    }

    this.orgUuid = orgs[0].uuid
    return this.orgUuid
  }

  /**
   * Get headers required for Claude API requests
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const orgUuid = await this.getOrganizationId()
    return {
      'x-organization-uuid': orgUuid,
      'anthropic-version': '2023-06-01',
    }
  }

  /**
   * Fetch all sessions from Claude
   */
  async getSessions(forceRefresh = false): Promise<Session[]> {
    const now = Date.now()

    // Return cached data if valid
    if (!forceRefresh && this.sessionsCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.sessionsCache
    }

    const headers = await this.getHeaders()

    const response = await fetch(`${BASE_URL}/v1/sessions`, {
      credentials: 'include',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.status}`)
    }

    const data: SessionsResponse = await response.json()

    this.sessionsCache = data.data
    this.cacheTimestamp = now

    return this.sessionsCache
  }

  /**
   * Extract repository name from session
   */
  extractRepoName(session: Session): string | null {
    const sources = session.session_context?.sources
    if (!sources?.length) return null

    const urlStr = sources[0].url
    if (!urlStr) return null

    try {
      const url = new URL(urlStr)
      // Remove trailing slash, then split path
      const path = url.pathname.replace(/\/+$/, '')
      const segments = path.split('/').filter(Boolean)
      if (segments.length === 0) return null
      let repo = segments[segments.length - 1]
      // Remove .git suffix if present
      repo = repo.replace(/\.git$/, '')
      return repo || null
    } catch (e) {
      // Invalid URL
      return null
    }
  }

  /**
   * Search sessions by title or repository name
   */
  async searchSessions(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return []
    }

    const sessions = await this.getSessions()
    const normalizedQuery = query.toLowerCase().trim()

    const results: SearchResult[] = []

    for (const session of sessions) {
      const title = session.title?.toLowerCase() || ''
      const repoName = this.extractRepoName(session)
      const normalizedRepo = repoName?.toLowerCase() || ''

      const titleMatch = title.includes(normalizedQuery)
      const repoMatch = normalizedRepo.includes(normalizedQuery)

      if (titleMatch || repoMatch) {
        results.push({
          session,
          repoName,
          matchType: titleMatch && repoMatch ? 'both' : titleMatch ? 'title' : 'repo',
        })
      }
    }

    // Sort by relevance: exact matches first, then by updated_at
    return results.sort((a, b) => {
      // Prioritize matches in both title and repo
      if (a.matchType === 'both' && b.matchType !== 'both') return -1
      if (b.matchType === 'both' && a.matchType !== 'both') return 1

      // Then sort by most recently updated
      return new Date(b.session.updated_at).getTime() - new Date(a.session.updated_at).getTime()
    })
  }

  /**
   * Navigate to a specific session
   */
  navigateToSession(sessionUuid: string): void {
    if (!sessionUuid || sessionUuid === 'undefined') {
      console.error('[Claude Code Ext] Cannot navigate: invalid session UUID')
      return
    }
    const url = `${BASE_URL}/code/${sessionUuid}`
    window.location.href = url
  }

  /**
   * Clear the sessions cache
   */
  clearCache(): void {
    this.sessionsCache = null
    this.cacheTimestamp = 0
  }
}

// Export singleton instance
export const claudeApi = new ClaudeApiService()
