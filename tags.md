---
layout: page
title: Tags
permalink: /tags/
---

<div class="tags-page">
  {%- assign tags = site.tags | sort -%}

  <p class="muted">Browse by tag.</p>

  <ul class="tag-list">
    {%- for tag in tags -%}
      {%- assign tag_name = tag[0] -%}
      {%- assign tag_posts = tag[1] -%}
      <li>
        <a class="tag" href="#{{ tag_name }}">#{{ tag_name }}</a>
        <span class="muted">({{ tag_posts | size }})</span>
      </li>
    {%- endfor -%}
  </ul>

  <hr />

  {%- for tag in tags -%}
    {%- assign tag_name = tag[0] -%}
    {%- assign tag_posts = tag[1] -%}

    <h2 id="{{ tag_name }}">#{{ tag_name }}</h2>
    <ul class="post-list">
      {%- for post in tag_posts -%}
        <li>
          {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
          <span class="post-meta">{{ post.date | date: date_format }}</span>
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </li>
      {%- endfor -%}
    </ul>
  {%- endfor -%}
</div>
