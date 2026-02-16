export interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  lastUsedAt: string | null
  expiresAt: string | null
  isActive: boolean
  createdAt: string
}

export interface CreateApiKeyInput {
  name: string
  expiresAt?: string
}

export interface CreateApiKeyResult {
  id: string
  key: string
}
