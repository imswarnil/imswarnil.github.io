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
   Enji-style Split Hero (Left: info, Right: image)
   - Compact height, wide container, responsive
   - Plain CSS (no SCSS). Bulma-friendly but stand-alone.
   - Uses your palette: primary #6d67e4, ink #0B1221, border #e6eaf2
   =========================================================== */

/* hero shell */
.hero.hero-profile--split.is-medium { min-height: unset; }
.hero.hero-profile--split .hero-body { padding-block: clamp(1.25rem, 3.2vw, 2.75rem); }

/* wide container grid */
.hero-split__inner{
  max-width: 1248px;
  margin: 0 auto;
  padding-inline: 1.25rem;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr;
  align-items: center;
}

/* desktop two columns: left info, right media */
@media (min-width: 992px){
  .hero-split__inner{
    grid-template-columns: 1.2fr 0.9fr; /* text gets more space, image stays compact */
    gap: 2rem;
  }
}

/* ---------------------
   LEFT: CONTENT
   --------------------- */
.hero-split__kicker{
  display:inline-flex; align-items:center; gap:.45rem;
  padding:.25rem .6rem; border-radius:999px; background:#fff;
  border:1px solid #e6eaf2; color:#0B1221; font-weight:800; letter-spacing:.02em;
  box-shadow:0 8px 24px rgba(15,23,42,.06);
}
.hero-split__kicker .dot{
  width:.45rem; height:.45rem; border-radius:999px; background:#6d67e4;
  box-shadow:0 0 0 6px rgba(109,103,228,.2);
}

.hero-split__headline{ margin:.5rem 0 .25rem; letter-spacing:-.01em; }
.hero-split__headline .em{ color:#6d67e4; }
.hero-split__role{ color:#334155; margin:0; }
.hero-split__bio{ color:#334155; margin:.6rem 0 0; max-width:60ch; }

/* ctas */
.hero-split__cta{ display:flex; flex-wrap:wrap; gap:.55rem; margin-top:.85rem; }
.hero-split__cta .button{ border-radius:12px; }
.hero-split__cta .button.is-primary{ background:#6d67e4; border-color:#6d67e4; color:#fff; box-shadow:0 12px 26px rgba(109,103,228,.28); }
.hero-split__cta .button.is-primary:hover{ filter:brightness(1.06); }
.hero-split__cta .button.is-outlined{ background:#fff; border:1px solid #e6eaf2; color:#0B1221; }
.hero-split__cta .button.is-outlined:hover{ border-color:#6d67e4; color:#6d67e4; }

/* slim info row (chips + stack) lives under text to keep hero short */
.hero-split__bar{
  display:grid; gap:.6rem; margin-top: .9rem;
}
@media (min-width: 720px){
  .hero-split__bar{ grid-template-columns: 1fr 1fr; }
}
.meta-row{ display:flex; flex-wrap:wrap; gap:.4rem .5rem; }
.meta-chip{
  display:inline-flex; align-items:center; gap:.4rem;
  padding:.35rem .6rem; border-radius:999px; background:#F7F8FA;
  border:1px solid #e6eaf2; color:#0B1221; font-weight:700; white-space:nowrap;
}
.meta-chip i{ color:#6d67e4; }

/* compact horizontal stack with edge-fade */
.stack-row{
  display:grid; grid-auto-flow:column; gap:.55rem; overflow:hidden;
  -webkit-mask-image: linear-gradient(90deg,#000 85%,transparent);
          mask-image: linear-gradient(90deg,#000 85%,transparent);
}
.stack-item{
  display:inline-flex; align-items:center; gap:.35rem;
  padding:.3rem .55rem; border-radius:999px; background:#fff;
  border:1px dashed #cbd5e1; color:#334155; white-space:nowrap;
}
.stack-item i{ color:#6d67e4; }

/* ---------------------
   RIGHT: MEDIA
   --------------------- */
.hero-split__media{ position:relative; order:-1; } /* image first on mobile */
@media (min-width:992px){ .hero-split__media{ order:2; } }

.hero-split__pic{
  position:relative; border:1px solid #e6eaf2; border-radius:22px; overflow:hidden; background:#fff;
  box-shadow:0 10px 28px rgba(15,23,42,.10);
  max-width: 520px; margin-left: auto; /* hug right edge like enji.dev */
}
.hero-split__pic img{ display:block; width:100%; height:auto; }

/* subtle ornament ring behind image, not increasing height */
.hero-split__media::after{
  content:""; position:absolute; right:-140px; bottom:-120px; width:520px; height:520px; pointer-events:none;
  border-radius:50%; box-shadow:inset 0 0 0 36px rgba(242,47,70,.10), inset 0 0 0 86px rgba(109,103,228,.08);
  filter:blur(.4px);
}

/* vertical social rail hugging the image edge */
.hero-split__social{
  position:absolute; left:-12px; bottom:12px; display:grid; gap:.35rem;
}
.hero-split__social a{
  width:38px; height:38px; display:grid; place-items:center; background:#fff; color:#334155;
  border:1px solid #e6eaf2; border-radius:12px; box-shadow:0 8px 24px rgba(15,23,42,.06);
}
.hero-split__social a:hover{ color:#6d67e4; border-color:#6d67e4; }

/* tiny floating chips kept to two lines max (so hero stays short) */
.hero-split__float{
  position:absolute; right:10px; top:10px; display:grid; gap:.35rem; justify-items:end;
}
.hero-split__float .chip{
  display:inline-flex; align-items:center; gap:.45rem; padding:.35rem .6rem; border-radius:999px;
  background:#fff; border:1px solid #e6eaf2; color:#0B1221; font-weight:700; font-size:.86rem;
  box-shadow:0 8px 24px rgba(15,23,42,.06); white-space:nowrap;
}
.hero-split__float .chip i{ color:#6d67e4; }

/* modal video (hash target) */
#story-modal{ position:fixed; inset:0; display:none; place-items:center; z-index:60; background:rgba(15,23,42,.55); padding:1rem; }
#story-modal:target{ display:grid; }
.hero-video{ width:min(960px,92vw); aspect-ratio:16/9; background:#000; border:1px solid #e6eaf2; border-radius:16px; overflow:hidden; box-shadow:0 18px 44px rgba(0,0,0,.35); }
.hero-video iframe, .hero-video video{ width:100%; height:100%; border:0; display:block; }
.hero-video__close{ position:fixed; top:1rem; right:1rem; width:42px; height:42px; display:grid; place-items:center; color:#0B1221; background:#fff; border:1px solid #e6eaf2; border-radius:12px; box-shadow:0 8px 24px rgba(15,23,42,.12); }

/* accent rule (optional) */
.hr-accent{ height:3px; background:linear-gradient(90deg,#6d67e4,rgba(109,103,228,.2)); border:0; border-radius:4px; margin:.9rem 0; }
</style>

<!-- Make sure Phosphor icons are loaded in your base layout head:
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
-->

<section class="hero is-medium hero-profile--split">
  <div class="hero-body">
    <div class="hero-split__inner">
      <!-- LEFT: INFO -->
      <div class="hero-split__content">
        <span class="hero-split__kicker">
          <span class="dot" aria-hidden="true"></span>
          {{ site.author.tagline | default: "Cinematic chaos meets code." }}
        </span>
        <h1 class="hero-split__headline title is-2" style="color:#0B1221;">
          hi! <span class="em">I’m {{ site.author.name | default: site.short_name | default: "Your Name" }}</span>
        </h1>
        {% assign current_job = site.work_experience.jobs | where: "current", true | first %}
        <p class="hero-split__role subtitle is-5">
          {% if current_job %}
            a {{ current_job.role | downcase }} at
            <a href="{{ current_job.company_url }}" target="_blank" rel="noopener">{{ current_job.company }}</a>.
          {% else %}
            {{ site.description }}
          {% endif %}
        </p>
        <p class="hero-split__bio">
          {{ site.author.bio | default: site.description }}
        </p>
        <div class="hero-split__cta">
          <a class="button is-primary" href="#story-modal">
            <span class="icon"><i class="ph ph-play"></i></span><span>Watch my story</span>
          </a>
          <a class="button is-outlined" href="/about/">
            <span class="icon"><i class="ph ph-file-text"></i></span><span>Résumé</span>
          </a>
        </div>
        <!-- Slim info bar to distribute details without increasing hero height -->
        <div class="hero-split__bar">
          <div class="meta-row">
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
          <div class="stack-row" aria-label="Favorite stack">
            {% assign shown = 0 %}
            {% for cat in site.skills.categories %}
              {% for item in cat.items %}
                {% if shown < 9 %}
                  <span class="stack-item"><i class="ph ph-check-circle"></i>{{ item.name }}</span>
                  {% assign shown = shown | plus: 1 %}
                {% endif %}
              {% endfor %}
            {% endfor %}
          </div>
        </div>
      </div>
      <!-- RIGHT: IMAGE (like enji.dev) -->
      <div class="hero-split__media">
        <div class="hero-split__pic">
          <img src="{{ site.author.image | default: '/assets/images/profile.jpg' }}"
               alt="{{ site.author.name | default: site.short_name | default: 'Profile photo' }}">
        </div>
        <!-- Minimal float chips (2 only to avoid tall hero) -->
        <div class="hero-split__float" aria-hidden="true">
          <span class="chip"><i class="ph ph-video-camera"></i> Filmmaker</span>
          <span class="chip"><i class="ph ph-code"></i> Software Engineer</span>
        </div>
        <!-- Social rail hugging image edge -->
        <div class="hero-split__social" aria-label="Social links">
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
            <a href="{{ s.url }}" target="_blank" rel="noopener" title="{{ s.cta | default: s.name }}">
              <i class="ph ph-{{ ph }}"></i>
            </a>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Hash-target modal video -->
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
