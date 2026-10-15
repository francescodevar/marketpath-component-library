export default {
  id: 'blog-01',
  name: 'Blog Listing & Post Layout',
  category: 'blog',
  prefix: 'blog_01_',
  bootstrap: true,
  customCss: true,
  customJs: false,
  bootstrapJs: false,
  description: 'A complete Marketpath blog layout with searchable listings, topic navigation, pagination, related posts, and post detail view.',
  tags: ['blog', 'articles', 'search', 'pagination', 'sidebar'],
  template: `{%- var blogSlug = blog | default:'Blog' -%}
{%- blog blogName = blogSlug -%}
{%- var currentTitle = entity.title -%}
{%- var isPostView = false -%}
{%- var post = entity -%}
{%- var pageNum = request.query_params['page'] | default:1 | to_int -%}
{%- var activeTag = null -%}
{%- var showFeatureImage = settings.show_feature_image_in_landing_page.on | default:false -%}
{%- var browseTopicListTags = settings.browse_topic_list_tags -%}

{%- if entity.object_type == 'blog_post' -%}
  {%- set isPostView = true -%}
{%- endif -%}

{%- if request.query_params['tag'].is_valid -%}
  {%- tag set activeTag = request.query_params['tag'] | url_decode:true -%}
{%- elsif entity.object_type == 'tag' -%}
  {%- tag set activeTag = entity -%}
{%- endif -%}

{% capture var filterString %}
blog:blogName
page:pageNum
sort_by:"post_date"
sort_direction:"desc"
limit:6
{% if request.query_params['author'].is_valid %}
{% author set author = request.query_params['author'] | url_decode:true %}
{% if author.is_valid %}
author:author
{% set_title author.first_name.value | append:' ' | append:author.last_name.value | append:' | ' | append:entity.browser_title.value %}
{% endif %}
{% endif %}
{% if activeTag.is_valid %}
tag:activeTag
{% set currentTitle = activeTag.title %}
{% endif %}
{% if request.query_params['search'].is_valid %}
filter:request.query_params['search']
{% endif %}
{% endcapture %}

{%- blog_posts var posts = *filterString -%}
{%- blog_posts var recentPosts = blog:blogName limit:5 sort_by:"date_created" sort_direction:"desc" -%}

{%- if request.query_params['post'] -%}
  {%- blog_post set post = request.query_params['post'] -%}
  {%- set isPostView = true -%}
  {%- set currentTitle = post.title -%}
  {%- set_title post.title -%}
{%- endif -%}

<section class="blog-component py-5">
  <div class="container py-2">
    <div class="row g-4 g-lg-5">
      <main class="col-12 col-lg-8">
        <div class="blog-heading mb-4">
          <h1 class="display-6 fw-bold text-primary">{{ currentTitle }}</h1>
        </div>

        {%- unless isPostView -%}
          <div class="mb-4 d-lg-none">
            <form action="{{ blogName.url.value | escape }}" method="get" role="search">
              <div class="input-group">
                <label class="visually-hidden" for="blogSearchMobile">Search posts</label>
                <input id="blogSearchMobile" name="search" type="search" class="form-control" placeholder="Search posts" value="{{ request.query_params['search'] | escape }}">
                <button class="btn btn-primary" type="submit" aria-label="Search posts"><i class="bi bi-search" aria-hidden="true"></i></button>
              </div>
            </form>
          </div>

          <div class="row g-4">
            {%- if posts.size > 0 -%}
              {%- for post in posts -%}
              <div class="col-12 col-md-6">
                <article class="card h-100 border-0 shadow-sm rounded-2 blog-card">
                  {%- if post.image.is_valid -%}
                  <div class="ratio ratio-16x9 overflow-hidden rounded-top-2">
                    <img src="{% image_url = post.image | preset:'960x540-crop webp' %}" alt="{{ post.title | escape }}" class="object-fit-cover w-100 h-100" loading="lazy">
                  </div>
                  {%- endif -%}
                  <div class="card-body d-flex flex-column px-4 pt-3 pb-4">
                    {%- if post.post_date.is_valid -%}
                    <p class="small text-muted mb-2"><i class="bi bi-calendar me-1" aria-hidden="true"></i>{{ post.post_date | date:'MMMM dd, yyyy' }}</p>
                    {%- endif -%}
                    <h2 class="h5 fw-bold text-primary mb-3">{{ post.title }}</h2>
                    {%- if post.summary_html.is_valid -%}
                    <p class="small text-muted mb-3">{{ post.summary_html.value | strip_html | truncate:150 }}</p>
                    {%- endif -%}
                    <span class="mt-auto text-primary small fw-semibold d-inline-flex align-items-center gap-1">Read More <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
                  </div>
                  <a href="{{ post.url.value | escape }}" class="stretched-link" aria-label="Read {{ post.title | escape }}"></a>
                </article>
              </div>
              {%- endfor -%}

              {%- if posts.total_pages > 1 -%}
              <div class="col-12 pt-3">
                <nav aria-label="Blog pagination">
                  <ul class="pagination justify-content-center">
                    {%- if posts.page > 1 -%}
                    <li class="page-item"><a class="page-link" href="{% query_param_link = page:posts.page|minus:1 %}" aria-label="Previous page"><span aria-hidden="true">&laquo;</span></a></li>
                    {%- else -%}
                    <li class="page-item disabled"><span class="page-link"><span aria-hidden="true">&laquo;</span></span></li>
                    {%- endif -%}

                    {%- for pageNumber in (1..posts.total_pages) -%}
                      {%- if pageNumber == posts.page -%}
                      <li class="page-item active" aria-current="page"><span class="page-link">{{ pageNumber }}</span></li>
                      {%- else -%}
                      <li class="page-item"><a class="page-link" href="{% if pageNumber == 1 %}{% query_param_link = page:false %}{% else %}{% query_param_link = page:pageNumber %}{% endif %}">{{ pageNumber }}</a></li>
                      {%- endif -%}
                    {%- endfor -%}

                    {%- if posts.page < posts.total_pages -%}
                    <li class="page-item"><a class="page-link" href="{% query_param_link = page:posts.page|plus:1 %}" aria-label="Next page"><span aria-hidden="true">&raquo;</span></a></li>
                    {%- else -%}
                    <li class="page-item disabled"><span class="page-link"><span aria-hidden="true">&raquo;</span></span></li>
                    {%- endif -%}
                  </ul>
                </nav>
              </div>
              {%- endif -%}
            {%- else -%}
            <div class="col-12">
              <h2 class="h5">No results were found for your search.</h2>
              <p class="text-muted">Please try different keywords.</p>
            </div>
            {%- endif -%}
          </div>
        {%- else -%}
          {%- if post.image.is_valid and showFeatureImage -%}
          <div class="ratio ratio-16x9 mb-4 overflow-hidden rounded-2">
            <img src="{% image_url = post.image | preset:'960x540-crop webp' %}" alt="{{ post.title | escape }}" class="object-fit-cover w-100 h-100">
          </div>
          {%- endif -%}

          {%- if post.content_html.is_valid -%}
          <div class="blog-content mb-5">{{ post.content_html }}</div>
          {%- endif -%}

          {%- if post.tags.is_valid -%}
          <div class="d-flex flex-wrap align-items-center gap-2 mb-4">
            <span class="fw-bold text-primary me-1">Tags:</span>
            {%- for tag in post.tags -%}
            <a href="{% if tag.has_url %}{{ tag.url.value | escape }}{% else %}{{ blogName.url.value | escape }}?tag={{ tag.title | url_encode }}{% endif %}" class="badge rounded-pill text-bg-primary text-decoration-none px-3 py-2">{{ tag.title }}</a>
            {%- endfor -%}
          </div>

          {%- assign relatedCount = 0 -%}
          {%- assign shownGuids = '' -%}
          <hr class="my-5">
          <section class="related-posts" aria-labelledby="relatedPostsTitle">
            <h2 id="relatedPostsTitle" class="h3 text-primary fw-bold mb-4">Related Posts</h2>
            <div class="row g-4">
              {%- for relatedTag in post.tags -%}
                {%- if relatedCount < 3 -%}
                {%- blog_posts relatedPosts = blog:blogName tag:relatedTag limit:6 sort_by:'post_date' sort_direction:'desc' -%}
                  {%- for relatedPost in relatedPosts -%}
                    {%- capture postGuidCheck -%}|{{ relatedPost.guid }}|{%- endcapture -%}
                    {%- unless relatedPost.guid == post.guid or shownGuids contains postGuidCheck or relatedCount >= 3 -%}
                    <div class="col-12 col-md-4">
                      <article class="card h-100 border border-primary border-opacity-25 rounded-2 position-relative">
                        {%- if relatedPost.image.is_valid -%}
                        <div class="ratio ratio-16x9 overflow-hidden">
                          <img src="{% image_url = relatedPost.image | preset:'600x338-crop webp' %}" alt="{{ relatedPost.title | escape }}" class="object-fit-cover w-100 h-100" loading="lazy">
                        </div>
                        {%- endif -%}
                        <div class="card-body px-3 py-3"><h3 class="h6 fw-bold text-primary mb-0">{{ relatedPost.title }}</h3></div>
                        <a href="{% if relatedPost.has_url %}{{ relatedPost.url.value | escape }}{% else %}{{ blogName.url.value | escape }}?post={{ relatedPost.guid | escape }}{% endif %}" class="stretched-link" aria-label="Read {{ relatedPost.title | escape }}"></a>
                      </article>
                    </div>
                    {%- capture shownGuids -%}{{ shownGuids }}|{{ relatedPost.guid }}|{%- endcapture -%}
                    {%- assign relatedCount = relatedCount | plus:1 -%}
                    {%- endunless -%}
                  {%- endfor -%}
                {%- endif -%}
              {%- endfor -%}
            </div>
          </section>
          {%- endif -%}
        {%- endunless -%}
      </main>

      <aside class="col-12 col-lg-4" aria-label="Blog navigation">
        <div class="mb-4 d-none d-lg-block">
          <form action="{{ blogName.url.value | escape }}" method="get" role="search">
            <div class="input-group">
              <label class="visually-hidden" for="blogSearch">Search posts</label>
              <input id="blogSearch" name="search" type="search" class="form-control" placeholder="Search posts" value="{{ request.query_params['search'] | escape }}">
              <button class="btn btn-primary" type="submit" aria-label="Search posts"><i class="bi bi-search" aria-hidden="true"></i></button>
            </div>
          </form>
        </div>

        <div class="mb-4">
          <ul class="list-group rounded-2">
            <li class="list-group-item bg-primary text-white fw-bold">Browse Topics</li>
            <li class="list-group-item position-relative"><a href="{{ blogName.url.value | escape }}" class="text-decoration-none text-dark stretched-link">All</a></li>
            {%- if browseTopicListTags.is_valid and browseTopicListTags.size > 0 -%}
              {%- assign blogTopics = browseTopicListTags -%}
            {%- else -%}
              {%- tags var blogTopics = limit:100 sort_by:'title' sort_direction:'asc' -%}
            {%- endif -%}
            {%- for topic in blogTopics -%}
            <li class="list-group-item position-relative">
              <a href="{% if topic.has_url %}{{ topic.url.value | escape }}{% else %}{{ blogName.url.value | escape }}?tag={{ topic.title | url_encode }}{% endif %}" class="text-decoration-none text-dark stretched-link">{{ topic.title }}</a>
            </li>
            {%- endfor -%}
          </ul>
        </div>

        <div class="mb-4">
          <ul class="list-group rounded-2">
            <li class="list-group-item bg-primary text-white fw-bold">Recent Posts</li>
            {%- for recentPost in recentPosts -%}
            <li class="list-group-item">
              <a href="{% if recentPost.has_url %}{{ recentPost.url.value | escape }}{% else %}{{ blogName.url.value | escape }}?post={{ recentPost.guid | escape }}{% endif %}" class="text-decoration-none d-flex gap-3 align-items-center">
                {%- if recentPost.image.is_valid -%}
                <span class="recent-post-thumb overflow-hidden flex-shrink-0"><img src="{% image_url = recentPost.image | preset:'200x200-crop webp' %}" alt="{{ recentPost.title | escape }}" class="w-100 h-100 object-fit-cover" loading="lazy"></span>
                {%- endif -%}
                <span><span class="d-block small fw-bold text-primary mb-1">{{ recentPost.title }}</span><span class="d-block small text-muted">{{ recentPost.post_date | date:'MMM dd, yyyy' }}</span></span>
              </a>
            </li>
            {%- endfor -%}
          </ul>
        </div>
      </aside>
    </div>
  </div>
</section>

{%- add_stylesheet inline %}
.blog-component .blog-card {
  transition: box-shadow .3s ease, transform .3s ease;
}

.blog-component .blog-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, .12) !important;
  transform: translateY(-2px);
}

.blog-component .list-group-item {
  transition: background-color .2s ease, color .2s ease;
}

.blog-component .list-group-item a {
  transition: color .2s ease;
}

.blog-component .list-group-item:hover:not(:first-child) {
  background-color: var(--bs-primary);
}

.blog-component .list-group-item:hover:not(:first-child) a,
.blog-component .list-group-item:hover:not(:first-child) .text-primary,
.blog-component .list-group-item:hover:not(:first-child) .text-muted {
  color: #fff !important;
}

.blog-component .recent-post-thumb {
  display: block;
  width: 70px;
  min-width: 70px;
  height: 70px;
}

.blog-component blockquote {
  margin: 2rem 0;
  padding: 1.5rem 2rem;
  color: var(--bs-primary);
  background-color: #eef5fa;
  border-left: 5px solid var(--bs-secondary);
  border-radius: 0 .75rem .75rem 0;
  font-size: 1.25rem;
  line-height: 1.35;
}

.blog-component blockquote p { margin-bottom: 0; }
{% end_stylesheet %}`,
  fields: [],
  notes: [
    'This component renders both the blog listing and an individual post, based on the current Marketpath entity and the post query parameter.',
    'Set the Marketpath blog name with the Liquid variable blog; it defaults to Blog. The page template must provide the shared header context and Page Settings.',
    'Search, author, topic tags, pagination, recent posts, and related posts are driven by Marketpath blog data and query parameters.',
    'Page Settings fields show_feature_image_in_landing_page and browse_topic_list_tags are optional. Without a custom topic list, the sidebar loads available tags.',
    'Create the 960x540-crop, 600x338-crop, and 200x200-crop image presets in your site if posts use images.',
    'The template includes scoped inline styles; it does not require custom JavaScript or the Bootstrap JavaScript bundle.',
  ],
  preview: {
    html: `<section class="blog-component py-5">
  <div class="container py-2">
    <div class="row g-4 g-lg-5">
      <main class="col-12 col-lg-8">
        <div class="blog-heading mb-4"><h1 class="display-6 fw-bold text-primary">Latest Posts</h1></div>
        <div class="row g-4">
          <div class="col-12 col-md-6"><article class="card h-100 border-0 shadow-sm rounded-2 blog-card"><div class="ratio ratio-16x9 overflow-hidden rounded-top-2 bg-secondary-subtle"><span class="d-flex align-items-center justify-content-center text-secondary">Post image</span></div><div class="card-body d-flex flex-column px-4 pt-3 pb-4"><p class="small text-muted mb-2"><i class="bi bi-calendar me-1" aria-hidden="true"></i>May 14, 2026</p><h2 class="h5 fw-bold text-primary mb-3">A practical guide to planning your next project</h2><p class="small text-muted mb-3">A few thoughtful steps can help make a project easier to plan and enjoy.</p><span class="mt-auto text-primary small fw-semibold">Read More →</span></div></article></div>
          <div class="col-12 col-md-6"><article class="card h-100 border-0 shadow-sm rounded-2 blog-card"><div class="ratio ratio-16x9 overflow-hidden rounded-top-2 bg-light"><span class="d-flex align-items-center justify-content-center text-secondary">Post image</span></div><div class="card-body d-flex flex-column px-4 pt-3 pb-4"><p class="small text-muted mb-2"><i class="bi bi-calendar me-1" aria-hidden="true"></i>May 02, 2026</p><h2 class="h5 fw-bold text-primary mb-3">Ideas for a more comfortable home</h2><p class="small text-muted mb-3">Explore simple ways to make everyday spaces feel more welcoming.</p><span class="mt-auto text-primary small fw-semibold">Read More →</span></div></article></div>
          <div class="col-12 col-md-6"><article class="card h-100 border-0 shadow-sm rounded-2 blog-card"><div class="ratio ratio-16x9 overflow-hidden rounded-top-2 bg-body-secondary"><span class="d-flex align-items-center justify-content-center text-secondary">Post image</span></div><div class="card-body d-flex flex-column px-4 pt-3 pb-4"><p class="small text-muted mb-2"><i class="bi bi-calendar me-1" aria-hidden="true"></i>April 21, 2026</p><h2 class="h5 fw-bold text-primary mb-3">Choosing materials that last</h2><p class="small text-muted mb-3">Learn what to consider when comparing materials and finishes.</p><span class="mt-auto text-primary small fw-semibold">Read More →</span></div></article></div>
        </div>
      </main>
      <aside class="col-12 col-lg-4" aria-label="Blog navigation">
        <div class="mb-4 d-none d-lg-block"><div class="input-group"><input class="form-control" type="search" placeholder="Search posts" aria-label="Search posts"><button class="btn btn-primary" type="button" aria-label="Search posts"><i class="bi bi-search" aria-hidden="true"></i></button></div></div>
        <div class="mb-4"><ul class="list-group rounded-2"><li class="list-group-item bg-primary text-white fw-bold">Browse Topics</li><li class="list-group-item"><a href="#" class="text-decoration-none text-dark">All</a></li><li class="list-group-item"><a href="#" class="text-decoration-none text-dark">Planning</a></li><li class="list-group-item"><a href="#" class="text-decoration-none text-dark">Home Ideas</a></li><li class="list-group-item"><a href="#" class="text-decoration-none text-dark">Materials</a></li></ul></div>
        <div class="mb-4"><ul class="list-group rounded-2"><li class="list-group-item bg-primary text-white fw-bold">Recent Posts</li><li class="list-group-item"><a href="#" class="text-decoration-none small fw-bold text-primary">A practical guide to planning your next project</a></li><li class="list-group-item"><a href="#" class="text-decoration-none small fw-bold text-primary">Ideas for a more comfortable home</a></li></ul></div>
      </aside>
    </div>
  </div>
</section>`,
  },
  mockData: {},
};
