import type { HtmlBlock, HtmlBlockCategoryDef } from '@/features/estimate-pages/types/htmlBlocks'

export const CONTRACT_HTML_BLOCKS: HtmlBlock[] = [
  {
    id: "terms-and-conditions",
    name: "Terms & Conditions",
    category: "legal",
    description: "Numbered legal sections with indented clause text and professional formatting",
    variables: ["sectionTitle", "clause1Title", "clause1Text", "clause2Title", "clause2Text", "clause3Title", "clause3Text"],
    html: `<div class="terms-section">
  <h2 class="terms-heading">{{sectionTitle}}</h2>
  <div class="terms-clauses">
    <div class="terms-clause">
      <div class="clause-number">1.</div>
      <div class="clause-body">
        <h4 class="clause-title">{{clause1Title}}</h4>
        <p class="clause-text">{{clause1Text}}</p>
      </div>
    </div>
    <div class="terms-clause">
      <div class="clause-number">2.</div>
      <div class="clause-body">
        <h4 class="clause-title">{{clause2Title}}</h4>
        <p class="clause-text">{{clause2Text}}</p>
      </div>
    </div>
    <div class="terms-clause">
      <div class="clause-number">3.</div>
      <div class="clause-body">
        <h4 class="clause-title">{{clause3Title}}</h4>
        <p class="clause-text">{{clause3Text}}</p>
      </div>
    </div>
  </div>
</div>`,
    css: `:scope .terms-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
}
:scope .terms-heading {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1a1f2b;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid {{brand.primaryColor}};
  letter-spacing: -0.01em;
}
:scope .terms-clauses {
  display: flex;
  flex-direction: column;
  gap: 0;
}
:scope .terms-clause {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #f0f1f3;
  border-left: 3px solid #e2e5e9;
  padding-left: 1.25rem;
}
:scope .terms-clause:last-child {
  border-bottom: none;
}
:scope .clause-number {
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 700;
  color: {{brand.primaryColor}};
  min-width: 1.5rem;
  padding-top: 0.125rem;
}
:scope .clause-body {
  flex: 1;
}
:scope .clause-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1f2b;
  margin-bottom: 0.5rem;
}
:scope .clause-text {
  font-size: 0.9375rem;
  color: #4a5568;
  line-height: 1.75;
  font-family: Georgia, "Times New Roman", serif;
}
@media (max-width: 640px) {
  :scope .terms-section {
    padding: 1.5rem;
  }
  :scope .terms-clause {
    padding-left: 0.75rem;
  }
}`,
  },
  {
    id: "warranty-coverage",
    name: "Warranty Coverage",
    category: "coverage",
    description: "Warranty card with duration badge, coverage details, and exclusions",
    variables: ["warrantyTitle", "warrantyDuration", "coverageDescription", "exclusions", "contactInfo"],
    html: `<div class="warranty-card">
  <div class="warranty-header">
    <div class="warranty-icon-wrap">
      <span class="warranty-icon">&#x1F6E1;</span>
    </div>
    <div class="warranty-header-text">
      <h3 class="warranty-title">{{warrantyTitle}}</h3>
      <span class="warranty-badge">{{warrantyDuration}}</span>
    </div>
  </div>
  <div class="warranty-body">
    <div class="warranty-coverage">
      <h4 class="warranty-label">Coverage</h4>
      <p class="warranty-description">{{coverageDescription}}</p>
    </div>
    <div class="warranty-exclusions">
      <h4 class="warranty-label">Exclusions</h4>
      <p class="warranty-exclusions-text">{{exclusions}}</p>
    </div>
    <div class="warranty-contact">
      <h4 class="warranty-label">Warranty Contact</h4>
      <p class="warranty-contact-text">{{contactInfo}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .warranty-card {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .warranty-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e5e9;
}
:scope .warranty-icon-wrap {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: {{brand.primaryColor}};
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
:scope .warranty-icon {
  font-size: 1.5rem;
  filter: grayscale(1) brightness(10);
}
:scope .warranty-header-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
:scope .warranty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .warranty-badge {
  flex-shrink: 0;
  padding: 0.375rem 1rem;
  background: {{brand.primaryColor}};
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 2rem;
  letter-spacing: 0.02em;
}
:scope .warranty-body {
  padding: 2rem;
}
:scope .warranty-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.375rem;
}
:scope .warranty-coverage {
  margin-bottom: 1.5rem;
}
:scope .warranty-description {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
}
:scope .warranty-exclusions {
  margin-bottom: 1.5rem;
}
:scope .warranty-exclusions-text {
  font-size: 0.9375rem;
  color: #4a5568;
  line-height: 1.7;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border-left: 3px solid #d1d5db;
}
:scope .warranty-contact-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
}
@media (max-width: 640px) {
  :scope .warranty-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem 1.5rem;
  }
  :scope .warranty-header-text {
    flex-direction: column;
    align-items: flex-start;
  }
  :scope .warranty-body {
    padding: 1.5rem;
  }
}`,
  },
  {
    id: "scope-of-work",
    name: "Scope of Work",
    category: "scope",
    description: "Two-column layout with included and excluded items",
    variables: ["scopeTitle", "included1", "included2", "included3", "included4", "excluded1", "excluded2"],
    html: `<div class="scope-section">
  <h2 class="scope-heading">{{scopeTitle}}</h2>
  <div class="scope-columns">
    <div class="scope-included">
      <h4 class="scope-column-title scope-included-title">Included</h4>
      <ul class="scope-list">
        <li class="scope-item scope-yes">{{included1}}</li>
        <li class="scope-item scope-yes">{{included2}}</li>
        <li class="scope-item scope-yes">{{included3}}</li>
        <li class="scope-item scope-yes">{{included4}}</li>
      </ul>
    </div>
    <div class="scope-excluded">
      <h4 class="scope-column-title scope-excluded-title">Not Included</h4>
      <ul class="scope-list">
        <li class="scope-item scope-no">{{excluded1}}</li>
        <li class="scope-item scope-no">{{excluded2}}</li>
      </ul>
    </div>
  </div>
</div>`,
    css: `:scope .scope-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
}
:scope .scope-heading {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1a1f2b;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid {{brand.primaryColor}};
}
:scope .scope-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
:scope .scope-column-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e5e9;
}
:scope .scope-included-title {
  color: #166534;
}
:scope .scope-excluded-title {
  color: #991b1b;
}
:scope .scope-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
:scope .scope-item {
  padding: 0.625rem 0 0.625rem 2rem;
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.6;
  position: relative;
  border-bottom: 1px solid #f5f5f5;
}
:scope .scope-item:last-child {
  border-bottom: none;
}
:scope .scope-yes::before {
  content: "\\2713";
  position: absolute;
  left: 0;
  top: 0.625rem;
  font-weight: 700;
  font-size: 1rem;
  color: #16a34a;
}
:scope .scope-no::before {
  content: "\\2717";
  position: absolute;
  left: 0;
  top: 0.625rem;
  font-weight: 700;
  font-size: 1rem;
  color: #dc2626;
}
@media (max-width: 640px) {
  :scope .scope-section {
    padding: 1.5rem;
  }
  :scope .scope-columns {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}`,
  },
  {
    id: "payment-schedule",
    name: "Payment Schedule",
    category: "payment",
    description: "Vertical timeline with milestones and payment amounts",
    variables: ["milestone1", "milestone1Amount", "milestone2", "milestone2Amount", "milestone3", "milestone3Amount"],
    html: `<div class="payment-section">
  <div class="payment-timeline">
    <div class="payment-milestone">
      <div class="milestone-marker">
        <div class="milestone-dot"></div>
        <div class="milestone-line"></div>
      </div>
      <div class="milestone-content">
        <span class="milestone-name">{{milestone1}}</span>
        <span class="milestone-amount">{{milestone1Amount}}</span>
      </div>
    </div>
    <div class="payment-milestone">
      <div class="milestone-marker">
        <div class="milestone-dot"></div>
        <div class="milestone-line"></div>
      </div>
      <div class="milestone-content">
        <span class="milestone-name">{{milestone2}}</span>
        <span class="milestone-amount">{{milestone2Amount}}</span>
      </div>
    </div>
    <div class="payment-milestone">
      <div class="milestone-marker">
        <div class="milestone-dot"></div>
      </div>
      <div class="milestone-content">
        <span class="milestone-name">{{milestone3}}</span>
        <span class="milestone-amount">{{milestone3Amount}}</span>
      </div>
    </div>
  </div>
</div>`,
    css: `:scope .payment-section {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
}
:scope .payment-timeline {
  display: flex;
  flex-direction: column;
}
:scope .payment-milestone {
  display: flex;
  gap: 1.5rem;
  min-height: 4rem;
}
:scope .milestone-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 1.5rem;
}
:scope .milestone-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: {{brand.primaryColor}};
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 2px {{brand.primaryColor}};
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
:scope .milestone-line {
  width: 2px;
  flex: 1;
  background: #d1d5db;
  margin: 0.25rem 0;
}
:scope .milestone-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f1f3;
  margin-bottom: 0;
}
:scope .payment-milestone:last-child .milestone-content {
  border-bottom: none;
  padding-bottom: 0;
}
:scope .milestone-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1f2b;
  line-height: 1.4;
}
:scope .milestone-amount {
  font-size: 1rem;
  font-weight: 700;
  color: {{brand.primaryColor}};
  white-space: nowrap;
  padding-left: 1rem;
}
@media (max-width: 640px) {
  :scope .payment-section {
    padding: 1.5rem;
  }
  :scope .milestone-content {
    flex-direction: column;
    gap: 0.25rem;
  }
  :scope .milestone-amount {
    padding-left: 0;
    font-size: 0.9375rem;
  }
}`,
  },
  {
    id: "insurance-details",
    name: "Insurance Details",
    category: "coverage",
    description: "Professional card with insurance policy key-value pairs",
    variables: ["insuranceProvider", "policyNumber", "coverageAmount", "coverageType", "effectiveDate"],
    html: `<div class="insurance-card">
  <div class="insurance-header">
    <span class="insurance-icon">&#x1F4CB;</span>
    <h3 class="insurance-title">Insurance Information</h3>
  </div>
  <div class="insurance-grid">
    <div class="insurance-field">
      <span class="insurance-label">Provider</span>
      <span class="insurance-value">{{insuranceProvider}}</span>
    </div>
    <div class="insurance-field">
      <span class="insurance-label">Policy Number</span>
      <span class="insurance-value">{{policyNumber}}</span>
    </div>
    <div class="insurance-field">
      <span class="insurance-label">Coverage Amount</span>
      <span class="insurance-value">{{coverageAmount}}</span>
    </div>
    <div class="insurance-field">
      <span class="insurance-label">Coverage Type</span>
      <span class="insurance-value">{{coverageType}}</span>
    </div>
    <div class="insurance-field">
      <span class="insurance-label">Effective Date</span>
      <span class="insurance-value">{{effectiveDate}}</span>
    </div>
  </div>
</div>`,
    css: `:scope .insurance-card {
  max-width: 600px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .insurance-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e5e9;
}
:scope .insurance-icon {
  font-size: 1.25rem;
}
:scope .insurance-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .insurance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
:scope .insurance-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid #f0f1f3;
  border-right: 1px solid #f0f1f3;
}
:scope .insurance-field:nth-child(even) {
  border-right: none;
}
:scope .insurance-field:nth-last-child(-n+2) {
  border-bottom: none;
}
:scope .insurance-field:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  border-right: none;
}
:scope .insurance-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
:scope .insurance-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1f2b;
}
@media (max-width: 640px) {
  :scope .insurance-grid {
    grid-template-columns: 1fr;
  }
  :scope .insurance-field {
    border-right: none;
    padding: 0.875rem 1.5rem;
  }
  :scope .insurance-field:nth-last-child(-n+2) {
    border-bottom: 1px solid #f0f1f3;
  }
  :scope .insurance-field:last-child {
    border-bottom: none;
  }
}`,
  },
  {
    id: "cancellation-policy",
    name: "Cancellation Policy",
    category: "legal",
    description: "Alert-style card with cancellation terms and process steps",
    variables: ["noticePeriod", "cancellationFee", "refundPolicy", "cancellationProcess"],
    html: `<div class="cancellation-card">
  <div class="cancellation-header">
    <span class="cancellation-icon">&#x1F551;</span>
    <h3 class="cancellation-title">Cancellation Policy</h3>
  </div>
  <div class="cancellation-body">
    <div class="cancellation-terms">
      <div class="cancellation-term">
        <span class="term-label">Notice Period</span>
        <span class="term-value term-highlight">{{noticePeriod}}</span>
      </div>
      <div class="cancellation-term">
        <span class="term-label">Cancellation Fee</span>
        <span class="term-value term-highlight">{{cancellationFee}}</span>
      </div>
      <div class="cancellation-term">
        <span class="term-label">Refund Policy</span>
        <span class="term-value">{{refundPolicy}}</span>
      </div>
    </div>
    <div class="cancellation-process">
      <h4 class="process-label">Cancellation Process</h4>
      <p class="process-text">{{cancellationProcess}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .cancellation-card {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .cancellation-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #fefce8;
  border-bottom: 1px solid #e2e5e9;
}
:scope .cancellation-icon {
  font-size: 1.25rem;
}
:scope .cancellation-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .cancellation-body {
  padding: 2rem;
}
:scope .cancellation-terms {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 1.5rem;
}
:scope .cancellation-term {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f0f1f3;
}
:scope .cancellation-term:last-child {
  border-bottom: none;
}
:scope .term-label {
  font-size: 0.9375rem;
  color: #4a5568;
  font-weight: 500;
}
:scope .term-value {
  font-size: 0.9375rem;
  color: #1a1f2b;
  font-weight: 600;
  text-align: right;
}
:scope .term-highlight {
  color: {{brand.primaryColor}};
  font-weight: 700;
}
:scope .cancellation-process {
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border-left: 3px solid {{brand.primaryColor}};
}
:scope .process-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .process-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
}
@media (max-width: 640px) {
  :scope .cancellation-body {
    padding: 1.5rem;
  }
  :scope .cancellation-term {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  :scope .term-value {
    text-align: left;
  }
}`,
  },
  {
    id: "liability-limitation",
    name: "Liability Limitation",
    category: "legal",
    description: "Formal bordered section with limitation amount and exceptions",
    variables: ["limitationTitle", "limitationText", "maxLiability", "exceptions"],
    html: `<div class="liability-section">
  <div class="liability-header">
    <span class="liability-icon">&#x26A0;</span>
    <h3 class="liability-title">{{limitationTitle}}</h3>
  </div>
  <div class="liability-body">
    <p class="liability-text">{{limitationText}}</p>
    <div class="liability-cap">
      <span class="cap-label">Maximum Liability</span>
      <span class="cap-amount">{{maxLiability}}</span>
    </div>
    <div class="liability-exceptions">
      <h4 class="exceptions-label">Exceptions</h4>
      <p class="exceptions-text">{{exceptions}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .liability-section {
  max-width: 700px;
  margin: 2rem auto;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .liability-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #f9fafb;
  border-bottom: 1px solid #e2e5e9;
}
:scope .liability-icon {
  font-size: 1.25rem;
  color: #92400e;
}
:scope .liability-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .liability-body {
  padding: 2rem;
}
:scope .liability-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.75;
  margin-bottom: 1.5rem;
  font-family: Georgia, "Times New Roman", serif;
}
:scope .liability-cap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f8f9fa;
  border: 1px solid #e2e5e9;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}
:scope .cap-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
:scope .cap-amount {
  font-size: 1.375rem;
  font-weight: 700;
  color: {{brand.primaryColor}};
}
:scope .liability-exceptions {
  padding-top: 1rem;
  border-top: 1px solid #f0f1f3;
}
:scope .exceptions-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .exceptions-text {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.7;
  font-style: italic;
}
@media (max-width: 640px) {
  :scope .liability-body {
    padding: 1.5rem;
  }
  :scope .liability-cap {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}`,
  },
  {
    id: "materials-equipment",
    name: "Materials & Equipment",
    category: "scope",
    description: "Clean table-style grid with alternating row backgrounds",
    variables: ["material1", "qty1", "material2", "qty2", "material3", "qty3", "material4", "qty4"],
    html: `<div class="materials-section">
  <h3 class="materials-heading">Materials &amp; Equipment</h3>
  <div class="materials-table">
    <div class="materials-row materials-header-row">
      <span class="materials-cell materials-name-cell">Material / Equipment</span>
      <span class="materials-cell materials-qty-cell">Quantity</span>
    </div>
    <div class="materials-row">
      <span class="materials-cell materials-name-cell">{{material1}}</span>
      <span class="materials-cell materials-qty-cell">{{qty1}}</span>
    </div>
    <div class="materials-row">
      <span class="materials-cell materials-name-cell">{{material2}}</span>
      <span class="materials-cell materials-qty-cell">{{qty2}}</span>
    </div>
    <div class="materials-row">
      <span class="materials-cell materials-name-cell">{{material3}}</span>
      <span class="materials-cell materials-qty-cell">{{qty3}}</span>
    </div>
    <div class="materials-row">
      <span class="materials-cell materials-name-cell">{{material4}}</span>
      <span class="materials-cell materials-qty-cell">{{qty4}}</span>
    </div>
  </div>
</div>`,
    css: `:scope .materials-section {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .materials-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
  padding: 1.25rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e5e9;
  margin: 0;
}
:scope .materials-table {
  display: flex;
  flex-direction: column;
}
:scope .materials-row {
  display: flex;
  border-bottom: 1px solid #f0f1f3;
}
:scope .materials-row:last-child {
  border-bottom: none;
}
:scope .materials-row:nth-child(odd):not(.materials-header-row) {
  background: #fafbfc;
}
:scope .materials-header-row {
  background: #f1f3f5;
  border-bottom: 2px solid #e2e5e9;
}
:scope .materials-header-row .materials-cell {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
:scope .materials-cell {
  padding: 0.875rem 2rem;
  font-size: 0.9375rem;
  color: #374151;
}
:scope .materials-name-cell {
  flex: 1;
  font-weight: 500;
}
:scope .materials-qty-cell {
  width: 120px;
  flex-shrink: 0;
  text-align: right;
  font-weight: 600;
  color: #1a1f2b;
}
@media (max-width: 640px) {
  :scope .materials-cell {
    padding: 0.75rem 1.25rem;
  }
  :scope .materials-qty-cell {
    width: 80px;
  }
}`,
  },
  {
    id: "license-certifications",
    name: "License & Certifications",
    category: "credentials",
    description: "Badge-style card with license details and verified indicator",
    variables: ["licenseName", "licenseNumber", "issuedBy", "expirationDate"],
    html: `<div class="license-card">
  <div class="license-badge-area">
    <div class="license-seal">
      <span class="seal-check">&#x2713;</span>
    </div>
    <span class="license-verified">Verified</span>
  </div>
  <div class="license-details">
    <h3 class="license-name">{{licenseName}}</h3>
    <div class="license-info-grid">
      <div class="license-info-item">
        <span class="license-info-label">License #</span>
        <span class="license-info-value">{{licenseNumber}}</span>
      </div>
      <div class="license-info-item">
        <span class="license-info-label">Issued By</span>
        <span class="license-info-value">{{issuedBy}}</span>
      </div>
      <div class="license-info-item">
        <span class="license-info-label">Expiration</span>
        <span class="license-info-value">{{expirationDate}}</span>
      </div>
    </div>
  </div>
</div>`,
    css: `:scope .license-card {
  max-width: 600px;
  margin: 2rem auto;
  display: flex;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .license-badge-area {
  flex-shrink: 0;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: #f8f9fa;
  border-right: 1px solid #e2e5e9;
}
:scope .license-seal {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: {{brand.primaryColor}};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px {{brand.primaryColor}};
}
:scope .seal-check {
  font-size: 1.5rem;
  color: #ffffff;
  font-weight: 700;
}
:scope .license-verified {
  font-size: 0.6875rem;
  font-weight: 600;
  color: {{brand.primaryColor}};
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
:scope .license-details {
  flex: 1;
  padding: 1.5rem 2rem;
}
:scope .license-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f1f3;
}
:scope .license-info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
:scope .license-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:scope .license-info-label {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}
:scope .license-info-value {
  font-size: 0.9375rem;
  color: #1a1f2b;
  font-weight: 600;
}
@media (max-width: 640px) {
  :scope .license-card {
    flex-direction: column;
  }
  :scope .license-badge-area {
    width: 100%;
    flex-direction: row;
    padding: 1rem 1.5rem;
    border-right: none;
    border-bottom: 1px solid #e2e5e9;
  }
  :scope .license-details {
    padding: 1.25rem 1.5rem;
  }
}`,
  },
  {
    id: "emergency-contact",
    name: "Emergency Contact",
    category: "credentials",
    description: "Red-accented card with emergency phone, email, hours, and notes",
    variables: ["emergencyPhone", "emergencyEmail", "emergencyHours", "emergencyNote"],
    html: `<div class="emergency-card">
  <div class="emergency-header">
    <span class="emergency-icon">&#x260E;</span>
    <h3 class="emergency-title">Emergency Contact</h3>
  </div>
  <div class="emergency-body">
    <div class="emergency-phone-row">
      <span class="emergency-phone">{{emergencyPhone}}</span>
    </div>
    <div class="emergency-details">
      <div class="emergency-detail">
        <span class="emergency-detail-label">Email</span>
        <span class="emergency-detail-value">{{emergencyEmail}}</span>
      </div>
      <div class="emergency-detail">
        <span class="emergency-detail-label">Hours</span>
        <span class="emergency-detail-value">{{emergencyHours}}</span>
      </div>
    </div>
    <div class="emergency-note-area">
      <p class="emergency-note">{{emergencyNote}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .emergency-card {
  max-width: 500px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
  border-top: 3px solid #dc2626;
}
:scope .emergency-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
}
:scope .emergency-icon {
  font-size: 1.25rem;
  color: #dc2626;
}
:scope .emergency-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #991b1b;
}
:scope .emergency-body {
  padding: 2rem;
}
:scope .emergency-phone-row {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f1f3;
}
:scope .emergency-phone {
  font-size: 1.75rem;
  font-weight: 700;
  color: #dc2626;
  letter-spacing: 0.02em;
}
:scope .emergency-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
:scope .emergency-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}
:scope .emergency-detail-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
:scope .emergency-detail-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1f2b;
}
:scope .emergency-note-area {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border-left: 3px solid #d1d5db;
}
:scope .emergency-note {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.6;
  font-style: italic;
}
@media (max-width: 640px) {
  :scope .emergency-body {
    padding: 1.5rem;
  }
  :scope .emergency-phone {
    font-size: 1.5rem;
  }
  :scope .emergency-detail {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.125rem;
  }
}`,
  },
  {
    id: "change-order",
    name: "Change Order / Additional Work",
    category: "scope",
    description: "Formal change order with original scope, change description, cost impact, and approval",
    variables: ["changeOrderNumber", "originalScope", "changeDescription", "costImpact", "scheduleImpact", "approvalNote"],
    html: `<div class="change-order">
  <div class="co-header">
    <div class="co-badge">CHANGE ORDER</div>
    <span class="co-number">#{{changeOrderNumber}}</span>
  </div>
  <div class="co-body">
    <div class="co-section">
      <h4 class="co-label">Original Scope</h4>
      <p class="co-text">{{originalScope}}</p>
    </div>
    <div class="co-section co-highlight">
      <h4 class="co-label">Requested Change</h4>
      <p class="co-text">{{changeDescription}}</p>
    </div>
    <div class="co-impacts">
      <div class="co-impact">
        <span class="co-impact-label">Cost Impact</span>
        <span class="co-impact-value">{{costImpact}}</span>
      </div>
      <div class="co-impact">
        <span class="co-impact-label">Schedule Impact</span>
        <span class="co-impact-value">{{scheduleImpact}}</span>
      </div>
    </div>
    <div class="co-approval">
      <p class="co-approval-text">{{approvalNote}}</p>
      <div class="co-sig-row">
        <div class="co-sig-block">
          <div class="co-sig-line"></div>
          <span class="co-sig-label">Customer Signature</span>
        </div>
        <div class="co-sig-block">
          <div class="co-sig-line"></div>
          <span class="co-sig-label">Date</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
    css: `:scope .change-order {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .co-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
}
:scope .co-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #92400e;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.75rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.25rem;
}
:scope .co-number {
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
}
:scope .co-body {
  padding: 2rem;
}
:scope .co-section {
  margin-bottom: 1.5rem;
}
:scope .co-highlight {
  padding: 1.25rem;
  background: #f0f9ff;
  border-radius: 0.375rem;
  border-left: 3px solid {{brand.primaryColor}};
}
:scope .co-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .co-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
}
:scope .co-impacts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
}
:scope .co-impact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
:scope .co-impact-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
:scope .co-impact-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .co-approval {
  border-top: 1px solid #e2e5e9;
  padding-top: 1.5rem;
}
:scope .co-approval-text {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
:scope .co-sig-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
:scope .co-sig-block {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
:scope .co-sig-line {
  height: 2rem;
  border-bottom: 1px solid #9ca3af;
}
:scope .co-sig-label {
  font-size: 0.75rem;
  color: #6b7280;
}
@media (max-width: 640px) {
  :scope .co-body {
    padding: 1.5rem;
  }
  :scope .co-impacts {
    grid-template-columns: 1fr;
  }
  :scope .co-sig-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}`,
  },
  {
    id: "customer-responsibilities",
    name: "Customer Responsibilities",
    category: "legal",
    description: "Checklist of what the customer must do before or during the job",
    variables: ["responsibilitiesTitle", "responsibility1", "responsibility2", "responsibility3", "responsibility4", "responsibilityNote"],
    html: `<div class="cust-resp">
  <div class="cr-header">
    <span class="cr-icon">&#x2705;</span>
    <h3 class="cr-title">{{responsibilitiesTitle}}</h3>
  </div>
  <div class="cr-body">
    <ul class="cr-list">
      <li class="cr-item"><span class="cr-check">&#x2610;</span><span class="cr-text">{{responsibility1}}</span></li>
      <li class="cr-item"><span class="cr-check">&#x2610;</span><span class="cr-text">{{responsibility2}}</span></li>
      <li class="cr-item"><span class="cr-check">&#x2610;</span><span class="cr-text">{{responsibility3}}</span></li>
      <li class="cr-item"><span class="cr-check">&#x2610;</span><span class="cr-text">{{responsibility4}}</span></li>
    </ul>
    <div class="cr-note">
      <p class="cr-note-text">{{responsibilityNote}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .cust-resp {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .cr-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e5e9;
}
:scope .cr-icon {
  font-size: 1.25rem;
}
:scope .cr-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .cr-body {
  padding: 2rem;
}
:scope .cr-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}
:scope .cr-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f0f1f3;
}
:scope .cr-item:last-child {
  border-bottom: none;
}
:scope .cr-check {
  flex-shrink: 0;
  font-size: 1.125rem;
  color: {{brand.primaryColor}};
  line-height: 1.4;
}
:scope .cr-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.6;
}
:scope .cr-note {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #fffbeb;
  border-radius: 0.375rem;
  border-left: 3px solid #f59e0b;
}
:scope .cr-note-text {
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.6;
  font-style: italic;
}
@media (max-width: 640px) {
  :scope .cr-body {
    padding: 1.5rem;
  }
}`,
  },
  {
    id: "dispute-resolution",
    name: "Dispute Resolution / Arbitration",
    category: "legal",
    description: "Step-by-step dispute resolution process with mediation and arbitration clauses",
    variables: ["step1Title", "step1Text", "step2Title", "step2Text", "step3Title", "step3Text", "jurisdiction"],
    html: `<div class="dispute-section">
  <h2 class="dispute-heading">Dispute Resolution</h2>
  <div class="dispute-steps">
    <div class="dispute-step">
      <div class="step-marker"><span class="step-num">1</span></div>
      <div class="step-body">
        <h4 class="step-title">{{step1Title}}</h4>
        <p class="step-text">{{step1Text}}</p>
      </div>
    </div>
    <div class="dispute-step">
      <div class="step-marker"><span class="step-num">2</span></div>
      <div class="step-body">
        <h4 class="step-title">{{step2Title}}</h4>
        <p class="step-text">{{step2Text}}</p>
      </div>
    </div>
    <div class="dispute-step">
      <div class="step-marker"><span class="step-num">3</span></div>
      <div class="step-body">
        <h4 class="step-title">{{step3Title}}</h4>
        <p class="step-text">{{step3Text}}</p>
      </div>
    </div>
  </div>
  <div class="dispute-jurisdiction">
    <span class="dispute-jur-label">Governing Jurisdiction:</span>
    <span class="dispute-jur-value">{{jurisdiction}}</span>
  </div>
</div>`,
    css: `:scope .dispute-section {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
}
:scope .dispute-heading {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1a1f2b;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid {{brand.primaryColor}};
}
:scope .dispute-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}
:scope .dispute-step {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #f0f1f3;
}
:scope .dispute-step:last-child {
  border-bottom: none;
}
:scope .step-marker {
  flex-shrink: 0;
}
:scope .step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: {{brand.primaryColor}};
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
}
:scope .step-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1f2b;
  margin-bottom: 0.375rem;
}
:scope .step-text {
  font-size: 0.9375rem;
  color: #4a5568;
  line-height: 1.7;
}
:scope .dispute-jurisdiction {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
:scope .dispute-jur-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
}
:scope .dispute-jur-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1f2b;
}
@media (max-width: 640px) {
  :scope .dispute-section {
    padding: 1.5rem;
  }
}`,
  },
  {
    id: "safety-access-requirements",
    name: "Safety & Access Requirements",
    category: "scope",
    description: "Job site safety protocols, hazardous materials, access hours, and key handling",
    variables: ["accessHours", "accessInstructions", "safetyRequirements", "hazardousDisclosure", "keyHandling"],
    html: `<div class="safety-section">
  <div class="safety-header">
    <span class="safety-icon">&#x26A0;&#xFE0F;</span>
    <h3 class="safety-title">Safety & Access Requirements</h3>
  </div>
  <div class="safety-body">
    <div class="safety-grid">
      <div class="safety-card">
        <h4 class="safety-card-label">Access Hours</h4>
        <p class="safety-card-value">{{accessHours}}</p>
      </div>
      <div class="safety-card">
        <h4 class="safety-card-label">Key / Code Handling</h4>
        <p class="safety-card-value">{{keyHandling}}</p>
      </div>
    </div>
    <div class="safety-field">
      <h4 class="safety-field-label">Access Instructions</h4>
      <p class="safety-field-text">{{accessInstructions}}</p>
    </div>
    <div class="safety-field">
      <h4 class="safety-field-label">Safety Requirements</h4>
      <p class="safety-field-text">{{safetyRequirements}}</p>
    </div>
    <div class="safety-hazard">
      <h4 class="safety-hazard-label">&#x2622;&#xFE0F; Hazardous Materials Disclosure</h4>
      <p class="safety-hazard-text">{{hazardousDisclosure}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .safety-section {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .safety-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
}
:scope .safety-icon {
  font-size: 1.25rem;
}
:scope .safety-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #991b1b;
}
:scope .safety-body {
  padding: 2rem;
}
:scope .safety-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
:scope .safety-card {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #e2e5e9;
}
:scope .safety-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.375rem;
}
:scope .safety-card-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1f2b;
  line-height: 1.5;
}
:scope .safety-field {
  margin-bottom: 1.5rem;
}
:scope .safety-field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .safety-field-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
}
:scope .safety-hazard {
  padding: 1.25rem;
  background: #fef2f2;
  border-radius: 0.375rem;
  border-left: 3px solid #ef4444;
}
:scope .safety-hazard-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 0.5rem;
}
:scope .safety-hazard-text {
  font-size: 0.9375rem;
  color: #7f1d1d;
  line-height: 1.6;
}
@media (max-width: 640px) {
  :scope .safety-body {
    padding: 1.5rem;
  }
  :scope .safety-grid {
    grid-template-columns: 1fr;
  }
}`,
  },
  {
    id: "completion-acceptance",
    name: "Completion & Acceptance",
    category: "scope",
    description: "Customer sign-off that work is complete with walk-through checklist and acceptance",
    variables: ["completionTitle", "checkItem1", "checkItem2", "checkItem3", "checkItem4", "acceptanceText"],
    html: `<div class="completion-section">
  <div class="comp-header">
    <span class="comp-icon">&#x1F3C6;</span>
    <h3 class="comp-title">{{completionTitle}}</h3>
  </div>
  <div class="comp-body">
    <h4 class="comp-sub">Walk-Through Checklist</h4>
    <div class="comp-checklist">
      <label class="comp-check-item"><span class="comp-checkbox">&#x2610;</span>{{checkItem1}}</label>
      <label class="comp-check-item"><span class="comp-checkbox">&#x2610;</span>{{checkItem2}}</label>
      <label class="comp-check-item"><span class="comp-checkbox">&#x2610;</span>{{checkItem3}}</label>
      <label class="comp-check-item"><span class="comp-checkbox">&#x2610;</span>{{checkItem4}}</label>
    </div>
    <div class="comp-acceptance">
      <p class="comp-accept-text">{{acceptanceText}}</p>
      <div class="comp-sig-row">
        <div class="comp-sig-block">
          <div class="comp-sig-line"></div>
          <span class="comp-sig-label">Customer Signature</span>
        </div>
        <div class="comp-sig-block">
          <div class="comp-sig-line"></div>
          <span class="comp-sig-label">Date</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
    css: `:scope .completion-section {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .comp-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #f0fdf4;
  border-bottom: 1px solid #bbf7d0;
}
:scope .comp-icon {
  font-size: 1.25rem;
}
:scope .comp-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #166534;
}
:scope .comp-body {
  padding: 2rem;
}
:scope .comp-sub {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
}
:scope .comp-checklist {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 2rem;
}
:scope .comp-check-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f1f3;
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.5;
  cursor: default;
}
:scope .comp-check-item:last-child {
  border-bottom: none;
}
:scope .comp-checkbox {
  flex-shrink: 0;
  font-size: 1.125rem;
  color: {{brand.primaryColor}};
}
:scope .comp-acceptance {
  border-top: 2px solid #e2e5e9;
  padding-top: 1.5rem;
}
:scope .comp-accept-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-weight: 500;
}
:scope .comp-sig-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
:scope .comp-sig-block {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
:scope .comp-sig-line {
  height: 2rem;
  border-bottom: 1px solid #9ca3af;
}
:scope .comp-sig-label {
  font-size: 0.75rem;
  color: #6b7280;
}
@media (max-width: 640px) {
  :scope .comp-body {
    padding: 1.5rem;
  }
  :scope .comp-sig-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}`,
  },
  {
    id: "late-payment-interest",
    name: "Late Payment / Interest",
    category: "payment",
    description: "Late payment terms with fees, interest rates, and collections process",
    variables: ["gracePeriod", "lateFee", "interestRate", "collectionsText", "paymentContactInfo"],
    html: `<div class="late-pay-section">
  <div class="lp-header">
    <span class="lp-icon">&#x23F0;</span>
    <h3 class="lp-title">Late Payment Terms</h3>
  </div>
  <div class="lp-body">
    <div class="lp-grid">
      <div class="lp-stat">
        <span class="lp-stat-label">Grace Period</span>
        <span class="lp-stat-value">{{gracePeriod}}</span>
      </div>
      <div class="lp-stat">
        <span class="lp-stat-label">Late Fee</span>
        <span class="lp-stat-value lp-stat-warn">{{lateFee}}</span>
      </div>
      <div class="lp-stat">
        <span class="lp-stat-label">Monthly Interest</span>
        <span class="lp-stat-value lp-stat-warn">{{interestRate}}</span>
      </div>
    </div>
    <div class="lp-collections">
      <h4 class="lp-collections-label">Collections Process</h4>
      <p class="lp-collections-text">{{collectionsText}}</p>
    </div>
    <div class="lp-contact">
      <p class="lp-contact-text">{{paymentContactInfo}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .late-pay-section {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .lp-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e5e9;
}
:scope .lp-icon {
  font-size: 1.25rem;
}
:scope .lp-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .lp-body {
  padding: 2rem;
}
:scope .lp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
:scope .lp-stat {
  text-align: center;
  padding: 1.25rem 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #e2e5e9;
}
:scope .lp-stat-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .lp-stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1f2b;
}
:scope .lp-stat-warn {
  color: #dc2626;
}
:scope .lp-collections {
  margin-bottom: 1.5rem;
}
:scope .lp-collections-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .lp-collections-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 0.375rem;
  border-left: 3px solid #ef4444;
}
:scope .lp-contact {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
}
:scope .lp-contact-text {
  font-size: 0.8125rem;
  color: #4a5568;
  line-height: 1.5;
}
@media (max-width: 640px) {
  :scope .lp-body {
    padding: 1.5rem;
  }
  :scope .lp-grid {
    grid-template-columns: 1fr;
  }
}`,
  },
  {
    id: "indemnification-hold-harmless",
    name: "Indemnification / Hold Harmless",
    category: "legal",
    description: "Mutual or one-way indemnification clause with defined obligations",
    variables: ["indemnifyTitle", "indemnifyingParty", "indemnifiedParty", "indemnifyScope", "indemnifyExceptions", "indemnifyNote"],
    html: `<div class="indemnify-section">
  <h2 class="indemnify-heading">{{indemnifyTitle}}</h2>
  <div class="indemnify-body">
    <div class="indemnify-parties">
      <div class="indemnify-party">
        <span class="indemnify-party-label">Indemnifying Party</span>
        <span class="indemnify-party-name">{{indemnifyingParty}}</span>
      </div>
      <div class="indemnify-arrow">&#x2192;</div>
      <div class="indemnify-party">
        <span class="indemnify-party-label">Indemnified Party</span>
        <span class="indemnify-party-name">{{indemnifiedParty}}</span>
      </div>
    </div>
    <div class="indemnify-clause">
      <h4 class="indemnify-clause-label">Scope of Indemnification</h4>
      <p class="indemnify-clause-text">{{indemnifyScope}}</p>
    </div>
    <div class="indemnify-clause">
      <h4 class="indemnify-clause-label">Exceptions</h4>
      <p class="indemnify-exceptions-text">{{indemnifyExceptions}}</p>
    </div>
    <div class="indemnify-note">
      <p class="indemnify-note-text">{{indemnifyNote}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .indemnify-section {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
}
:scope .indemnify-heading {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1a1f2b;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid {{brand.primaryColor}};
}
:scope .indemnify-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
:scope .indemnify-parties {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
}
:scope .indemnify-party {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
:scope .indemnify-party-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
:scope .indemnify-party-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1f2b;
}
:scope .indemnify-arrow {
  font-size: 1.5rem;
  color: {{brand.primaryColor}};
  flex-shrink: 0;
}
:scope .indemnify-clause-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .indemnify-clause-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
}
:scope .indemnify-exceptions-text {
  font-size: 0.9375rem;
  color: #4a5568;
  line-height: 1.7;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border-left: 3px solid #d1d5db;
}
:scope .indemnify-note {
  padding: 1rem;
  background: #eff6ff;
  border-radius: 0.375rem;
  border-left: 3px solid {{brand.primaryColor}};
}
:scope .indemnify-note-text {
  font-size: 0.8125rem;
  color: #1e40af;
  line-height: 1.6;
  font-style: italic;
}
@media (max-width: 640px) {
  :scope .indemnify-section {
    padding: 1.5rem;
  }
  :scope .indemnify-parties {
    flex-direction: column;
    gap: 0.5rem;
  }
  :scope .indemnify-arrow {
    transform: rotate(90deg);
  }
}`,
  },
  {
    id: "force-majeure",
    name: "Force Majeure",
    category: "legal",
    description: "Force majeure clause covering weather, supply chain, and acts of God",
    variables: ["fmTitle", "coveredEvents", "notificationPeriod", "mitigationObligation", "terminationRight"],
    html: `<div class="fm-section">
  <div class="fm-header">
    <span class="fm-icon">&#x1F329;&#xFE0F;</span>
    <h3 class="fm-title">{{fmTitle}}</h3>
  </div>
  <div class="fm-body">
    <div class="fm-field">
      <h4 class="fm-label">Covered Events</h4>
      <p class="fm-text">{{coveredEvents}}</p>
    </div>
    <div class="fm-grid">
      <div class="fm-card">
        <h4 class="fm-card-label">Notification Period</h4>
        <p class="fm-card-value">{{notificationPeriod}}</p>
      </div>
      <div class="fm-card">
        <h4 class="fm-card-label">Termination Right</h4>
        <p class="fm-card-value">{{terminationRight}}</p>
      </div>
    </div>
    <div class="fm-field">
      <h4 class="fm-label">Mitigation Obligation</h4>
      <p class="fm-text">{{mitigationObligation}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .fm-section {
  max-width: 700px;
  margin: 2rem auto;
  border: 1px solid #e2e5e9;
  border-radius: 0.5rem;
  background: #ffffff;
  overflow: hidden;
}
:scope .fm-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #f5f3ff;
  border-bottom: 1px solid #ddd6fe;
}
:scope .fm-icon {
  font-size: 1.25rem;
}
:scope .fm-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #5b21b6;
}
:scope .fm-body {
  padding: 2rem;
}
:scope .fm-field {
  margin-bottom: 1.5rem;
}
:scope .fm-field:last-child {
  margin-bottom: 0;
}
:scope .fm-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
:scope .fm-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
}
:scope .fm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
:scope .fm-card {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #e2e5e9;
}
:scope .fm-card-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.375rem;
}
:scope .fm-card-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1f2b;
  line-height: 1.5;
}
@media (max-width: 640px) {
  :scope .fm-body {
    padding: 1.5rem;
  }
  :scope .fm-grid {
    grid-template-columns: 1fr;
  }
}`,
  },
]

export const CONTRACT_BLOCK_CATEGORIES: HtmlBlockCategoryDef[] = [
  { value: "legal", label: "Legal" },
  { value: "scope", label: "Scope" },
  { value: "coverage", label: "Coverage" },
  { value: "payment", label: "Payment" },
  { value: "credentials", label: "Credentials" },
]
