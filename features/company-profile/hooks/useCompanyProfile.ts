'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { CompanyProfile, CompanyProfileFormData } from '../types';

export function useCompanyProfile(initialProfile: CompanyProfile) {
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile);
  const [formData, setFormData] = useState<CompanyProfileFormData>({
    name: initialProfile.name,
    email: initialProfile.email,
    phone: initialProfile.phone,
    address: initialProfile.address,
    city: initialProfile.city,
    state: initialProfile.state,
    zipCode: initialProfile.zipCode,
    website: initialProfile.website,
    industry: initialProfile.industry,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof CompanyProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/company/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || 'Failed to update company profile');
        return;
      }

      setProfile({ ...profile, ...result.data });
      toast.success('Company profile updated successfully');
    } catch (error) {
      toast.error('Failed to update company profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    toast.info('Logo upload coming soon');
  };

  return {
    profile,
    formData,
    isSaving,
    handleChange,
    handleSave,
    handleLogoUpload,
  };
}
