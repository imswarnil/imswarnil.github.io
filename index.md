---
title: Im Jekyll Theme
description: "An open-source Jekyll theme crafted using the Bulma CSS framework. This theme utilizes Bulma SCSS, making it incredibly easy to customize and adapt to your specific needs. With over 7 layouts and 10+ collections"
image: /assets/logos/logo.svg
layout: base
permalink: /
hero_video_url: "https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
---
<style>
/* ===========================================================
   Compact, Wide Hero (Bulma-friendly, CSS-only)
   - Wider container (max 1240px)
   - Shorter hero height (reduced padding, trimmed content in-row)
   - Info is spread across a slim bottom bar (meta + stack)
   - Photo first on mobile; side-by-side on desktop
   - No SCSS features; plain CSS
   =========================================================== */

/* ---- Layout shell overrides for Bulma hero ---- */
.hero.hero-profile.is-medium { min-height: unset; }
.hero.hero-profile .hero-body { padding-block: clamp(1.5rem, 3.5vw, 3rem); }

/* ---- Container ---- */
.hero-profile__inner {
  max-width: 1240px;  /* wider */
  margin: 0 auto;
  padding-inline: 1.25rem;
  display: grid;
  gap: 1.25rem;
  align-items: center;
  grid-template-columns: 1fr;
}

/* 2-col at desktop, with tighter ratio to save height */
@media (min-width: 992px){
  .hero-profile__inner { grid-template-columns: 1.05fr .95fr; gap: 2rem; }
}

/* ---- MEDIA (image + floats) ---- */
.hero-profile__media { order: -1; position: relative; }
@media (min-width: 992px){ .hero-profile__media { order: 2; } }

.hero-profile__pic {
  position: relative;
  border: 1px solid #e6eaf2;
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15,23,42,.10);
}
.hero-profile__pic img { display: block; width: 100%; height: auto; }

/* Floating chips kept minimal & small so hero doesn’t grow */
.hero-profile__float {
  position: absolute; inset: auto 0 0 auto; transform: translate(8px, 8px);
  display: grid; gap: .35rem; justify-items: end; pointer-events: none;
}
.hero-profile__float .chip {
  pointer-events: auto;
  display: inline-flex; align-items: center; gap: .45rem;
  padding: .35rem .6rem; border-radius: 999px;
  background: #fff; border: 1px solid #e6eaf2; color: #0B1221;
  font-weight: 700; font-size: .85rem;
  box-shadow: 0 8px 24px rgba(15,23,42,.06);
  white-space: nowrap;
}
.hero-profile__float .chip i { color: #6d67e4; }

/* Social stack tucked on image edge */
.hero-profile__social {
  position: absolute; left: -12px; bottom: 12px;
  display: grid; gap: .35rem;
}
.hero-profile__social a {
  width: 38px; height: 38px; display: grid; place-items: center;
  background: #fff; border: 1px solid #e6eaf2; border-radius: 12px;
  color: #334155; box-shadow: 0 8px 24px rgba(15,23,42,.06);
}
.hero-profile__social a:hover { color: #6d67e4; border-color: #6d67e4; }

/* ---- CONTENT (left) ---- */
.hero-profile__kicker {
  display: inline-flex; align-items: center; gap: .45rem;
  padding: .25rem .55rem; border-radius: 999px;
  background: #fff; border: 1px solid #e6eaf2; color: #0B1221;
  font-weight: 800; letter-spacing: .02em; box-shadow: 0 8px 24px rgba(15,23,42,.06);
}
.hero-profile__kicker .dot {
  width: .45rem; height: .45rem; border-radius: 999px;
  background: #6d67e4; box-shadow: 0 0 0 6px rgba(109,103,228,.20);
}

.hero-profile__headline { margin: .5rem 0 .25rem; letter-spacing: -.01em; }
.hero-profile__headline .em { color: #6d67e4; }
.hero-profile__role { color: #334155; margin: 0; }
.hero-profile__bio  { color: #334155; margin: .5rem 0 0; max-width: 60ch; }

/* Compact CTA row */
.hero-profile__cta { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .85rem; }

/* ---- SLIM INFO BAR (spans full width under the two columns) ---- */
.hero-profile__bar {
  grid-column: 1 / -1;
  display: grid; gap: .6rem;
  margin-top: 1rem; padding: .6rem; border-radius: 14px;
  background: #fff; border: 1px solid #e6eaf2; box-shadow: 0 8px 24px rgba(15,23,42,.06);
  align-items: center;
}
@media (min-width: 768px){
  .hero-profile__bar { grid-template-columns: 1fr 1fr; padding: .7rem .9rem; }
}

/* Left half: meta chips (auto-wrap) */
.hero-profile__meta { display: flex; flex-wrap: wrap; gap: .4rem .5rem; }
.meta-chip {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .35rem .6rem; border-radius: 999px; background: #F7F8FA;
  border: 1px solid #e6eaf2; color: #0B1221; font-weight: 700; white-space: nowrap;
}
.meta-chip i { color: #6d67e4; }

/* Right half: compact stack scroller */
.hero-profile__stack {
  display: grid; grid-auto-flow: column; gap: .6rem; overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, #000 85%, transparent);
          mask-image: linear-gradient(90deg, #000 85%, transparent);
}
.stack-item {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .3rem .55rem; border-radius: 999px;
  background: #fff; border: 1px dashed #cbd5e1; color: #334155; white-space: nowrap;
}
.stack-item i { color: #6d67e4; }

/* ---- Trait strip (optional, outside hero) ---- */
.hero-traits {
  max-width: 1240px; margin: .75rem auto 0; padding: 0 1.25rem;
  display: grid; gap: .6rem; grid-template-columns: repeat(2,1fr);
}
@media (min-width: 992px){ .hero-traits { grid-template-columns: repeat(4,1fr); } }
.trait-card {
  background: #fff; border: 1px solid #e6eaf2; border-radius: 14px;
  padding: .85rem; box-shadow: 0 8px 24px rgba(15,23,42,.06);
}
.trait-card .title { margin: 0 0 .15rem; font-size: 1.05rem; color: #0B1221; }
.trait-card .desc  { margin: 0; font-size: .9rem; color: #64748b; }

/* ---- Modal video (hash-target) ---- */
#story-modal {
  position: fixed; inset: 0; display: none; place-items: center; z-index: 60;
  background: rgba(15,23,42,.55); padding: 1rem;
}
#story-modal:target { display: grid; }
.hero-video {
  width: min(960px, 92vw); aspect-ratio: 16/9; background: #000;
  border: 1px solid #e6eaf2; border-radius: 16px; overflow: hidden;
  box-shadow: 0 18px 44px rgba(0,0,0,.35);
}
.hero-video iframe, .hero-video video { width: 100%; height: 100%; border: 0; display: block; }
.hero-video__close {
  position: fixed; top: 1rem; right: 1rem; width: 42px; height: 42px;
  display: grid; place-items: center; color: #0B1221; background: #fff;
  border: 1px solid #e6eaf2; border-radius: 12px; box-shadow: 0 8px 24px rgba(15,23,42,.12);
}

/* ---- Small niceties ---- */
.hr-accent { height: 3px; background: linear-gradient(90deg, #6d67e4, rgba(109,103,228,.2)); border: 0; border-radius: 4px; margin: .9rem 0; }
</style>

<!-- HERO (compact + wide + responsive) -->
<section class="hero is-medium hero-profile">
  <div class="hero-body">
    <div class="hero-profile__inner">
      <!-- MEDIA (mobile-first) -->
      <div class="hero-profile__media">
        <div class="hero-profile__pic">
          <img src="{{ site.author.image | default: '/assets/images/profile.jpg' }}"
               alt="{{ site.author.name | default: site.short_name | default: 'Profile photo' }}">
        </div>
        <!-- Minimal floating chips to avoid tall hero -->
        <div class="hero-profile__float" aria-hidden="true">
          <span class="chip"><i class="ph ph-video-camera"></i> Filmmaker</span>
          <span class="chip"><i class="ph ph-code"></i> Software Engineer</span>
        </div>
        <!-- Social stack -->
        <div class="hero-profile__social" aria-label="Social links">
          {% assign socials = site.social_media | default: empty %}
          {% for s in socials %}
            {% assign icon = s.icon | downcase %}
            {% case icon %}
              {% when 'x-twitter' %}{% assign ph = 'x-logo' %}
              {% when 'linkedin' or 'linkedin-in' %}{% assign ph = 'linkedin-logo' %}
              {% when 'github' %}{% assign ph = 'github-logo' %}
              {% when 'youtube' %}{% assign ph = 'youtube-logo' %}
              {% when 'instagram' %}{% assign ph = 'instagram-logo' %}
              {% else %}{% assign ph = 'globe' %}
            {% endcase %}
            <a href="{{ s.url }}" target="_blank" rel="noopener" title="{{ s.cta | default: s.name }}"><i class="ph ph-{{ ph }}"></i></a>
          {% endfor %}
        </div>
      </div>
      <!-- CONTENT -->
      <div class="hero-profile__content">
        <span class="hero-profile__kicker">
          <span class="dot" aria-hidden="true"></span>
          {{ site.author.tagline | default: "Cinematic chaos meets code." }}
        </span>
        <h1 class="hero-profile__headline title is-2" style="margin-top:.4rem">
          hi! <span class="em">I’m {{ site.author.name | default: site.short_name | default: "Your Name" }}</span>,
        </h1>
        {% assign current_job = site.work_experience.jobs | where: "current", true | first %}
        <p class="hero-profile__role subtitle is-5">
          {% if current_job %}
            a {{ current_job.role | downcase }} at
            <a href="{{ current_job.company_url }}" target="_blank" rel="noopener">{{ current_job.company }}</a>.
          {% else %}
            {{ site.description }}
          {% endif %}
        </p>
        <p class="hero-profile__bio">
          {{ site.author.bio | default: site.description }}
        </p>
        <!-- CTAs -->
        <div class="hero-profile__cta">
          <a class="button is-primary" href="#story-modal">
            <span class="icon"><i class="ph ph-play"></i></span><span>Watch my story</span>
          </a>
          <a class="button is-outlined" href="/about/">
            <span class="icon"><i class="ph ph-file-text"></i></span><span>Résumé</span>
          </a>
        </div>
      </div>
      <!-- SLIM INFO BAR ACROSS (keeps hero short) -->
      <div class="hero-profile__bar">
        <!-- Meta -->
        <div class="hero-profile__meta">
          {% if site.author.city or site.author.state %}
            <span class="meta-chip"><i class="ph ph-map-pin"></i>{{ site.author.city | default: "" }}{% if site.author.city and site.author.state %}, {% endif %}{{ site.author.state | default: "" }}</span>
          {% endif %}
          {% if site.author.country %}
            <span class="meta-chip"><i class="ph ph-flag"></i>{{ site.author.country }}</span>
          {% endif %}
          {% if site.author.pronouns %}
            <span class="meta-chip"><i class="ph ph-user"></i>{{ site.author.pronouns }}</span>
          {% endif %}
          {% if site.author.website %}
            <a class="meta-chip" href="{{ site.author.website }}" target="_blank" rel="noopener"><i class="ph ph-globe"></i> Website</a>
          {% endif %}
          {% if site.author.email %}
            <a class="meta-chip" href="mailto:{{ site.author.email }}"><i class="ph ph-envelope"></i> Email</a>
          {% endif %}
        </div>
        <!-- Compact stack preview -->
        <div class="hero-profile__stack" aria-label="Favorite stack">
          {% assign shown = 0 %}
          {% for cat in site.skills.categories %}
            {% for item in cat.items %}
              {% if shown < 10 %}
                <span class="stack-item"><i class="ph ph-check-circle"></i>{{ item.name }}</span>
                {% assign shown = shown | plus: 1 %}
              {% endif %}
            {% endfor %}
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- (Optional) small trait strip below hero -->
<section class="hero-traits">
  <div class="trait-card"><p class="title">Clean & Intuitive</p><p class="desc">Modern UI feel without sacrificing UX</p></div>
  <div class="trait-card"><p class="title">Detail Oriented</p><p class="desc">Consistency + accessibility</p></div>
  <div class="trait-card"><p class="title">Optimized</p><p class="desc">Fast by default</p></div>
  <div class="trait-card"><p class="title">Story-Driven</p><p class="desc">Every build has an arc</p></div>
</section>

<!-- STORY MODAL (no JS; opens via #story-modal) -->
<div id="story-modal" aria-labelledby="story-title" aria-modal="true" role="dialog">
  <a href="#" class="hero-video__close" aria-label="Close video"><i class="ph ph-x"></i></a>
  <div class="hero-video">
    {% if page.hero_video_url %}
      <iframe
        src="{{ page.hero_video_url | escape }}"
        title="My Story"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    {% else %}
      <video controls poster="/assets/images/video-poster.jpg">
        <source src="/assets/videos/intro.mp4" type="video/mp4">
      </video>
    {% endif %}
  </div>
</div>
