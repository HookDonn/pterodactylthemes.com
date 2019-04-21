Vue.use(VueRouter);
Vue.use(VueMarkdown);

var Home = { template: `
<div>
    <section v-if="Object.keys($parent.themes).length > 0 && $parent.featured.id != null" class="jumbotron text-center">
        <div class="container-fluid">
            <h1 v-if="$parent.featured.theme != undefined" class="jumbotron-heading">{{ $parent.featured.theme.name }}</h1>
            <p class="lead text-muted">{{ $parent.featured.comment }}</p>
            <p>
                <a :href="'#' + $parent.featured.id" class="btn btn-primary my-2">View Theme</a>
                <a v-if="$parent.featured.link != null" :href="$parent.featured.link" class="btn btn-secondary my-2">{{ $parent.featured.linkText }}</a>
            </p>
        </div>
    </section>

    <div class="album py-5 bg-light">
        <div class="container-fluid">
            <div class="row">
                <div v-for="(theme, key) in $parent.themes" class="col-md-4  mb-4">
                    <div class="card h-100 shadow-sm" :id="key">
                        <img :src="theme.image" class="card-img-top">
                        <div class="card-body">
                            <p class="card-text">
                                <h3 class="jumbotron-heading">{{ theme.name }} <small class="text-muted">By {{ theme.author }}</small></h3>
                                <p>
                                    {{ theme.description }}
                                </p>
                            </p>
                        </div>
                        <div class="d-flex ml-3 mb-3 justify-content-between align-items-center">
                            <div class="btn-group">
                                <router-link v-if="theme.page != undefined && theme.page.use" :to="'/theme/' + key" class="btn btn-sm btn-outline-primary rounded-0 mr-3">View Details</router-link>
                                <a :href="theme.link" target="_blank" rel="nofollow" class="btn btn-sm btn-outline-secondary rounded-0">Website</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
` };

var Theme = { template: `
<div>
    <div id="themeCarousel" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            <div v-for="(image, index) in $parent.themes[$route.params.theme].page.carousel" :class="'carousel-item' + (index == 0 ? ' active' : '')">
                <img class="d-block w-100" :src="image.image">

                <div class="container">
                    <div v-if="(image.text != null && image.text.length > 0) || (image.title != null && image.title.length > 0)" :class="'carousel-caption h-50' + (image.alignText != null ? (' text-' + image.alignText) : '')">
                        <h1 v-if="image.title != null && image.title.length > 0">{{ image.title }}</h1>
                        
                        <p v-if="image.text != null && image.text.length > 0">
                            {{ image.text }}
                        </p>
                        <p v-if="image.link.url != null">
                            <a class="btn btn-primary" :href="image.link.url" role="button">{{ image.link.text }}</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <a class="carousel-control-prev" href="#themeCarousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>

        <a class="carousel-control-next" href="#themeCarousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>

    <vue-markdown class="container-fluid bg-light pb-5 px-5 pt-4" v-if="$parent.themes[$route.params.theme].page.content != null">{{ $parent.themes[$route.params.theme].page.content }}</vue-markdown>
</div>
` };

const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/theme/:theme', component: Theme}
    ]
});
  
var app = new Vue({
    el: '#app',
    router: router,

    data: {
        featured: {},
        themes: {},
    },

    mounted() {
        axios.get('data/themes.json').then(r => {
            this.themes = r.data;

            return axios.get('data/featured.json');
        }).then(r => {
            this.featured = r.data;
            this.featured.theme = this.themes[this.featured.id];
        });
    },
})