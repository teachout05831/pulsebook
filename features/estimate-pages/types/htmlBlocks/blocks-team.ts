import type { HtmlBlock } from "./types";

export const TEAM_BLOCKS: HtmlBlock[] = [
  {
    id: "team-member-card",
    name: "Team Member Card",
    category: "team",
    description: "Single team member with photo, name, role, and bio",
    variables: ["memberName", "memberRole", "memberBio"],
    html: `<div class="team-member">
  <div class="team-photo-placeholder">👤</div>
  <h3 class="team-name">{{memberName}}</h3>
  <p class="team-role">{{memberRole}}</p>
  <p class="team-bio">{{memberBio}}</p>
</div>`,
    css: `:scope .team-member {
  max-width: 350px;
  margin: 2rem auto;
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
:scope .team-photo-placeholder {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #1e3a8a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
}
:scope .team-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}
:scope .team-role {
  font-size: 1rem;
  color: {{brand.primaryColor}};
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:scope .team-bio {
  color: #6b7280;
  line-height: 1.7;
}`,
  },
];
