var snapshots = Vue.component('snapshots', {
    data: function() {
        return {
            diff: []
            , showdate: false
            , fltr: ""
        }
    }
    , props: {
        message: Array
        , type: Array
    }
    , methods: {
        timeago: function(x) {
            return timeago.format(x, 'ru')
        }
        , addtodiff: function(x) {
            this.diff.push(x);
            while (this.diff.length > 2) {
                this.diff.shift();
            }
        }
    }
    , computed: {
        // nopayconts: function() {
        //     return 0
        // }
    }
    // , mounted() {
    //     // console.log(this.message)
    // }
    , template: `
    <tbody>
        <tr v-if="diff.length > 0">
            <td colspan=999> 
                <h3>Список сравнения snapshot'ов: 
                <span v-for="d in diff"> [{{ d }}] </span>
                <a type="button" class="btn btn-outline-warning" v-if="diff.length > 1" @click="$emit('action',['diff',diff[0],diff[1]]); diff=[]"> Запустить сравнение </a>
                </h3>
            </td>
        </tr>                
        <tr>
            <td>Дата</td>
            <td>Snapshot</td>
            <td>Папки-источники</td>
            <td>Компьютер, пользователь</td>
            <td><input type="text" placeholder="Фильтр списка файлов" v-model="fltr"></td>
        </tr>
        <tr v-for="line in message">
            <td @click="showdate=!showdate" style="cursor:pointer"> {{ timeago(line.time) }} <template v-if="showdate"> <br> {{ line.time }} </template></td>
            <td :title="line.id"> {{ line.short_id }} </td>
            <td> {{ line.paths }} </td>
            <td :title="line.id"> {{ line.hostname }} <br> {{ line.username }} </td> 
            <td>
                <a type="button" class="btn btn-outline-primary" @click="$emit('action',['ls','-l',line.short_id, fltr])">Список файлов</a>
                <a type="button" class="btn btn-outline-warning" @click="addtodiff(line.short_id)">diff</a>
            </td>           
        </tr>
    </tbody>
    `
})