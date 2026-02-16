import type { HtmlBlock } from "./types";

export const CONTENT_BLOCKS_5: HtmlBlock[] = [
  {
    id: "project-timeline",
    name: "Project Timeline",
    category: "content",
    description: "Visual timeline showing project phases with dates",
    variables: ["phase1", "phase1Date", "phase2", "phase2Date", "phase3", "phase3Date", "phase4", "phase4Date"],
    html: `<div class="project-timeline">
  <h3 class="timeline-heading">Project Timeline</h3>
  <div class="timeline-track">
    <div class="timeline-item">
      <div class="timeline-marker">1</div>
      <div class="timeline-info">
        <div class="timeline-phase">{{phase1}}</div>
        <div class="timeline-date">{{phase1Date}}</div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-marker">2</div>
      <div class="timeline-info">
        <div class="timeline-phase">{{phase2}}</div>
        <div class="timeline-date">{{phase2Date}}</div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-marker">3</div>
      <div class="timeline-info">
        <div class="timeline-phase">{{phase3}}</div>
        <div class="timeline-date">{{phase3Date}}</div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-marker">4</div>
      <div class="timeline-info">
        <div class="timeline-phase">{{phase4}}</div>
        <div class="timeline-date">{{phase4Date}}</div>
      </div>
    </div>
  </div>
</div>`,
    css: `:scope .project-timeline {
  padding: 2.5rem;
  background: white;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  margin: 2rem 0;
}
:scope .timeline-heading {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  text-align: center;
  margin-bottom: 3rem;
}
:scope .timeline-track {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 1rem;
}
:scope .timeline-track:before {
  content: "";
  position: absolute;
  top: 30px;
  left: 10%;
  right: 10%;
  height: 3px;
  background: linear-gradient(90deg, {{brand.primaryColor}} 0%, #e5e7eb 100%);
  z-index: 0;
}
:scope .timeline-item {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
}
:scope .timeline-marker {
  width: 60px;
  height: 60px;
  background: {{brand.primaryColor}};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  border: 4px solid white;
}
:scope .timeline-info {
  background: #f9fafb;
  padding: 1.25rem;
  border-radius: 8px;
  min-height: 100px;
}
:scope .timeline-phase {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}
:scope .timeline-date {
  font-size: 0.875rem;
  color: {{brand.primaryColor}};
  font-weight: 600;
}
@media (max-width: 1024px) {
  :scope .timeline-track {
    flex-direction: column;
    gap: 2rem;
  }
  :scope .timeline-track:before {
    display: none;
  }
  :scope .timeline-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    text-align: left;
  }
  :scope .timeline-marker {
    margin: 0;
    flex-shrink: 0;
  }
  :scope .timeline-info {
    flex: 1;
  }
}`,
  },
];
