'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Building2,
  Users,
  UsersRound,
  Truck,
  FileText,
  Wrench,
  DollarSign,
  Settings2,
  Tag,
  Palette,
  ScrollText,
  Smartphone,
  Globe,
  Key,
  Link2,
  Video,
  CalendarDays,
  Package,
  Boxes,
  SlidersHorizontal,
  Layers,
  ListChecks,
  Ticket,
  Type,
  Clock,
  Target,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const settingsNavSections: NavSection[] = [
  {
    title: 'General',
    items: [
      { label: 'Company Profile', href: '/settings/company', icon: <Building2 className="h-5 w-5" /> },
      { label: 'Team Members', href: '/settings/team', icon: <Users className="h-5 w-5" /> },
      { label: 'Crews', href: '/settings/crews', icon: <UsersRound className="h-5 w-5" /> },
      { label: 'Dispatch Center', href: '/settings/dispatch', icon: <Truck className="h-5 w-5" /> },
      { label: 'Arrival Windows', href: '/settings/arrival-windows', icon: <Clock className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Business',
    items: [
      { label: 'Billing & Invoicing', href: '/settings/billing', icon: <FileText className="h-5 w-5" /> },
      { label: 'Service Types', href: '/settings/services', icon: <Wrench className="h-5 w-5" /> },
      { label: 'Rate Card', href: '/settings/rate-card', icon: <DollarSign className="h-5 w-5" /> },
      { label: 'Service Catalog', href: '/settings/service-catalog', icon: <Package className="h-5 w-5" /> },
      { label: 'Materials', href: '/settings/materials', icon: <Boxes className="h-5 w-5" /> },
      { label: 'Prepaid Packages', href: '/settings/prepaid-packages', icon: <Ticket className="h-5 w-5" /> },
      { label: 'Estimate Builder', href: '/settings/estimate-builder', icon: <SlidersHorizontal className="h-5 w-5" /> },
      { label: 'Sales Goals', href: '/settings/sales-goals', icon: <Target className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Customization',
    items: [
      { label: 'Custom Fields', href: '/settings/fields', icon: <Settings2 className="h-5 w-5" /> },
      { label: 'Dropdowns', href: '/settings/dropdowns', icon: <ListChecks className="h-5 w-5" /> },
      { label: 'Terminology', href: '/settings/terminology', icon: <Type className="h-5 w-5" /> },
      { label: 'Tags', href: '/settings/tags', icon: <Tag className="h-5 w-5" /> },
      { label: 'Universal Blocks', href: '/settings/universal-blocks', icon: <Layers className="h-5 w-5" /> },
      { label: 'Brand Kit', href: '/settings/brand-kit', icon: <Palette className="h-5 w-5" /> },
      { label: 'Contracts', href: '/settings/contracts', icon: <ScrollText className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'Tech Portal', href: '/settings/tech-portal', icon: <Smartphone className="h-5 w-5" /> },
      { label: 'Customer Portal', href: '/settings/customer-portal', icon: <Globe className="h-5 w-5" /> },
      { label: 'API Keys', href: '/settings/api-keys', icon: <Key className="h-5 w-5" /> },
      { label: 'Consultations', href: '/settings/consultations', icon: <Video className="h-5 w-5" /> },
      { label: 'Online Booking', href: '/settings/scheduling', icon: <CalendarDays className="h-5 w-5" /> },
      { label: 'Integrations', href: '/settings/integrations', icon: <Link2 className="h-5 w-5" /> },
    ],
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:flex-shrink-0 bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <h2 className="font-semibold text-lg text-slate-900">Settings</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {settingsNavSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && (
              <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <span className={cn(isActive ? 'text-blue-600' : 'text-slate-500')}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
