var filelist = Vue.component('filelist', {
    data: function() {
        return {
            // tree: []
            path: []
            , selected: []
            , structure: {}
            , snapshots: []
            , destination: ""
            , temppath: ""
        }
    }
    , static: function() {
        return {
            tree: []
        }
    }
    , props: {
        filelist: String
        , type: Array
    }
    , methods: {
        log: function(x) {
            console.log(x)
        }
        , startRecovery: function(snapshot) {
            var task = ['restore', snapshot, '--target', this.destination]
            this.selected.forEach(e => {
                task.push('--include')
                task.push(e)
            })
            console.log(task)
            this.$emit('action', task);
        }
        , selectDestinationFolder: function() {
            const {
                dialog
            } = require('electron').remote;
            // console.log(dialog);
            var x = dialog.showOpenDialogSync({
                properties: ['openDirectory']
            })
            if (typeof x !== 'undefined') {
                this.destination = x[0]
            }
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
        , timeago: function(x) {
            return timeago.format(x, 'ru')
        }
        , covertChildren: function(x) {
            if (typeof x == 'object') {
                if (Array.isArray(x)) {
                    x.forEach((e, i) => {
                        x[i] = this.covertChildren(e);
                    });
                } else {
                    if (typeof x.children != 'undefined') {
                        x.children = Object.keys(x.children).map((key) => x.children[key])
                    }
                    x.children = this.covertChildren(x.children);
                }
            }
            return x
        }
        , formatBytes: function(c) {
            return formatBytes(c)
        }
        , mark: function(id, s) {
            if (typeof s.target.checked !== 'undefined') {
                if (s.target.checked) {
                    this.selected.push(id)
                } else {
                    this.selected = this.removeA(this.selected, id);
                }
            }
            // console.log(id)
            // console.log(this.selected)
        }
        , enterdir: function(file) {
            if (file.type == 'dir') {
                this.path.push(file.name);
            }
        }
        , folder: function() {
            var ret = []
            var x = this.tree
            this.path.forEach(p => {
                x.forEach(e => {
                    if (e['name'] == p) {
                        x = e['children']
                    }
                })
                // if (typeof x[e] != 'undefined') {
                //     x = x[e]['children']
                // }
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
        currentPath: function() {
            if (this.path.length > 0) {
                return "/" + this.path.join("/") + "/";
            } else {
                return "/";
            }
        }
    }
    , mounted() {
        var filelist
        try {
            filelist = JSON.parse(this.filelist)
        } catch {
            filelist = []
        }
        if (filelist.length > 0) {
            filelist.forEach(e => {
                if (e.struct_type == 'snapshot') {
                    this.snapshots.push(e);
                }
            })

            tree = {};

            function addnode(obj, index) {
                // console.log(obj)
                if (obj.struct_type == 'node') {
                    var splitpath = obj.path.replace(/^\/|\/$/g, "").split('/');
                    var ptr = tree;
                    for (i = 0; i < splitpath.length; i++) {
                        node = {
                            name: splitpath[i]
                                // , value: obj.path
                            , type: 'dir'
                            , size: obj.size
                            , id: index
                        };
                        if (i == splitpath.length - 1) {
                            node.type = obj.type;
                        }

                        // if (node.type == 'file') {
                        // node.icon = "tree-file"
                        // }
                        ptr[splitpath[i]] = ptr[splitpath[i]] || node;
                        ptr[splitpath[i]].children = ptr[splitpath[i]].children || {};
                        ptr = ptr[splitpath[i]].children;
                    }
                }
            }

            filelist.map(addnode);
            // console.log(require('util').inspect(variable, {
            //     depth: null
            // }));
            this.tree = this.covertChildren(Object.keys(tree).map((key) => tree[key]));
            // this.tree = tree;
            // this.filelist = []
            tree = null;
            filelist = null;
        }
    }
    , template: `
    <div class="alert alert-warning">
        <div v-for="snapshot in snapshots"> Snapshot: <strong>{{ snapshot.short_id }}</strong> - создан <strong>{{ timeago(snapshot.time) }}</strong> ({{ snapshot.time }}) {{ (filelist.length -1 ) }} файлов и папок в архиве<br>
                Папки-источники: <strong>{{ snapshot.paths }}</strong> hosname: [{{ snapshot.hostname }}] username: [{{ snapshot.username }}] </td>
            <div v-if="selected.length>0"> 
                <div>
                    <h3>Выберите папку назначния для восстановления:</h3>
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="selectDestinationFolder()">выбрать папку</button>
                    <hr>
                    <span v-if="destination != ''">
                        Папка-назначение: [{{destination}}]
                        <button type="button" class="btn btn-sm btn-outline-success" @click="startRecovery(snapshot.short_id)">Начать восстановление</button>
                    </span>
                </div>
                
                <table class="table table-sm table-hover table-bordered table-striped wrap">
                <thead>
                    <tr>
                        <th>
                            Вы выделили {{ selected.length }} файлов/папок:
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(id,o) in selected">
                        <td>{{(o+1)}}. {{id}} </td>
                    </tr>
                </tbody></table>
            </div>
            <table class="table table-sm table-hover table-bordered table-striped wrap">
                <tr v-if="typeof snapshot.filter != 'undefined'">
                    <td colspan=999>
                        Фильтр выборки: <strong>[{{ snapshot.filter }}]</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan=999>
                        Текущий путь: <template v-for="p in path">/{{ p }}</template>
                    </td>
                </tr>
                <tr>
                    <td style="width:4%">№</td>
                    <td style="width:4%"></td>
                    <td style="width:80%">Название</td>
                    <td style="width:12%">Размер</td>
                </tr>
                
                <tr>
                    <td colspan=999 @click="path.pop();" v-if="path.length > 0" style="cursor:pointer">
                        ..
                    </td>
                </tr>
                <tr v-for="(file, ind) in folder()" style="cursor:pointer">
                    <td @click="enterdir(file);log(file)">
                        {{ ind +1 }}
                    </td>
                    <td>
                        <input type="checkbox" :value="currentPath+file.name" v-model="selected">
                    </td>
                    <td @click="enterdir(file);">
                        <span v-if="file.type =='dir'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        {{file.name}} 
                        </span>
                        <template v-if="file.type !='dir'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                        {{file.name}}
                        </template>
                    </td>
                    <td @click="enterdir(file);">
                        <template v-if="file.type =='dir'">
                            {{file.children}} эл.
                        </template>
                        <template v-if="file.type !='dir'">
                            {{formatBytes(file.size)}}
                        </template>
                    </td>

                </tr>
            </table>
        </div>
    </div>
    `
})

{
    /* <template v-if="message.struct_type == 'node'">
        <td>{{ message.path }} </td>
        <td>{{ message.type }} </td>            
        <td>{{ message.size }} </td>            
        <td>{{ message.mtime }} </td>            
        <td>{{ message.name }} </td>            
    </template> */
}