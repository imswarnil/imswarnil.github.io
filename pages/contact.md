---
layout: base
title: Contact Me
permalink: /contact/
sidebar : false
---
<section class="section">
    <div class="container">
        <h1 class="title">Contact Us</h1>
        <p class="subtitle">We'd love to hear from you! Please fill out the form below or reach out to us directly.</p>
          <div class="columns">
            <div class="column is-half">
                <form action="https://formspree.io/f/your_form_id" method="POST">
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input class="input" type="text" name="name" placeholder="Your Name" required>
                        </div>
                    </div>  
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input class="input" type="email" name="_replyto" placeholder="Your Email" required>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Reason for Contact</label>
                        <div class="control">
                            <div class="select">
                                <select name="reason" required>
                                    <option value="">Select reason</option>
                                    <option value="support">Support</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="inquiry">General Inquiry</option>
                                    <option value="schedule">Schedule a Call</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Message</label>
                        <div class="control">
                            <textarea class="textarea" name="message" placeholder="Your Message" required></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button class="button is-primary" type="submit">Send Message</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="column is-half">
                <div class="content">
                    <h2 class="title is-4">Our Contact Details</h2>
                    <p><strong>Address:</strong> 123 Main Street, City, Country</p>
                    <p><strong>Phone:</strong> (123) 456-7890</p>
                    <p><strong>Schedule a Call:</strong> <a href="#schedule-call">Schedule here</a></p>
                </div>
                <div id="map"></div>
                <div class="content">
                    <h2 class="title is-4">Join Our Discord Server</h2>
                    <p>Come chat with us on Discord! We regularly interact with our audience there.</p>
                    <a class="button is-link" href="https://discord.gg/yourdiscordinvite" target="_blank">Join Discord Server</a>
                </div>
            </div>
        </div>
    </div>
</section>
<div id="map" style="height: 300px; width: 100%;"></div>
<script>
    function initMap() {
        var location = {lat: -34.397, lng: 150.644};
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: location
        });
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
</script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap"></script>
<style>
.section {
    padding: 2rem 1.5rem;
}
#map {
    height: 300px;
    width: 100%;
    margin-top: 1rem;
    border-radius: 8px;
    border: 1px solid #dbdbdb;
}
</style>