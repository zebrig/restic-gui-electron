var repositorycreate = Vue.component('repositorycreate', {
    data: function() {
        return {
            linux: 0
            , newrepopath: ""
            , runnedops: []
            , repopass: ""
            , ip: ""
            , login: ""
            , pass: encrypt((new Date).toString()).substring(0, 16)
        }
    }
    , props: {
        path: String
        , defaultrepopassword: String
    }
    , methods: {
        open: function() {
            const {
                dialog
            } = require('electron').remote;
            // console.log(dialog);
            var folder = dialog.showOpenDialogSync({
                properties: ['openDirectory']
            });
            console.log(folder)
            if (typeof folder != 'undefined') {
                this.newrepopath = folder.toString()
                this.runnedops.push({
                    'command': ['snapshots']
                    , 'run': false
                });
            }
        }
        , mergeLinuxPath: function() {
            if (this.ip.trim() != '' && this.login.trim() != '' && this.pass.trim() != '') {
                this.newrepopath = 'rest:http://' + this.login + ':' + this.pass + '@' + this.ip + ':8000/' + this.login + '/'
            }
        }
        // timeago: function(x) {
        //     return timeago.format(x, 'ru')
        // }
    }
    , computed: {
        // nopayconts: function() {
        //     return 0
        // }
    }
    , mounted() {
        this.repopass = this.defaultrepopassword
    }
    , template: `
    <span>
        <h3> Добавление нового репозитория </h3>
        <h5> Пароль по умолчанию для создания новых репозиториев: [{{defaultrepopassword}}] <button type="button" class="btn btn-outline-success btn-sm" @click="repopass = defaultrepopassword">использовать</button> </h5>
        Пароль для создания или открытия данного репозитория: <input v-model="repopass" style="width:90%"><hr>

        <template v-if="runnedops.length == 0">
            <input type="radio" id="no" value="0" v-model="linux">
            <label for="no">Локальная папка</label>
            <input type="radio" id="yes" value="1" v-model="linux">
            <label for="yes">Linux сервер</label>            
            <hr>
        </template>

        <template v-if="linux == 0">
            <button type="button" class="btn btn-outline-primary" @click="open">Выбрать папку</button><br><br>
  
        </template>
        <template v-if="linux == 1">
            <input type=text v-model="ip" @keyup="mergeLinuxPath()"> IP-адрес Linux сервера<br>
            <input type=text v-model="login" @keyup="mergeLinuxPath()"> Логин пользователя <br>
            <input type=text v-model="pass" @keyup="mergeLinuxPath()"> Пароль пользователя <br>
        </template>


        <div class="alert alert-light" v-if="typeof newrepopath !=='undefined' && newrepopath != '' ">
            <h4>Выбранный путь: [{{newrepopath}}] </h4>
            <hr>
            <button type="button" class="btn btn-outline-info" @click="runnedops.push({'command': ['snapshots'], 'run':false})">Узнать информацию о существующем репозитории</button><br>
            <button type="button" class="btn btn-outline-danger" @click="runnedops.push({'command': ['init'], 'run':false})">Проинициализировать новый репозиторий</button><br>
            <button type="button" class="btn btn-outline-success" @click="$emit('addrepo',[newrepopath,repopass])">Сохранить репозиторий и пароль в настройках</button>
            <hr>
            <commands v-for="(command, index) in runnedops" :key="index" :index="index" :params="command" :repo="newrepopath" :repopass="repopass" @action="runnedops.push({'command': $event, 'run':false})">
            </commands>
        </div>

    </span>
    `
})