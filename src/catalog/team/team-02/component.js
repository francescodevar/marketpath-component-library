import { teamFields } from '../shared-fields.js';

export default {
  id: 'team-02',
  name: 'Team Member Roster',
  category: 'team',
  prefix: 'team_',
  sharedFieldsId: 'team',
  customCss: false,
  customJs: false,
  bootstrapJs: false,
  datastoreId: 'team-members',
  description: 'A compact editorial team roster with profiles, portraits, and direct contact links from the shared datastore.',
  tags: ['team', 'staff', 'people', 'roster', 'datastore'],
  template: `{%- if entity.team_members.is_valid -%}
<section class="team-02 bg-white py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-start">
      <div class="col-12 col-lg-4">
        {%- if entity.team_section_title.is_valid -%}
        <h2 class="display-5 fw-bold text-dark mb-3">{{ entity.team_section_title }}</h2>
        {%- endif -%}
        {%- if entity.team_intro_text.is_valid -%}
        <p class="lead text-secondary mb-4">{{ entity.team_intro_text }}</p>
        {%- endif -%}
        <p class="small text-primary text-uppercase fw-bold mb-0">People first. Always.</p>
      </div>

      <div class="col-12 col-lg-8">
        <div class="d-grid">
          {%- for member in entity.team_members -%}
          <article class="row g-4 align-items-center py-4 border-bottom">
            <div class="col-12 col-sm-4">
              <div class="ratio ratio-1x1 bg-secondary-subtle overflow-hidden rounded-3">
                {%- if member.team_member_image.is_valid -%}
                {%- img member.team_member_image preset:"300x300-max webp" class:"w-100 h-100 object-fit-cover" alt:member.team_member_image.alt|default:member.title link:false loading:"lazy" -%}
                {%- else -%}
                <div class="d-flex align-items-center justify-content-center text-secondary"><i class="bi bi-person-fill display-1" aria-hidden="true"></i></div>
                {%- endif -%}
              </div>
            </div>
            <div class="col-12 col-sm-8">
              {%- if member.title.is_valid -%}
              <h3 class="h4 fw-bold text-dark mb-1">{{ member.title }}</h3>
              {%- endif -%}
              {%- if member.team_member_role.is_valid -%}
              <p class="small text-primary fw-semibold mb-3">{{ member.team_member_role }}</p>
              {%- endif -%}
              {%- if member.team_member_bio.is_valid -%}
              <div class="text-secondary lh-lg mb-3">{{ member.team_member_bio }}</div>
              {%- endif -%}
              {%- if member.team_member_phone.is_valid or member.team_member_email.is_valid or member.team_member_social_media.is_valid -%}
              <div class="d-flex flex-wrap align-items-center gap-3">
                {%- if member.team_member_phone.is_valid -%}
                {%- assign member_phone_href = member.team_member_phone.value | remove: " " | remove: "(" | remove: ")" | remove: "-" | remove: "." -%}
                <a class="small text-secondary text-decoration-none" href="tel:{{ member_phone_href | escape }}"><i class="bi bi-telephone me-1" aria-hidden="true"></i>{{ member.team_member_phone }}</a>
                {%- endif -%}
                {%- if member.team_member_email.is_valid -%}
                <a class="small text-secondary text-decoration-none" href="mailto:{{ member.team_member_email.value | escape }}"><i class="bi bi-envelope me-1" aria-hidden="true"></i>{{ member.team_member_email }}</a>
                {%- endif -%}
                {%- if member.team_member_social_media.is_valid -%}
                  {%- for social in member.team_member_social_media -%}
                    {%- if social.social_media_link.is_valid -%}
                    <a class="text-secondary" href="{{ social.social_media_link.value | escape }}" target="_blank" rel="noopener noreferrer" aria-label="{{ member.title | escape }} on {{ social.social_media_platform.value | escape }}">
                      {%- case social.social_media_platform.value -%}
                        {%- when "Facebook" -%}<i class="bi bi-facebook" aria-hidden="true"></i>
                        {%- when "Instagram" -%}<i class="bi bi-instagram" aria-hidden="true"></i>
                        {%- when "YouTube" -%}<i class="bi bi-youtube" aria-hidden="true"></i>
                        {%- when "LinkedIn" -%}<i class="bi bi-linkedin" aria-hidden="true"></i>
                        {%- when "X" -%}<i class="bi bi-twitter-x" aria-hidden="true"></i>
                        {%- when "TikTok" -%}<i class="bi bi-tiktok" aria-hidden="true"></i>
                      {%- endcase -%}
                    </a>
                    {%- endif -%}
                  {%- endfor -%}
                {%- endif -%}
              </div>
              {%- endif -%}
            </div>
          </article>
          {%- endfor -%}
        </div>
      </div>
    </div>
  </div>
</section>
{%- endif -%}`,
  fields: teamFields,
  notes: [
    'The roster uses the same Page Fields and Team Members datastore as Team Member Cards.',
    'Each datastore item title is the person’s name. Portrait, role, biography, email, and LinkedIn URL are item fields.',
    'Create the 300x300-max image preset in Marketpath and replace the shared datastore GUID placeholder.',
    'Bootstrap Icons CSS is needed for the portrait fallback and contact icons.',
  ],
  preview: {
    html: `<section class="team-02 bg-white py-5">
  <div class="container py-2">
    <div class="row g-5 align-items-start">
      <div class="col-12 col-lg-4"><h2 class="display-5 fw-bold text-dark mb-3">Meet the team</h2><p class="lead text-secondary mb-4">The people behind the work, bringing care and experience to every project.</p><p class="small text-primary text-uppercase fw-bold mb-0">People first. Always.</p></div>
      <div class="col-12 col-lg-8"><div class="d-grid">
        <article class="row g-4 align-items-center py-4 border-bottom"><div class="col-12 col-sm-4"><div class="ratio ratio-1x1 bg-secondary-subtle overflow-hidden rounded-3"><img src="sample-image:team-female" class="w-100 h-100 object-fit-cover" alt="Jane Smith"></div></div><div class="col-12 col-sm-8"><h3 class="h4 fw-bold text-dark mb-1">Jane Smith</h3><p class="small text-primary fw-semibold mb-3">Project Manager</p><p class="text-secondary lh-lg mb-3">Jane helps each project move forward with clear communication and careful planning.</p><div class="d-flex flex-wrap align-items-center gap-3"><a class="small text-secondary text-decoration-none" href="#"><i class="bi bi-telephone me-1" aria-hidden="true"></i>(555) 010-2020</a><a class="small text-secondary text-decoration-none" href="#"><i class="bi bi-envelope me-1" aria-hidden="true"></i>jane@example.com</a><a class="text-secondary" href="#" aria-label="Jane Smith on LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a><a class="text-secondary" href="#" aria-label="Jane Smith on Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a></div></div></article>
        <article class="row g-4 align-items-center py-4 border-bottom"><div class="col-12 col-sm-4"><div class="ratio ratio-1x1 bg-secondary-subtle overflow-hidden rounded-3"><img src="sample-image:team-male" class="w-100 h-100 object-fit-cover" alt="John Doe"></div></div><div class="col-12 col-sm-8"><h3 class="h4 fw-bold text-dark mb-1">John Doe</h3><p class="small text-primary fw-semibold mb-3">Site Supervisor</p><p class="text-secondary lh-lg mb-3">John keeps the details organized and makes sure every stage is completed with care.</p><div class="d-flex flex-wrap align-items-center gap-3"><a class="small text-secondary text-decoration-none" href="#"><i class="bi bi-telephone me-1" aria-hidden="true"></i>(555) 010-2021</a><a class="small text-secondary text-decoration-none" href="#"><i class="bi bi-envelope me-1" aria-hidden="true"></i>john@example.com</a><a class="text-secondary" href="#" aria-label="John Doe on LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a></div></div></article>
        <article class="row g-4 align-items-center py-4 border-bottom"><div class="col-12 col-sm-4"><div class="ratio ratio-1x1 bg-secondary-subtle overflow-hidden rounded-3"><img src="sample-image:team-female" class="w-100 h-100 object-fit-cover" alt="Jane Smith"></div></div><div class="col-12 col-sm-8"><h3 class="h4 fw-bold text-dark mb-1">Jane Smith</h3><p class="small text-primary fw-semibold mb-3">Client Care</p><p class="text-secondary lh-lg mb-3">Jane is here to answer questions and help make every interaction feel straightforward.</p><div class="d-flex flex-wrap align-items-center gap-3"><a class="small text-secondary text-decoration-none" href="#"><i class="bi bi-telephone me-1" aria-hidden="true"></i>(555) 010-2022</a><a class="small text-secondary text-decoration-none" href="#"><i class="bi bi-envelope me-1" aria-hidden="true"></i>jane@example.com</a><a class="text-secondary" href="#" aria-label="Jane Smith on Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a></div></div></article>
      </div></div>
    </div>
  </div>
</section>`,
  },
  mockData: {
    section_title: 'Meet the team',
    intro_text: 'The people behind the work, bringing care and experience to every project.',
    team_members: [
      { title: 'Jane Smith', team_member_role: 'Project Manager', team_member_bio: '<p>Jane helps each project move forward with clear communication and careful planning.</p>', team_member_phone: '(555) 010-2020', team_member_email: 'jane@example.com', team_member_social_media: [{ social_media_platform: 'LinkedIn', social_media_link: 'https://www.linkedin.com/' }, { social_media_platform: 'Instagram', social_media_link: 'https://www.instagram.com/' }] },
      { title: 'John Doe', team_member_role: 'Site Supervisor', team_member_bio: '<p>John keeps the details organized and makes sure every stage is completed with care.</p>', team_member_phone: '(555) 010-2021', team_member_email: 'john@example.com', team_member_social_media: [{ social_media_platform: 'LinkedIn', social_media_link: 'https://www.linkedin.com/' }] },
      { title: 'Jane Smith', team_member_role: 'Client Care', team_member_bio: '<p>Jane is here to answer questions and help make every interaction feel straightforward.</p>', team_member_phone: '(555) 010-2022', team_member_email: 'jane@example.com', team_member_social_media: [{ social_media_platform: 'Instagram', social_media_link: 'https://www.instagram.com/' }] },
    ],
  },
};
