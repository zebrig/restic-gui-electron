var filelistdir = Vue.component('filelistdir', {
    data: function() {
        return {
            path: []
            , selected: []
        }
    }
    , props: {
        data: Object
    }
    , methods: {
        clck: function(id, s) {
            // if (typeof s.target.checked != 'undefined'){
            //     if (s.target.checked){
            //         this.selected.push(id)
            //     } else {
            //         this.selected = this.removeA(this.selected, id)
            //     }
            // }
            // console.log(this.selected)
            this.$emit('select', this.selected)
        }
        , removeA: function(arr) {
            var what, a = arguments
                , L = a.length
                , ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax = arr.indexOf(what)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        }
        , formatBytes: function(c) {
            return formatBytes(c)
        }
        , folder: function() {
            var ret = []
            var x = this.data
            this.path.forEach(e => {
                if (typeof x[e] != 'undefined') {
                    x = x[e]['children']
                }
            })
            Object.keys(x).forEach(e => {
                ret.push({
                    'name': x[e]['name']
                    , 'type': x[e]['type']
                    , 'id': x[e]['id']
                    , 'size': x[e]['size']
                    , 'children': Object.keys(x[e]['children']).length
                })
            })
            x = null;
            return ret
        }
    }
    , computed: {
        nopayconts: function() {
            return 0
        }
    }
    , mounted() {

    }
    , template: `
    <div>
        Текущий путь: <template v-for="p in path">/{{ p }}</template>
        <ol>
        <li @click="path.pop();" v-if="path.length > 0" style="cursor:pointer">..</li>
        <li v-for="file in folder()" style="cursor:pointer">
            <input type="checkbox" @change="clck(file.id, $event)" :value="file.id" v-model="selected">
            <span v-if="file.type =='dir'" @click="path.push(file.name);">
                &#128448;
                {{file.name}} ({{file.children}} элементов)
            </span>
            <template v-if="file.type !='dir'">
                &#128459;
                {{file.name}} ({{formatBytes(file.size)}})
            </template>
        </li>
        </ol>
    </div>
    `
})