var repository = Vue.component('repository', {
    data: function() {
        return {
            runnedops: []
        }
    }
    , props: {
        path: String
        , repoparams: Object
    }
    , methods: {
        prune: function(prune = false) {
            var task = ['forget'];
            if (prune) {
                task.push('--prune')
            }

            if (this.repoparams['daily'] > 0) {
                task.push('--keep-daily')
                task.push(this.repoparams['daily'])
            }

            if (this.repoparams['weekly'] > 0) {
                task.push('--keep-weekly')
                task.push(this.repoparams['weekly'])
            }

            if (this.repoparams['monthly'] > 0) {
                task.push('--keep-monthly')
                task.push(this.repoparams['monthly'])
            }

            if (this.repoparams['yearly'] > 0) {
                task.push('--keep-yearly')
                task.push(this.repoparams['yearly'])
            }

            this.runnedops.push({
                'command': task
                , 'run': false
            })
        }
        , daily: function() {
            if (!(this.repoparams['daily'] > 2)) {
                this.$set(this.repoparams, 'daily', 3)
            }
        }
        , weekly: function() {
            if (!(this.repoparams['weekly'] > 0)) {
                this.$set(this.repoparams, 'weekly', 1)
            }
        }
        , monthly: function() {
            if (!(this.repoparams['monthly'] > 0)) {
                this.$set(this.repoparams, 'monthly', 1)
            }
        }
        , yearly: function() {
            if (!(this.repoparams['yearly'] > -1)) {
                this.$set(this.repoparams, 'yearly', 0)
            }
        }
        , runBackup: function() {
            var task = ['backup'];
            console.log(this.repoparams['usevss']);
            if (this.repoparams['usevss'] == '1') {
                task.push('--use-fs-snapshot')
            }

            this.repoparams['sources'].forEach(folder => {
                task.push(folder)
            });
            this.runnedops.push({
                'command': task
                , 'run': false
            })
        }
        , addFolder: function() {
            const {
                dialog
            } = require('electron').remote;
            // console.log(dialog);
            var x = dialog.showOpenDialogSync({
                properties: ['openDirectory']
            })

            if (typeof x !== 'undefined' && this.repoparams['sources'].indexOf(x[0]) == -1) {
                this.repoparams['sources'].push(x[0])
            }
        }
    }
    , computed: {
        // nopayconts: function() {
        //     return 0
        // }
    }
    , mounted() {
        this.runnedops.push({
            'command': ['snapshots']
            , 'run': false
        })
    }
    , template: `
    <span>
        <h3>??????????????????????: [{{path}}] <button type="button" class="btn btn-outline-danger" @click="$emit('delete')">?????????????? ?????????????????????? ???? ????????????</button></h3>
        <h5>????????????: <input v-model="repoparams['password']" style="width:90%"></h5>
        <div class='alert alert-info'>
            ??????????-??????????????????: 
            <button type="button" class="btn btn-sm btn-outline-primary" @click="addFolder()">+</button>
            <ol>
                <li v-for="(folder, i) in repoparams['sources']">{{folder}} <button  type="button" class="btn btn-sm btn-danger" @click="repoparams['sources'].splice(i, 1);">x</button></li>
            </ol>
            ???????????????????????? ?????????????? ??????????????????????: 
            <input type="radio" id="yes" value="1" v-model="repoparams['usevss']">
            <label for="yes">????</label>            
            <input type="radio" id="no" value="0" v-model="repoparams['usevss']">
            <label for="no">??????</label>
        </div>
        <table class="table table-bordered">
            <tr>
                <td colspan=999>
                    <h3>
                        ?????????????????????????? ??????????????????????
                    </h3>
                </td>
            </tr>
            <tr>
                <td>?????? ????????????</td>
                <td>?????????? ????????????????</td>
            </tr>
            <tr>
                <td>
                    <input type="checkbox" :value="1" v-model="repoparams['week']"> ???? <br>
                    <input type="checkbox" :value="2" v-model="repoparams['week']"> ???? <br>
                    <input type="checkbox" :value="3" v-model="repoparams['week']"> ???? <br>
                    <input type="checkbox" :value="4" v-model="repoparams['week']"> ???? <br>
                    <input type="checkbox" :value="5" v-model="repoparams['week']"> ???? <br>
                    <input type="checkbox" :value="6" v-model="repoparams['week']"> ???? <br>
                    <input type="checkbox" :value="7" v-model="repoparams['week']"> ???? <br>
                </td>
                <td>
                    <template v-for="(o,i) in 24" >
                        <input type="checkbox" :value="i" v-model="repoparams['hour']"> {{ i }}:00 &nbsp; &nbsp; 
                        <template v-if="o < 10"> &nbsp; </template>
                        <template v-if="o/5 == Math.round(o/5)"> <br> </template>
                    </template>
                </td>
            </tr>
        </table>
        <table class="table table-bordered">
            <tr>
                <td>
                    ???????? ???????????? ????????????????:<br>
                    <template v-for="(o,i) in 30" >
                        <input type="checkbox" :value="o" v-model="repoparams['check']"> {{ o }} &nbsp; &nbsp; 
                        <template v-if="o < 10"> &nbsp; </template>
                        <template v-if="o/5 == Math.round(o/5)"> <br> </template>
                    </template>
                </td>
                <td>
                    ???????? ???????????????? ???????????? snapshots:<br>
                    <template v-for="(o,i) in 30" >
                        <input type="checkbox" :value="o" v-model="repoparams['prune']"> {{ o }} &nbsp; &nbsp; 
                        <template v-if="o < 10"> &nbsp; </template>
                        <template v-if="o/5 == Math.round(o/5)"> <br> </template>
                    </template>
                </td>
            </tr>
        </table>
        <div class='alert alert-secondary'>
            <table>
                <tr>
                    <td>
                        ?????????????? ???? ?????????? ?????????? ???? ??????????????????: &nbsp;&nbsp;&nbsp;&nbsp;
                        <br>
                        <input v-model.number="repoparams['daily']" style="width:50px" @keyup="daily()"> ????????<br>
                        <input v-model.number="repoparams['weekly']" style="width:50px" @keyup="weekly()"> ????????????<br>
                        <input v-model.number="repoparams['monthly']" style="width:50px" @keyup="monthly()"> ??????????????<br>
                        <input v-model.number="repoparams['yearly']" style="width:50px" @keyup="yearly()"> ??????<br>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="prune()">???????????? ?????????????? ???????????? snapshot'??</button><br>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="runnedops.push({'command': ['prune'], 'run': false})">???????????????????????? ???????????? ?????????? ???????????????? ????????????????</button>
                        <hr>
                        ?????? <br>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="prune(true)">?????????????? ???????????? snapshot'?? ?????????? ?? ???????????????????????? ????????????</button>
                    </td>
                </tr>
            </table>
        </div>
        <hr>
        <button type="button" class="btn btn-outline-success btn-lg btn-block" @click="$emit('save')">?????????????????? ?????????????????? ??????????????????????</button>
        <hr>

        <commands v-for="(command, index) in runnedops" :key="path+index" :index="index" :params="command" :repo="path" :repopass="repoparams['password']" @action="runnedops.push({'command': $event, 'run':false})">
        </commands>
        
        <hr>

        <button type="button" class="btn btn-outline-info" @click="runnedops.push({'command': ['check'], 'run': false})">?????????????? ????????????????</button>
        <button type="button" class="btn btn-outline-dark" @click="runnedops.push({'command': ['check', '--read-data'], 'run': false})">???????????? ????????????????</button>
        <button type="button" class="btn btn-outline-warning" @click="runnedops.push({'command': ['snapshots'], 'run': false})">???????????????? snapshot'??</button>
        <button type="button" class="btn btn-outline-primary" @click="runBackup()">?????????????? ?????????????????? ??????????</button>
        <br>
        <br>
    </span>
    `
})