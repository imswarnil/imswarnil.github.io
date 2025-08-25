---
title: Im Jekyll Theme
description: "An open-source Jekyll theme crafted using the Bulma CSS framework. This theme utilizes Bulma SCSS, making it incredibly easy to customize and adapt to your specific needs. With over 7 layouts and 10+ collections"
image: /assets/logos/logo.svg
layout: base
---

<main class="has-grid-bg">

  <!-- HERO -->
  <section class="hero home-hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered is-variable is-6">
          <div class="column is-6 reveal">
            <h1 class="title is-1 has-accent-underline">Clean systems, cinematic stories.</h1>
            <p class="subtitle is-4">I’m <strong>Swarnil</strong> — filmmaker & software engineer. I ship minimal UI, maximal intent.</p>
            <div class="meta u-mb-4">
              <span class="meta-item">📍 Bangalore</span>
              <span class="meta-item">🎬 Story & Editing</span>
              <span class="meta-item">💻 Bulma · CRMA · Jekyll</span>
            </div>
            <div class="u-cluster u-mb-4">
              <a class="button is-primary">View Projects</a>
              <a class="button is-outline">Download Résumé</a>
              <a class="button is-ghost">YouTube</a>
            </div>
            <div class="feature-chips">
              <span class="tag is-badge">Indigo Accent</span>
              <span class="tag is-badge">Soft Cards</span>
              <span class="tag is-badge">Accessible</span>
              <span class="tag is-badge">Responsive</span>
            </div>
          </div>
          <div class="column is-6">
            <figure class="hero-media reveal">
              <img src="/assets/img/hero.jpg" alt="Swarnil filming on set with camera rig">
              <span class="hero-badge">🎥 Latest: <strong>Goa Short</strong> · 3:40</span>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- GALLERY -->
  <section class="section">
    <div class="container">
      <div class="u-cluster" style="justify-content:space-between;align-items:flex-end;">
        <h2 class="title is-2">Recent Frames</h2>
        <a class="button is-ghost" href="#">See all →</a>
      </div>
      <div class="home-gallery u-mt-4 reveal-seq">
        <article class="gallery-item">
          <div class="thumb"><img src="/assets/img/gallery-1.jpg" alt="Coastal sunrise still"></div>
          <div class="caption"><span class="u-muted">Goa • Sunrise</span><span class="tag is-badge">Still</span></div>
        </article>
        <article class="gallery-item">
          <div class="thumb"><img src="/assets/img/gallery-2.jpg" alt="City night lights"></div>
          <div class="caption"><span class="u-muted">Bangalore • Night</span><span class="tag is-badge">Frame</span></div>
        </article>
        <article class="gallery-item">
          <div class="thumb"><img src="/assets/img/gallery-3.jpg" alt="Desk setup minimal"></div>
          <div class="caption"><span class="u-muted">Studio • Setup</span><span class="tag is-badge">Setup</span></div>
        </article>
      </div>
    </div>
  </section>

  <!-- PROJECTS -->
  <section id="work" class="section">
    <div class="container">
      <div class="u-cluster" style="justify-content:space-between;align-items:flex-end;">
        <h2 class="title is-2">Selected Projects</h2>
        <a class="button is-ghost" href="#">All projects →</a>
      </div>
      <div class="home-projects u-mt-4">
        <div class="grid reveal-seq">
          <!-- Project card -->
          <article class="card card--project">
            <div class="thumb"><img src="/assets/img/proj-portfolio.jpg" alt="Portfolio website preview"></div>
            <div class="card-content">
              <h3 class="title is-4">Mono Portfolio</h3>
              <div class="meta">
                <span class="meta-item">🗓️ 2025</span>
                <span class="meta-item">🧩 Bulma</span>
                <span class="meta-item">🎯 Theme + Components</span>
              </div>
              <p class="u-muted">A polished Bulma theme with indigo accent and soft cards.</p>
              <div class="u-cluster">
                <a class="button is-soft">Case Study</a>
                <a class="button is-ghost">GitHub</a>
              </div>
            </div>
          </article>
          <article class="card card--project">
            <div class="thumb"><img src="/assets/img/proj-crma.jpg" alt="CRMA dashboard bento cards"></div>
            <div class="card-content">
              <h3 class="title is-4">CRMA Bento UI</h3>
              <div class="meta">
                <span class="meta-item">🗓️ 2025</span>
                <span class="meta-item">📊 Analytics</span>
                <span class="meta-item">💼 Sales</span>
              </div>
              <p class="u-muted">Contextual dashboards that sell without shouting.</p>
              <div class="u-cluster">
                <a class="button is-soft">Demo</a>
                <a class="button is-ghost">Notes</a>
              </div>
            </div>
          </article>
          <article class="card card--project">
            <div class="thumb"><img src="/assets/img/proj-film.jpg" alt="Travel film thumbnail"></div>
            <div class="card-content">
              <h3 class="title is-4">Goa Travel Film</h3>
              <div class="meta">
                <span class="meta-item">⏱️ 3:40</span>
                <span class="meta-item">🎬 Color · Edit</span>
                <span class="meta-item">🎵 Sound-first</span>
              </div>
              <p class="u-muted">Sunlight, sand, and story with a sound-first cut.</p>
              <div class="u-cluster">
                <a class="button is-soft">Watch</a>
                <a class="button is-ghost">Breakdown</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>

  <!-- EXPERIENCE / RESUME -->
  <section id="experience" class="section home-experience">
    <div class="container">
      <div class="u-cluster" style="justify-content:space-between;align-items:flex-end;">
        <h2 class="title is-2">Experience</h2>
        <a class="button is-outline" href="/assets/Swarnil-Resume.pdf">Download PDF</a>
      </div>

      <div class="columns is-variable is-6 u-mt-4">
        <div class="column is-7">
          <div class="timeline">
            <div class="timeline-item">
              <div class="resume-card">
                <div class="role">
                  <h3 class="title is-5">Software Engineer</h3>
                  <span class="company">· Product Team</span>
                  <span class="dates">2023 — Present</span>
                </div>
                <ul class="bullets">
                  <li>Designed a Bulma-based design system adopted across pages.</li>
                  <li>Built CRMA dashboards that improved deal velocity by 14%.</li>
                  <li>Led accessibility pass—focus rings, contrast, keyboard flow.</li>
                </ul>
                <div class="meta u-mt-4">
                  <span class="meta-item">⚙️ Bulma · JS · CRMA</span>
                  <span class="meta-item">👥 Cross-functional</span>
                </div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="resume-card">
                <div class="role">
                  <h3 class="title is-5">Filmmaker / Editor</h3>
                  <span class="company">· Freelance</span>
                  <span class="dates">2018 — Present</span>
                </div>
                <ul class="bullets">
                  <li>Produced 100+ videos; grew to 17k subscribers documenting journey.</li>
                  <li>Specialized in sound-first edits and travel narratives.</li>
                </ul>
                <div class="meta u-mt-4">
                  <span class="meta-item">🎥 Premiere · Resolve</span>
                  <span class="meta-item">🎧 Sound design</span>
                </div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="resume-card">
                <div class="role">
                  <h3 class="title is-5">Content Creator</h3>
                  <span class="company">· Imswarnil</span>
                  <span class="dates">2016 — 2022</span>
                </div>
                <ul class="bullets">
                  <li>Built a personal brand blending humor and craft.</li>
                  <li>Shipped web series, personal stories, and travel films.</li>
                </ul>
              </div>
            </div>
          </div><!-- /timeline -->
        </div>

        <div class="column is-5">
          <div class="box is-soft">
            <h3 class="title is-5">Skills</h3>
            <div class="u-stack">
              <div>
                <div class="meta u-mb-4"><span class="meta-item">UI Systems</span><span class="meta-item">Design Tokens</span><span class="meta-item">Accessibility</span></div>
                <progress class="progress is-primary" value="80" max="100">80%</progress>
              </div>
              <div>
                <div class="meta u-mb-4"><span class="meta-item">CRMA</span><span class="meta-item">Dashboards</span><span class="meta-item">Storytelling</span></div>
                <progress class="progress is-primary" value="75" max="100">75%</progress>
              </div>
              <div>
                <div class="meta u-mb-4"><span class="meta-item">Editing</span><span class="meta-item">Sound Design</span><span class="meta-item">Color</span></div>
                <progress class="progress is-primary" value="85" max="100">85%</progress>
              </div>
            </div>
          </div>

          <div class="box is-soft u-mt-4">
            <h3 class="title is-5">Now</h3>
            <p class="u-muted">Relaunching YouTube with structured formats; shipping a Bulma-based design system; documenting the process.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS / CTA -->
  <section class="section">
    <div class="container">
      <div class="columns is-variable is-6">
        <div class="column is-7">
          <h2 class="title is-2">By the numbers</h2>
          <div class="stats u-mt-4 reveal-seq">
            <div class="stat"><div class="num">17k</div><div class="label">YT Subs</div></div>
            <div class="stat"><div class="num">100+</div><div class="label">Videos</div></div>
            <div class="stat"><div class="num">9+</div><div class="label">Years</div></div>
            <div class="stat"><div class="num">∞</div><div class="label">Ideas</div></div>
          </div>
        </div>
        <div class="column is-5">
          <div class="cta reveal">
            <div>
              <strong>Let’s build something crisp.</strong>
              <div class="u-muted">Minimal UI for maximum impact.</div>
            </div>
            <div class="actions">
              <a class="button is-primary">Start a project</a>
              <a class="button is-outline">See pricing</a>
            </div>
          </div>
          <div class="brands u-mt-4">
            <img src="/assets/img/brand-1.svg" alt="Brand 1 logo">
            <img src="/assets/img/brand-2.svg" alt="Brand 2 logo">
            <img src="/assets/img/brand-3.svg" alt="Brand 3 logo">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- JOURNAL -->
  <section id="journal" class="section">
    <div class="container">
      <div class="u-cluster" style="justify-content:space-between;">
        <h2 class="title is-2">Journal</h2>
        <a class="button is-ghost">All posts →</a>
      </div>
      <div class="columns is-variable is-5 u-mt-4">
        <div class="column is-6">
          <article class="box is-soft reveal">
            <h3 class="title is-4">Indigo over Noise</h3>
            <div class="meta"><span class="meta-item">🗓️ Aug 2025</span><span class="meta-item">⏱️ 4 min</span><span class="meta-item">UI</span></div>
            <p class="u-muted">How one accent color brings order to chaos.</p>
          </article>
        </div>
        <div class="column is-6">
          <article class="box is-soft reveal">
            <h3 class="title is-4">Soft Card Pattern</h3>
            <div class="meta"><span class="meta-item">🗓️ Aug 2025</span><span class="meta-item">⏱️ 3 min</span><span class="meta-item">Design</span></div>
            <p class="u-muted">Shadows, borders, and the quiet middle ground.</p>
          </article>
        </div>
      </div>
    </div>
  </section>

  <!-- CONTACT / SUBSCRIBE -->
  <section id="contact" class="section">
    <div class="container">
      <div class="columns is-variable is-6">
        <div class="column is-6">
          <h2 class="title is-2">Contact</h2>
          <form class="u-stack u-mt-4" action="https://formspree.io/f/xyz" method="POST">
            <div class="field">
              <label class="label">Name</label>
              <div class="control"><input class="input" name="name" placeholder="Your name" required></div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control"><input class="input" name="email" type="email" placeholder="you@example.com" required></div>
            </div>
            <div class="field">
              <label class="label">Message</label>
              <div class="control"><textarea class="textarea" name="message" rows="4" placeholder="Tell me about your project" required></textarea></div>
            </div>
            <button class="button is-primary">Send</button>
          </form>
        </div>
        <div class="column is-5 is-offset-1">
          <h2 class="title is-2">Subscribe</h2>
          <p class="u-muted">Minimal notes on design, code, and films.</p>
          <div class="u-stack u-mt-4">
            <div class="input-addon">
              <input class="input" type="email" placeholder="you@example.com" aria-label="Email for newsletter">
              <button class="button">Subscribe</button>
            </div>
            <div class="u-cluster">
              <span class="tag is-badge">No spam</span>
              <span class="tag is-badge">Plain text</span>
              <span class="tag is-badge">1×/month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>
