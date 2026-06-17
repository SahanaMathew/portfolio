/* ============================================================
   RENDER — puts your content.js onto the page.
   You normally never need to touch this file.
   ============================================================ */

(function renderSite() {
  // window.SITE_CONTENT was set by content.js (defaults) and may have been
  // replaced with the live content by boot.js before this runs.
  const C = window.SITE_CONTENT;
  if (!C) return;

  const esc = (s) => String(s == null ? "" : s);

  // Page title
  if (C.pageTitle) document.title = C.pageTitle;

  // Fill any element that has  data-content="key"  (and make it editable)
  document.querySelectorAll("[data-content]").forEach((el) => {
    const key = el.getAttribute("data-content");
    if (C[key] != null) el.innerHTML = C[key];
    el.setAttribute("data-edit", key);
  });

  const setHTML = (selector, html) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  };

  // Profile photo (stored in content.js as heroImage)
  const profileImg = document.getElementById("profileImg");
  if (profileImg && C.heroImage) profileImg.src = C.heroImage;

  // Hero stats
  setHTML("#heroStats", (C.heroStats || []).map((s, i) => `
    <div class="stat-item">
      <span class="stat-number" data-edit="heroStats.${i}.number">${esc(s.number)}</span>
      <span class="stat-label" data-edit="heroStats.${i}.label">${esc(s.label)}</span>
    </div>`).join(""));

  // Hero floating cards
  setHTML("#heroCards", (C.heroCards || []).map((c, i) => `
    <div class="floating-card card-${i + 1}">
      <i class="${esc(c.icon)}"></i>
      <span data-edit="heroCards.${i}.text">${esc(c.text)}</span>
    </div>`).join(""));

  // About paragraphs
  setHTML("#aboutParagraphs", (C.aboutParagraphs || []).map((p, i) =>
    `<p${i === 0 ? ' class="about-intro"' : ""} data-edit="aboutParagraphs.${i}">${p}</p>`).join(""));

  // About highlights
  setHTML("#aboutHighlights", (C.aboutHighlights || []).map((h, i) => `
    <div class="highlight-item">
      <i class="fas fa-check-circle"></i>
      <span data-edit="aboutHighlights.${i}">${esc(h)}</span>
    </div>`).join(""));

  // Education list
  setHTML("#educationList", (C.education || []).map((e, i) => `
    <div class="education-item">
      <h4 data-edit="education.${i}.degree">${esc(e.degree)}</h4>
      <p data-edit="education.${i}.school">${esc(e.school)}</p>
      <span class="year" data-edit="education.${i}.year">${esc(e.year)}</span>
    </div>`).join(""));

  // Experience timeline
  setHTML("#timeline", (C.experience || []).map((job, i) => `
    <div class="timeline-item" data-aos="fade-up">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <div>
            <h3 data-edit="experience.${i}.role">${esc(job.role)}</h3>
            <h4 data-edit="experience.${i}.company">${esc(job.company)}</h4>
          </div>
          <div class="timeline-meta">
            <span class="timeline-date" data-edit="experience.${i}.date">${esc(job.date)}</span>
            <span class="timeline-location"><i class="fas fa-map-marker-alt"></i> <span data-edit="experience.${i}.location">${esc(job.location)}</span></span>
          </div>
        </div>
        <ul class="timeline-list">
          ${(job.points || []).map((p, j) => `<li data-edit="experience.${i}.points.${j}">${esc(p)}</li>`).join("")}
        </ul>
        <div class="tech-tags">
          ${(job.tags || []).map((t, j) => `<span class="tech-tag" data-edit="experience.${i}.tags.${j}">${esc(t)}</span>`).join("")}
        </div>
      </div>
    </div>`).join(""));

  // Projects grid
  setHTML("#projectsGrid", (C.projects || []).map((p, i) => `
    <div class="project-card" data-aos="fade-up">
      <div class="project-header">
        <div class="project-icon"><i class="${esc(p.icon)}"></i></div>
        <span class="project-badge" data-edit="projects.${i}.badge">${esc(p.badge)}</span>
      </div>
      <h3 class="project-title" data-edit="projects.${i}.title">${esc(p.title)}</h3>
      <p class="project-description" data-edit="projects.${i}.description">${p.description}</p>
      <div class="project-highlights">
        ${(p.highlights || []).map((h, j) => `
          <div class="highlight"><i class="fas fa-check"></i><span data-edit="projects.${i}.highlights.${j}">${esc(h)}</span></div>`).join("")}
      </div>
      <div class="project-tech">
        ${(p.tech || []).map((t, j) => `<span class="tech-pill" data-edit="projects.${i}.tech.${j}">${esc(t)}</span>`).join("")}
      </div>
    </div>`).join(""));

  // Skills grid
  setHTML("#skillsGrid", (C.skills || []).map((cat, i) => `
    <div class="skill-category${cat.wide ? " skill-category-wide" : ""}" data-aos="fade-up">
      <div class="category-header">
        <div class="category-icon"><i class="${esc(cat.icon)}"></i></div>
        <h3 data-edit="skills.${i}.title">${esc(cat.title)}</h3>
      </div>
      <div class="skill-items">
        ${(cat.items || []).map((it, j) => `
          <div class="skill-item"><i class="${esc(it.icon)}"></i><span data-edit="skills.${i}.items.${j}.name">${esc(it.name)}</span></div>`).join("")}
      </div>
    </div>`).join(""));

  // Contact info cards
  setHTML("#contactInfo", `
    <div class="contact-card" data-aos="fade-up">
      <div class="contact-icon"><i class="fas fa-envelope"></i></div>
      <h3>Email</h3>
      <a href="mailto:${esc(C.email)}" data-edit="email">${esc(C.email)}</a>
    </div>
    <div class="contact-card" data-aos="fade-up">
      <div class="contact-icon"><i class="fas fa-phone"></i></div>
      <h3>Phone</h3>
      <a href="tel:${esc((C.phone || "").replace(/\s+/g, ""))}" data-edit="phone">${esc(C.phone)}</a>
    </div>
    <div class="contact-card" data-aos="fade-up">
      <div class="contact-icon"><i class="fab fa-linkedin"></i></div>
      <h3>LinkedIn</h3>
      <a href="${esc(C.linkedinUrl)}" target="_blank" rel="noopener noreferrer" data-edit="linkedinText">${esc(C.linkedinText)}</a>
    </div>
    <div class="contact-card" data-aos="fade-up">
      <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
      <h3>Location</h3>
      <p data-edit="location">${esc(C.location)}</p>
    </div>`);

  // Footer social links
  const fb = document.querySelector("#footerSocial");
  if (fb) {
    fb.innerHTML = `
      <a href="mailto:${esc(C.email)}" aria-label="Email"><i class="fas fa-envelope"></i></a>
      <a href="${esc(C.linkedinUrl)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
      <a href="tel:${esc((C.phone || "").replace(/\s+/g, ""))}" aria-label="Phone"><i class="fas fa-phone"></i></a>`;
  }
})();
