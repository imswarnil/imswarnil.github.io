---
title: Im Jekyll Theme
description: "An open-source Jekyll theme crafted using the Bulma CSS framework. This theme utilizes Bulma SCSS, making it incredibly easy to customize and adapt to your specific needs. With over 7 layouts and 10+ collections"
image: /assets/logos/logo.svg
layout: default
permalink: /
hero_video_url: "https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
---
<style>
</style>

<!-- Make sure Phosphor icons are loaded in your base layout head:
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
-->
<section class="hero is-medium is-relative hero-personal">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-vcentered is-variable is-7">
        <!-- LEFT: text -->
        <div class="column is-7">
          <h1 class="title is-1">
            {{ site.author.name }}
            <span class="title-accent">{{ site.author.tagline }}</span>
          </h1>
          <p class="subtitle is-5">{{ site.description }}</p>
          {% assign current_job = site.work_experience.jobs | where: "current", true | first %}
          {% if current_job %}
          <p class="job-line">
            <strong>{{ current_job.role }}</strong> at
            {% if current_job.company_url %}
              <a href="{{ current_job.company_url }}" target="_blank" rel="noopener">{{ current_job.company }}</a>
            {% else %}
              {{ current_job.company }}
            {% endif %}
            <span class="dot">•</span>
            <span class="location">{{ site.author.city }}, {{ site.author.state }}, {{ site.author.country }}</span>
          </p>
          {% endif %}
          {% assign other_jobs = site.work_experience.jobs | reject: "current", true | slice: 0, 2 %}
          {% if other_jobs and other_jobs.size > 0 %}
          <p class="job-history">
            Previously:
            {% for j in other_jobs %}
              <span>{{ j.role }} @ {{ j.company }}</span>{% unless forloop.last %}<span class="sep">,</span>{% endunless %}
            {% endfor %}
          </p>
          {% endif %}
          <div class="buttons">
            <a class="button is-primary is-medium" href="{{ '/about/' | relative_url }}">View Resume</a>
            <a class="button is-light is-medium" href="mailto:{{ site.email }}">Contact</a>
          </div>
          <div class="social-links">
            {% for sm in site.social_media %}
              <a class="social-pill" href="{{ sm.url }}" target="_blank" rel="me noopener">
                <span class="icon">{% if sm.icon %}<i class="{{ sm.icon }}"></i>{% endif %}</span>
                <span>{{ sm.name }}</span>
              </a>
            {% endfor %}
          </div>
        </div>
        <!-- RIGHT: image -->
        <div class="column is-5">
          <figure class="image hero-avatar">
            <img src="{{ site.author.image | default: '/assets/images/avatar.png' | relative_url }}" alt="{{ site.author.name }}">
          </figure>
        </div>

      </div>
    </div>
  </div>
</section>
