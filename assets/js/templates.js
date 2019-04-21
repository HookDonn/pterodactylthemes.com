`<section v-if="Object.keys($parent.themes).length > 0 && $parent.featured.id != null" class="jumbotron text-center">
<div class="container-fluid">
    <h1 v-if="$parent.featured.theme != undefined" class="jumbotron-heading">{{ $parent.featured.theme.name }}</h1>
    <p class="lead text-muted">{{ $parent.featured.comment }}</p>
    <p>
        <a :href="'#' + $parent.featured.id" class="btn btn-primary my-2">View Theme</a>
        <a v-if="$parent.featured.link != null" :href="$parent.featured.link" class="btn btn-secondary my-2">{{ $parent.featured.linkText }}</a>
    </p>
</div>
</section>`