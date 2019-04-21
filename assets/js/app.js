var app = new Vue({
    el: '#app',
    data: {
        featured: {},
        themes: {},
        message: 'Hello Vue!'
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
});