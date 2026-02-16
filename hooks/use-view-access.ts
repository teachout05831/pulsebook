"use client";

import { useMemo } from "react";
import {
  DispatchView,
  ViewAccessResult,
  PlanTier,
  CompanyDispatchSettings,
  UserDispatchPreferences,
  PLAN_FEATURES,
  defaultCompanyDispatchSettings,
  defaultUserDispatchPreferences,
} from "@/types/dispatch";

interface UseViewAccessOptions {
  // These would come from auth context / API in production
  planTier?: PlanTier;
  companySettings?: Partial<CompanyDispatchSettings>;
  userPreferences?: Partial<UserDispatchPreferences>;
}

/**
 * Hook to determine which dispatch views a user can access
 * based on three-tier access control:
 * 1. Plan level - what the subscription allows
 * 2. Company level - what admin has enabled
 * 3. User level - personal favorites/default
 */
export function useViewAccess(options: UseViewAccessOptions = {}): ViewAccessResult {
  const {
    planTier = "enterprise", // Default to enterprise for demo (all views)
    companySettings: companySettingsOverride,
    userPreferences: userPreferencesOverride,
  } = options;

  // Merge with defaults
  const companySettings: CompanyDispatchSettings = useMemo(
    () => ({
      ...defaultCompanyDispatchSettings,
      ...companySettingsOverride,
    }),
    [companySettingsOverride]
  );

  const userPreferences: UserDispatchPreferences = useMemo(
    () => ({
      ...defaultUserDispatchPreferences,
      ...userPreferencesOverride,
    }),
    [userPreferencesOverride]
  );

  // Get views available at plan level
  const planViews = useMemo(() => {
    return PLAN_FEATURES[planTier].availableViews;
  }, [planTier]);

  // Filter to views enabled by company (that are also in plan)
  const companyEnabledViews = useMemo(() => {
    return companySettings.enabledViews.filter((view) => planViews.includes(view));
  }, [companySettings.enabledViews, planViews]);

  // Final available views - company enabled views that are in plan
  const availableViews = useMemo(() => {
    return companyEnabledViews;
  }, [companyEnabledViews]);

  // Check if a specific view is accessible
  const canAccess = useMemo(() => {
    return (view: DispatchView): boolean => {
      return availableViews.includes(view);
    };
  }, [availableViews]);

  // Determine effective default view with precedence: user > company > first available
  const effectiveDefaultView = useMemo((): DispatchView => {
    // User preference takes priority if set and accessible
    if (userPreferences.defaultView && availableViews.includes(userPreferences.defaultView)) {
      return userPreferences.defaultView;
    }

    // Company default if accessible
    if (availableViews.includes(companySettings.defaultView)) {
      return companySettings.defaultView;
    }

    // Fall back to first available view
    return availableViews[0] || "timeline";
  }, [userPreferences.defaultView, companySettings.defaultView, availableViews]);

  return {
    availableViews,
    canAccess,
    effectiveDefaultView,
    companySettings,
    userPreferences,
    planTier,
  };
}

/**
 * Hook to get the current view from URL or default
 */
export function useCurrentView(
  searchParams: URLSearchParams | null,
  viewAccess: ViewAccessResult
): DispatchView {
  const viewParam = searchParams?.get("view") as DispatchView | null;

  // If URL has a view param and it's accessible, use it
  if (viewParam && viewAccess.canAccess(viewParam)) {
    return viewParam;
  }

  // Otherwise use effective default
  return viewAccess.effectiveDefaultView;
}
