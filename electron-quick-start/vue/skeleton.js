var repo = Vue.component('repo', {
    data: function() {
        return {
            busy: true
        }
    }
    , props: {
        path: String        
    }
    , methods: {
        attachTo: function(client, pos) {}
    }
    , computed: {
        nopayconts: function() {
            return 0
        }
    }
    , mounted() {

    }
})