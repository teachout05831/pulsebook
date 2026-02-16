import type { CoachingSuggestion, CoachCatalogItem, SalesStage, ObjectionPattern } from '../types'

/** Create a coaching card from a detected objection */
export function createObjectionCard(
  objection: ObjectionPattern,
  stage: SalesStage
): CoachingSuggestion {
  return {
    id: `objection_${objection.id}_${Date.now()}`,
    type: 'objection_response',
    title: `${objection.category.charAt(0).toUpperCase() + objection.category.slice(1)} Concern`,
    body: objection.response,
    scriptText: objection.response,
    stage,
    priority: 1,
    createdAt: Date.now(),
    dismissed: false,
  }
}

/** Create a coaching card from a matched service */
export function createServiceCard(
  service: CoachCatalogItem,
  stage: SalesStage
): CoachingSuggestion {
  return {
    id: `service_${service.id}_${Date.now()}`,
    type: 'service_suggestion',
    title: service.name,
    body: service.description || `Consider recommending ${service.name} based on what the customer mentioned.`,
    serviceId: service.id,
    stage,
    priority: 2,
    createdAt: Date.now(),
    dismissed: false,
  }
}
