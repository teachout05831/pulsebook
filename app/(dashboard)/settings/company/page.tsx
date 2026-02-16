import { getCompanyProfile } from '@/features/company-profile/queries/getCompanyProfile';
import { CompanyProfileForm } from '@/features/company-profile';

export default async function CompanyProfilePage() {
  const profile = await getCompanyProfile();

  return <CompanyProfileForm initialProfile={profile} />;
}
