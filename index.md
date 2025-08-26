---
title: Im Jekyll Theme
description: "An open-source Jekyll theme crafted using the Bulma CSS framework. This theme utilizes Bulma SCSS, making it incredibly easy to customize and adapt to your specific needs. With over 7 layouts and 10+ collections"
image: /assets/logos/logo.svg
layout: base
permalink: /
hero_video_url: "https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
---

<!-- Make sure Phosphor icons are loaded in your base layout head:
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
-->

<section class="hero is-medium hero-profile">
  <div class="hero-body">
    <div class="hero-profile__inner">
      <!-- MEDIA (mobile-first) -->
      <div class="hero-profile__media">
        <div class="hero-profile__pic">
          <img src="{{ site.author.image | default: '/assets/images/profile.jpg' }}"
               alt="{{ site.author.name | default: site.short_name | default: 'Profile photo' }}">
        </div>
        <!-- Floating chips -->
        <div class="hero-profile__float" aria-hidden="true">
          <span class="chip chip--a"><i class="ph ph-video-camera"></i> Filmmaker</span>
          <span class="chip chip--b"><i class="ph ph-code"></i> Software Engineer</span>
          <span class="chip chip--c"><i class="ph ph-microphone"></i> Storyteller</span>
          <span class="chip chip--d"><i class="ph ph-lightning"></i> Experiments</span>
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
            <a href="{{ s.url }}" target="_blank" rel="noopener" title="{{ s.cta | default: s.name }}">
              <i class="ph ph-{{ ph }}"></i>
            </a>
          {% endfor %}
        </div>
      </div>
      <!-- CONTENT -->
      <div class="hero-profile__content">
        <span class="hero-profile__kicker">
          <span class="dot" aria-hidden="true"></span>
          {{ site.author.tagline | default: "Cinematic chaos meets code." }}
        </span>
        <h1 class="hero-profile__headline title is-1">
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
        <!-- Meta chips -->
        <div class="hero-profile__meta">
          {% if site.author.city or site.author.state %}
            <span class="meta-chip"><i class="ph ph-map-pin"></i>
              {{ site.author.city | default: "" }}{% if site.author.city and site.author.state %}, {% endif %}{{ site.author.state | default: "" }}
            </span>
          {% endif %}
          {% if site.author.country %}
            <span class="meta-chip"><i class="ph ph-flag"></i>{{ site.author.country }}</span>
          {% endif %}
          {% if site.author.pronouns %}
            <span class="meta-chip"><i class="ph ph-user"></i>{{ site.author.pronouns }}</span>
          {% endif %}
          {% if site.author.website %}
            <a class="meta-chip" href="{{ site.author.website }}" target="_blank" rel="noopener">
              <i class="ph ph-globe"></i> Website
            </a>
          {% endif %}
          {% if site.author.email %}
            <a class="meta-chip" href="mailto:{{ site.author.email }}"><i class="ph ph-envelope"></i> Email</a>
          {% endif %}
        </div>
        <!-- CTAs -->
        <div class="hero-profile__cta">
          <a class="button is-primary" href="#story-modal">
            <span class="icon"><i class="ph ph-play"></i></span><span>Watch my story</span>
          </a>
          <a class="button is-outlined" href="/about/">
            <span class="icon"><i class="ph ph-file-text"></i></span><span>Résumé</span>
          </a>
        </div>
        <!-- Favorite stack -->
        <div class="hero-profile__stack" aria-label="Favorite tech stack">
          {% assign shown = 0 %}
          {% for cat in site.skills.categories %}
            {% for item in cat.items %}
              {% if shown < 8 %}
                <span class="stack-item">
                  <i class="ph ph-check-circle"></i> {{ item.name }}
                </span>
                {% assign shown = shown | plus: 1 %}
              {% endif %}
            {% endfor %}
          {% endfor %}
        </div>
        <hr class="hr-accent">
        <!-- Traits (soft cards under hero) -->
        <div class="hero-traits">
          <div class="trait-card">
            <p class="title">Clean & Intuitive</p>
            <p class="desc">Modern UI feel without sacrificing UX</p>
          </div>
          <div class="trait-card">
            <p class="title">Detail Oriented</p>
            <p class="desc">Accessibility, consistency, and polish</p>
          </div>
          <div class="trait-card">
            <p class="title">Pretty & Optimized</p>
            <p class="desc">Performance and simplicity by default</p>
          </div>
          <div class="trait-card">
            <p class="title">Story-Driven</p>
            <p class="desc">Every build has a narrative arc</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STORY MODAL (no JS, opens via #story-modal) -->
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
