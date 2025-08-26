---
title: Im Jekyll Theme
description: "An open-source Jekyll theme crafted using the Bulma CSS framework. This theme utilizes Bulma SCSS, making it incredibly easy to customize and adapt to your specific needs. With over 7 layouts and 10+ collections"
image: /assets/logos/logo.svg
layout: base
permalink: /
hero_video_url: "https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
---

<!-- Ensure Phosphor icons are loaded in your base layout head:
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
-->
<section class="hero is-medium twilio-hero home-hero">
  <div class="hero-body">
    <div class="container home-hero__inner">
      <!-- MEDIA (mobile-first) -->
      <div class="home-hero__media">
        <div class="home-hero__photo">
          <img src="{{ site.author.image | default: '/assets/images/profile.jpg' }}"
               alt="{{ site.author.name | default: 'Profile photo' }}">
        </div>
        <!-- Floating chips -->
        <div class="home-hero__float" aria-hidden="true">
          <span class="chip chip--a"><i class="ph ph-video-camera"></i> I make videos</span>
          <span class="chip chip--b"><i class="ph ph-code"></i> Sometimes I write code</span>
          <span class="chip chip--c"><i class="ph ph-microphone"></i> I talk & teach</span>
          <span class="chip chip--d"><i class="ph ph-lightning"></i> Creative experiments</span>
        </div>
        <!-- Social stack -->
        <div class="home-hero__social" aria-label="Social links">
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
      <div class="home-hero__content">
        <span class="home-hero__kicker">
          <span class="dot" aria-hidden="true"></span>
          {{ site.author.tagline | default: "Cinematic chaos meets code." }}
        </span>
        <h1 class="home-hero__headline title is-1">
          Hi, I’m <span class="underline">{{ site.author.name | default: site.short_name | default: "Your Name" }}</span>.
        </h1>
        {% assign current_job = site.work_experience.jobs | where: "current", true | first %}
        <div class="home-hero__role subtitle is-5">
          {% if current_job %}
            {{ current_job.role }} — <a href="{{ current_job.company_url }}" target="_blank" rel="noopener">{{ current_job.company }}</a>
          {% else %}
            {{ site.keywords | join: ", " }}
          {% endif %}
        </div>
        <p class="home-hero__bio">
          {{ site.author.bio | default: site.description }}
        </p>
        <!-- Meta chips -->
        <div class="home-hero__meta">
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
        <div class="home-hero__cta">
          <a class="button is-primary" href="#story-modal">
            <span class="icon"><i class="ph ph-play"></i></span>
            <span>My Story</span>
          </a>
          <a class="button is-outlined" href="/about/">
            <span class="icon"><i class="ph ph-file-text"></i></span>
            <span>About / Résumé</span>
          </a>
        </div>
        <!-- Optional pills -->
        <nav class="home-hero__pills" aria-label="Sections">
          <a class="pill is-active" href="#films">Films</a>
          <a class="pill" href="#work">Work</a>
          <a class="pill" href="#blog">Blog</a>
          <a class="pill" href="#gear">Gear</a>
        </nav>
        <hr class="hr-accent">
      </div>
    </div>
  </div>
</section>

<!-- STORY MODAL (no JS, opens via #story-modal) -->
<div id="story-modal" aria-labelledby="story-title" aria-modal="true" role="dialog">
  <a href="#" class="home-hero__video-close" aria-label="Close video">
    <i class="ph ph-x"></i>
  </a>
  <div class="home-hero__video">
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
