import type { ScoringExplanation } from '../types/booking';
import type { PriorityWeights } from '../types/config';
import type { Crew, ZoneTravelTime } from '../types/crews';

type CrewResult = ScoringExplanation['results'][number];

interface ScoringInput {
  crews: Crew[];
  weights: PriorityWeights;
  mode: string;
  crewOverrideEnabled: boolean;
  preferredCrewIds: string[];
  jobZoneId: string | null;
  jobDuration: number;
  jobSpecializations: string[];
  crewWorkloads: Record<string, number>;
  travelTimes: ZoneTravelTime[];
}

export function runScoringEngine(input: ScoringInput): ScoringExplanation {
  const { crews, weights, mode, crewOverrideEnabled, preferredCrewIds, jobZoneId, jobDuration, jobSpecializations, crewWorkloads, travelTimes } = input;

  // Crew override: if enabled and preferred crew set, bypass scoring
  if (crewOverrideEnabled && preferredCrewIds.length > 0) {
    const preferred = crews.find(c => c.id === preferredCrewIds[0]);
    if (preferred?.isActive) {
      const hoursUsed = crewWorkloads[preferred.id] || 0;
      if (hoursUsed + jobDuration <= preferred.maxHoursPerDay) {
        return {
          mode, weights, crewOverride: true,
          results: [{ crewId: preferred.id, crewName: preferred.name, eligible: true, totalScore: 100, rank: 1 }],
          winnerId: preferred.id, winnerName: preferred.name,
          explanation: `Crew override: ${preferred.name} assigned directly.`,
        };
      }
    }
  }

  const maxTravel = Math.max(...travelTimes.map(t => t.travelMinutes), 60);

  const results: CrewResult[] = crews.map(crew => {
    if (!crew.isActive) return { crewId: crew.id, crewName: crew.name, eligible: false, failReason: 'Inactive' };

    const hoursUsed = crewWorkloads[crew.id] || 0;
    if (hoursUsed + jobDuration > crew.maxHoursPerDay) {
      return { crewId: crew.id, crewName: crew.name, eligible: false, failReason: 'At capacity' };
    }

    if (jobSpecializations.length > 0 && !jobSpecializations.every(s => crew.specializations?.includes(s))) {
      return { crewId: crew.id, crewName: crew.name, eligible: false, failReason: 'Missing specialization' };
    }

    // Crew preference: 1st=100, 2nd=70, 3rd=40, none=0
    const prefIdx = preferredCrewIds.indexOf(crew.id);
    const crewPrefScore = prefIdx === 0 ? 100 : prefIdx === 1 ? 70 : prefIdx === 2 ? 40 : 0;

    // Location: same zone=100, different zone=(1 - travel/maxTravel)*100, no zone info=50
    let locationScore = 50;
    if (jobZoneId && crew.zoneId) {
      if (crew.zoneId === jobZoneId) { locationScore = 100; }
      else {
        const travel = travelTimes.find(t => (t.fromZoneId === crew.zoneId && t.toZoneId === jobZoneId) || (t.fromZoneId === jobZoneId && t.toZoneId === crew.zoneId));
        locationScore = travel ? Math.max(0, (1 - travel.travelMinutes / maxTravel) * 100) : 25;
      }
    }

    // Workload: (1 - hoursUsed/maxHours) * 100
    const workloadScore = Math.max(0, (1 - hoursUsed / crew.maxHoursPerDay) * 100);

    const totalScore = (crewPrefScore * weights.crew / 100) + (locationScore * weights.location / 100) + (workloadScore * weights.workload / 100);
    return { crewId: crew.id, crewName: crew.name, eligible: true, crewPrefScore, locationScore, workloadScore, totalScore };
  });

  const eligible = results.filter(r => r.eligible).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  eligible.forEach((r, i) => { r.rank = i + 1; });

  const winner = eligible[0] || null;
  return {
    mode, weights, crewOverride: false, results,
    winnerId: winner?.crewId || null, winnerName: winner?.crewName || null,
    explanation: winner ? `${winner.crewName} scored ${winner.totalScore?.toFixed(1)} in ${mode} mode.` : 'No eligible crews available.',
  };
}
