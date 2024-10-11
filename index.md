---
title: Im Swarnil Theme
subtitle: This is the demo site for Bulma Clean Theme
layout: home    
sidebar : false
---
 
<section class="hero">
  <div class="hero-body">
    <div class="container">
     <!-- Right Side with Image Placeholder -->
      <div class="columns is-vcentered is-centered">
      <div class="column is-3">
          <figure class="image is-512x512 is-skeleton">
          <img alt="Placeholder" src="https://placehold.co/128x128">
           </figure>
        </div>
        <!-- Left Side with Text -->
        <div class="column is-6 ml-4">
          <p class="is-size-4">Hey, welcome to my blog</p>
          <h1 class="title is-1 ">Hi, I'm Swarnil Singhai</h1>
          <p class="is-size-4">I am an engineer and YouTuber.</p>
          <p class="is-size-6 my-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh.</p>
          <div class="buttons">
            <a class="button is-light">Learn More</a>
            <a class="button is-primary is-outlined">Contact</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


 



<section class="section mt-5">
    <div class="container">
        <div class="columns">
            <div class="column is-9">
                <h2 class="title">Recent Videos</h2>
                <p>Discover more of our video content and tutorials.</p>
            </div>
            <div class="column is-3">
                <a href="/videos" class="button is-primary is-fullwidth">
                    <span class="mr-2 icon">
                        <i class="fas fa-video"></i>
                    </span>
                    Explore All Videos
                </a>
            </div>
        </div>
        <div class="columns is-multiline">
            {% assign sorted_videos = site.videos | sort: 'date' | reversed %}
            {% for video in sorted_videos limit:4 %}
                <div class="column is-3">
                    <div class="card">
                        <div class="card-image">
                            <a href="{{ video.url }}"><img style="" src="https://img.youtube.com/vi/{{ video.video_id | split:'=' | last }}/maxresdefault.jpg" alt="{{ video.title }}"></a>
                        </div>
                        <div class="card-content">
                            <a href="{{ video.url }}" class="title is-4">{{ video.title }}</a>
                            <p class="subtitle is-6">{{ video.description }}</p>
                            <div class="is-flex is-vcentered mt-3">
                                <span class="icon is-small">
                                    <i class="far fa-clock"></i>
                                </span>
                                <p class="is-size-7 ml-1">{{ video.video_duration }}</p>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <p class="card-footer-item">
                                <a href="{{ video.url }}" class="has-text-primary">
                                    <span class="icon">
                                        <i class="fas fa-play"></i>
                                    </span>
                                    <span>Watch Video</span>
                                </a>
                            </p>
                        </footer>
                    </div>
                </div>
            {% endfor %}
        </div>
    </div>
</section>
<section class="section">
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-half">
                <h2 class="title is-2 has-text-centered">Subscribe to Our Newsletter</h2>
                <p class="subtitle has-text-centered">Stay updated with our latest news and updates!</p>
                <div class="field is-grouped mt-4">
                    <p class="control is-expanded">
                        <input class="input " type="text" placeholder="Your Name">
                    </p>
                    <p class="control is-expanded">
                        <input class="input " type="email" placeholder="Your Email">
                    </p>
                    <p class="control">
                        <a class="button is-primary">
                            <span class="icon">
                                <i class="fas fa-paper-plane"></i>
                            </span>
                            <span>Subscribe</span>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>
