-- =============================================
-- Migration 009: Estimate Experience Platform
-- =============================================
-- New tables for the Estimate Experience Platform:
-- 1. company_brand_kits    - Company branding settings
-- 2. company_rate_cards    - Pricing reference for AI
-- 3. estimate_page_templates - Reusable page designs
-- 4. estimate_pages        - Customer-facing estimate experiences
-- 5. estimate_page_analytics - Tracking customer interactions
-- 6. estimate_video_calls  - daily.co call tracking
-- 7. estimate_videos       - bunny.net video library

-- =============================================
-- 1. Company Brand Kits
-- =============================================
CREATE TABLE IF NOT EXISTS company_brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Visual identity
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#1e40af',
  accent_color TEXT DEFAULT '#f59e0b',
  font_family TEXT DEFAULT 'Inter',
  heading_font TEXT,

  -- Media
  hero_image_url TEXT,
  company_photos JSONB DEFAULT '[]',
  video_intro_url TEXT,

  -- Content
  company_description TEXT,
  tagline TEXT,
  default_terms TEXT,
  default_faq JSONB DEFAULT '[]',
  tone TEXT DEFAULT 'friendly' CHECK (tone IN ('formal', 'friendly', 'casual')),

  -- Trust signals
  google_reviews_url TEXT,
  google_rating DECIMAL,
  google_review_count INTEGER,
  certifications JSONB DEFAULT '[]',
  insurance_info TEXT,

  -- Social
  social_links JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_brand_kits ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_brand_kits_company ON company_brand_kits(company_id);

CREATE POLICY "brand_kits_company_isolation" ON company_brand_kits
  FOR ALL USING (company_id = get_active_company_id());

-- =============================================
-- 2. Company Rate Cards
-- =============================================
CREATE TABLE IF NOT EXISTS company_rate_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  category TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_rate_cards ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_rate_cards_company ON company_rate_cards(company_id);

CREATE POLICY "rate_cards_company_isolation" ON company_rate_cards
  FOR ALL USING (company_id = get_active_company_id());

-- =============================================
-- 3. Estimate Page Templates
-- =============================================
CREATE TABLE IF NOT EXISTS estimate_page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,

  layout TEXT DEFAULT 'stacked' CHECK (layout IN ('stacked', 'sidebar', 'split', 'magazine')),
  sections JSONB NOT NULL DEFAULT '[]',
  design_theme JSONB DEFAULT '{}',
  design_settings JSONB DEFAULT '{}',

  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimate_page_templates ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_page_templates_company ON estimate_page_templates(company_id);

CREATE POLICY "page_templates_company_isolation" ON estimate_page_templates
  FOR ALL USING (company_id = get_active_company_id());

-- =============================================
-- 4. Estimate Pages (the customer-facing experience)
-- =============================================
CREATE TABLE IF NOT EXISTS estimate_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  template_id UUID REFERENCES estimate_page_templates(id),

  -- Public access
  public_token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,

  -- Page content
  sections JSONB NOT NULL DEFAULT '[]',
  design_theme JSONB DEFAULT '{}',
  brand_overrides JSONB,

  -- Interaction settings
  allow_video_call BOOLEAN DEFAULT true,
  allow_scheduling BOOLEAN DEFAULT true,
  allow_chat BOOLEAN DEFAULT true,
  allow_instant_approval BOOLEAN DEFAULT true,
  require_deposit BOOLEAN DEFAULT false,
  deposit_amount DECIMAL,
  deposit_type TEXT DEFAULT 'flat' CHECK (deposit_type IN ('flat', 'percentage')),

  -- Payment options
  payment_plans JSONB,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'viewed', 'approved', 'declined', 'expired')),

  -- Timestamps
  published_at TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimate_pages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_estimate_pages_company ON estimate_pages(company_id);
CREATE INDEX idx_estimate_pages_estimate ON estimate_pages(estimate_id);
CREATE INDEX idx_estimate_pages_token ON estimate_pages(public_token);
CREATE INDEX idx_estimate_pages_status ON estimate_pages(company_id, status);

CREATE POLICY "estimate_pages_company_isolation" ON estimate_pages
  FOR ALL USING (company_id = get_active_company_id());

-- =============================================
-- 5. Estimate Page Analytics
-- =============================================
CREATE TABLE IF NOT EXISTS estimate_page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES estimate_pages(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL,
  event_data JSONB,

  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  referrer TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimate_page_analytics ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_page_analytics_page ON estimate_page_analytics(page_id);
CREATE INDEX idx_page_analytics_type ON estimate_page_analytics(page_id, event_type);
CREATE INDEX idx_page_analytics_created ON estimate_page_analytics(page_id, created_at);

-- Analytics needs special RLS: allow inserts from public (no auth) but reads require company auth
-- Public insert policy (for tracking from the customer-facing page)
CREATE POLICY "analytics_public_insert" ON estimate_page_analytics
  FOR INSERT WITH CHECK (true);

-- Read policy via join to estimate_pages for company isolation
CREATE POLICY "analytics_company_read" ON estimate_page_analytics
  FOR SELECT USING (
    page_id IN (
      SELECT id FROM estimate_pages WHERE company_id = get_active_company_id()
    )
  );

-- =============================================
-- 6. Estimate Video Calls
-- =============================================
CREATE TABLE IF NOT EXISTS estimate_video_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES estimates(id),
  page_id UUID REFERENCES estimate_pages(id),
  customer_id UUID REFERENCES customers(id),

  daily_room_name TEXT NOT NULL,
  daily_room_url TEXT NOT NULL,

  call_type TEXT NOT NULL CHECK (call_type IN ('discovery', 'review', 'instant')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,

  transcript TEXT,
  transcript_summary TEXT,
  extracted_scope JSONB,
  extracted_pricing JSONB,

  recording_url TEXT,
  participants JSONB,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimate_video_calls ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_video_calls_company ON estimate_video_calls(company_id);
CREATE INDEX idx_video_calls_estimate ON estimate_video_calls(estimate_id);

CREATE POLICY "video_calls_company_isolation" ON estimate_video_calls
  FOR ALL USING (company_id = get_active_company_id());

-- =============================================
-- 7. Estimate Videos (bunny.net library)
-- =============================================
CREATE TABLE IF NOT EXISTS estimate_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('intro', 'testimonial', 'process', 'site_visit', 'before_after', 'personal_message')),

  bunny_video_id TEXT NOT NULL,
  bunny_library_id TEXT NOT NULL,
  bunny_cdn_url TEXT NOT NULL,
  thumbnail_url TEXT,

  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  resolution TEXT,

  is_reusable BOOLEAN DEFAULT true,
  estimate_id UUID REFERENCES estimates(id),

  total_plays INTEGER DEFAULT 0,
  avg_watch_percentage DECIMAL DEFAULT 0,

  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimate_videos ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_videos_company ON estimate_videos(company_id);
CREATE INDEX idx_videos_category ON estimate_videos(company_id, category);

CREATE POLICY "videos_company_isolation" ON estimate_videos
  FOR ALL USING (company_id = get_active_company_id());
