Vue.use(VueRouter);
Vue.use(VueMarkdown);
Vue.component('vue-multiselect', window.VueMultiselect.default)

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

    <div class="container-fluid my-3">
        <div class="row">
            <div class="col-4 col-offset-1">
                <div class="mb-2">Select Pterodactyl Version(s)</div>
                <vue-multiselect v-model="$parent.filterVersionsValue" :options="$parent.filterVersionsOptions" :multiple="true" :close-on-select="false" :clear-on-select="false"  placeholder="Pick your versions" label="name" track-by="name"></vue-multiselect>
            </div>
        </div>
    </div>

    <div class="album py-5 bg-light">
        <div class="container-fluid">
            <div class="row">
                <div v-for="(theme, key) in $parent.filteredThemes" class="col-md-4  mb-4">
                    <div class="card h-100 shadow-sm" :id="key">
                        <img :src="theme.image" class="card-img-top">
                        <div class="card-body">
                            <p class="card-text">
                                <h3 class="jumbotron-heading">{{ theme.name }} <small class="text-muted">By {{ theme.author }} <span :class="'badge badge-' + (theme.price != undefined || theme.price > 0 ? 'primary' : 'success')">{{ (theme.price != undefined || theme.price > 0 ? theme.price : 'Free') }}</span></small></h3>
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
        filteredThemes: {},
        filterVersionsValue: [],
        filterVersionsOptions: [
            { name: "0.7.13" },
            { name: "0.7.*" },
            { name: "0.6.*" },
        ],
    },

    watch: {
        filterVersionsValue: function(values) {
            let newFilteredThemes = {};

            Object.keys(this.themes).forEach((key) => {
                let theme = this.themes[key];

                theme['panel-versions'].forEach(function(version) {
                    values.forEach(function (compVersion) {
                        if (window.compareVersions(compVersion.name, version) > -1) {
                            newFilteredThemes[key] = theme;
                        }
                    })
                });
            });

            this.filteredThemes = this.sortObj(newFilteredThemes, 'asc');
        }
    },

    mounted() {
        axios.get('data/themes.json').then(r => {
            this.themes = this.sortObj(r.data, 'asc');
            this.filteredThemes = this.themes;

            return axios.get('data/featured.json');
        }).then(r => {
            this.featured = r.data;
            this.featured.theme = this.themes[this.featured.id];
        });
    },

    methods: {
        sortObj( obj, order ) {
            let tempArry = [];
            let tempObj = {};
        
            for (let key in obj) {
                tempArry.push(key);
            }
        
            tempArry.sort(
                function(a, b) {
                    return obj[a].name.toLowerCase().localeCompare(obj[b].name.toLowerCase());
                }
            );
        
            if(order === 'desc') {
                for (let i = tempArry.length - 1; i >= 0; i-- ) {
                    tempObj[ tempArry[i] ] = obj[ tempArry[i] ];
                }
            } else {
                for (let i = 0; i < tempArry.length; i++ ) {
                    tempObj[ tempArry[i] ] = obj[ tempArry[i] ];
                }
            }
        
            return tempObj;
        },

        sortObjKeysAlphabetically(obj) {
            var ordered = {};
            Object.keys(obj).sort().forEach(function(key) {
                ordered[key] = obj[key];
            });
            return ordered;
        },
    }
})