var commands = Vue.component('commands', {
    data: function() {
        return {
            command: ""
            , action: ""
            , ls: ""
            , stdout: []
            , json: []
            , stderr: []
            , error: []
            , start: null
            , end: null
            , running: false
        }
    }
    , props: {
        params: Object
        , repo: String
        , index: Number
        , repopass: String
    }
    , methods: {
        errorvariable: function(x) {
            return require('util').inspect(x, {
                depth: null
            }).replace(/\n/g, "<br />")
        }
        , errorbr: function(x) {
            if (typeof x.replace !== 'undefined') {
                return x.replace(/\n/g, "<br />")
            } else {
                return x
            }
        }
        , parsels: function(data, fltr) {
            var f = fltr.toString().toLowerCase().trim()
            // console.log(data)
            if (this.action != 'ls' || (this.action != 'ls'))
                data = data.toString()
            if (data.indexOf("\n") > 0) {
                data = data.split("\n");
            } else {
                data = [data];
            }
            // console.log(data)

            data.forEach(e => {
                // console.log(e)
                // console.log(f)
                // console.log(e.toString().toLowerCase())
                // console.log(e.toString().toLowerCase().indexOf(f))
                if (f == '' || (e.toString().toLowerCase().indexOf(f) > -1 || e.toString().toLowerCase().indexOf('snapshot') > -1)) {
                    var json;
                    try {
                        json = JSON.parse(e);
                    } catch (err) {
                        // console.log(err)
                        json = {}
                    }
                    if (Object.keys(json).length > 0) {
                        if (Array.isArray(json)) {
                            json.forEach(e => {
                                // console.log(e);
                                if (Object.keys(e).length > 0) {
                                    this.json.push(e)
                                }
                            })
                        } else {
                            // console.log(json);
                            if (Object.keys(json).length > 0) {
                                if (typeof json.struct_type !== 'undefined' && json.struct_type == 'snapshot' && f != '') {
                                    json.filter = fltr
                                }
                                this.json.push(json)
                            }
                        }
                    } else {
                        if (e.trim() != '') {
                            this.stdout.push(e)
                            // console.log(`stdout: ${e}`);
                        }
                    }
                }
            })

            // if (f != '') {
            //     this.json.push({
            //         'struct_type': 'filter'
            //         , 'value': fltr
            //     })
            // }

            // console.log(this.json)
            this.ls = JSON.stringify(this.json)
            this.json = []
        }
        , parse: function(data) {
            // console.log(data)
            data = data.toString()
            if (data.indexOf("\n") > 0) {
                data = data.split("\n");
            } else {
                data = [data];
            }
            // console.log(data)

            data.forEach(e => {
                var json;
                try {
                    json = JSON.parse(e);
                } catch (err) {
                    // console.log(err)
                    json = {}
                }
                if (Object.keys(json).length > 0) {
                    if (Array.isArray(json)) {
                        json.forEach(e => {
                            // console.log(e);
                            if (Object.keys(e).length > 0) {
                                this.json.push(e)
                            }
                        })
                    } else {
                        // console.log(json);
                        if (Object.keys(json).length > 0) {
                            this.json.push(json)
                        }
                    }
                } else {
                    if (e.trim() != '') {
                        this.stdout.push(e)
                        // console.log(`stdout: ${e}`);
                    }
                }
            })
        }
        , timeago: function(x) {
            return timeago.format(x, 'ru')
        }
        , run: function(action) {
            window.scrollTo(0, document.body.scrollHeight);
            var pass = this.repopass;
            if (pass == '') {
                pass = ' '
            }
            var params = {
                cwd: undefined
                , env: process.env
                , detached: true
            };
            params.env.RESTIC_PASSWORD = pass;

            var args = ["--json", "-r", this.repo];
            if (action == "version") {
                args = []
            }
            if (typeof action == "string") {
                args.push(action)
                this.action = action
            } else if (typeof action == "object") {
                this.action = action[0]
                action.forEach(element => {
                    args.push(element);
                });
            }

            this.start = new Date();
            this.running = true

            // var spawncomms = ['ls']

            if (typeof args[3] != 'undefined' && args[3] == 'ls') {

                var fltr = args[6]
                args.pop()
                console.log(args)
                const {
                    execFile
                } = require("child_process");

                params.maxBuffer = 1024 * 1024 * 500
                params.stdio = ['ignore', 'pipe', 'ignore']

                var ls = execFile(restic, args, params, (error, stdout, stderr) => {
                    // console.log(error, stdout, stderr)
                    if (error) {
                        this.error.push(error)
                        this.stderr.push(stderr);
                    }
                    // console.log(stdout)
                    this.parsels(stdout, fltr)
                    stdout = "";
                    this.end = new Date();
                    this.running = false
                    window.scrollTo(0, document.body.scrollHeight);
                });
                // console.log(ls)
            } else {
                const {
                    spawn
                } = require("child_process");

                const ls = spawn(restic, args, params);
                // console.log(ls)
                ls.stdout.on('data', (stdout) => {
                    this.parse(stdout)
                    if (args[3] == 'backup') {
                        while (this.json.length > 10) {
                            this.json.shift();
                        }
                    }
                });

                ls.stderr.on('data', (stderr) => {
                    this.stderr.push(stderr);
                });

                ls.on('close', (code) => {
                    // console.log(`child process exited with code ${code}`);
                    this.end = new Date();
                    this.running = false
                    window.scrollTo(0, document.body.scrollHeight);
                });
            }

            this.command = restic + " " + args.join(' ') + ' (пароль: [' + pass + '])';
        }
    }
    , computed: {
        timerun: function() {
            return Math.round((this.end.getTime() - this.start.getTime()) / 10) / 100
        }
        , starttime: function() {
            return this.start.toLocaleTimeString();
        }
        , endtime: function() {
            return this.end.toLocaleTimeString();
        }
        , sortedjson: function() {
            if (this.params.command[0] == 'snapshots') {
                function compare(a, b) {
                    if (a.time.toString() < b.time.toString())
                        return 1;
                    if (a.time.toString() > b.time.toString())
                        return -1;
                    return 0;
                }
                return this.json.sort(compare);
            }
        }
    }
    , mounted() {
        if (typeof this.params.run == 'undefined') {
            // console.log('error: ', this.params.run)
        } else {
            if (this.params.run === false) {
                this.$set(this.params, 'run', true);
                this.run(this.params.command)
            }
        }
        // feather.replace()
        // console.log(this.params)

    }
    , template: `
    <div>
        <div :class="'alert alert-'+(running?'primary':'dark')" :id="index">
            <a :href="'#'+(index+1)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg></a>
            <a :href="'#'+(index-1)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg></a>

            {{ command }} 
            <span class="badge badge-secondary" v-if="start !== null">{{ starttime }} - </span>
            <span class="badge badge-secondary" v-if="end === null"> ...running </span>
            <span class="badge badge-secondary" v-if="end !== null"> {{ endtime }} ({{ timerun }} сек.)</span> 
            
        </div>
        <div class="alert alert-info" v-if="running">
            Подождите, команда выполняется....
        </div>
        <div class="alert alert-success" v-if="stdout.length > 0">
            <template v-for="line in stdout">
                {{ line }} <br>
            </template>
        </div>
        <table v-if="params.command[0] == 'snapshots' && json.length > 0" class="table table-sm table-hover table-bordered table-striped wrap">
            <snapshots :message="sortedjson" :type="params.command" @action="(...args)=>$emit('action', ...args)"></snapshots>
        </table>

        <filelist v-if="params.command[0] == 'ls' && ls.length > 0" :filelist="ls" :type="params.command" @action="(...args)=>$emit('action', ...args)"></filelist>

        <table v-if="params.command[0] == 'backup' && json.length > 0" class="table table-sm table-hover table-bordered table-striped wrap">
            <backup :json="json">
            </backup>
        </table>

        <div v-if="params.command[0] == 'restore' && json.length > 0" class="alert alert-success">
            {{json}}
        </div>

        <div v-if="params.command[0] == 'forget' && json.length > 0" class="alert alert-success">
            <div v-for="line in json">
                <template v-if="line.remove && line.remove.length > 0">
                    Удалены snapshot'ы:
                    <ol>
                        <li v-for="rem in line.remove"> {{ rem.short_id }} (создан {{ timeago(rem.time) }} - {{ rem.time }}). Пути: {{rem.paths}}</li>
                    </ol>
                </template>
                <template v-else>
                    Нет snapshot'ов, подходящих для удаления
                </template>
            </div>
        </div>

        <div class="alert alert-light" 
            v-if="json.length > 0 && params.command[0] != 'forget' && params.command[0] != 'restore' && params.command[0] != 'backup' && params.command[0] != 'ls' && params.command[0] != 'snapshots'"> json:<hr>
            {{json}}
        </div>
        
        <div class="alert alert-danger" v-if="stderr.length > 0"> StdErr:<hr>
            <p v-for="err in stderr" v-if="typeof err.message_type == 'undefined' || err.message_type != 'error'" v-html="errorbr(err)"></p>
        </div>

        <div class="alert alert-danger" v-if="error.length > 0"> Error: <hr>
            <span v-for="err in error" v-html="errorvariable(err)"></span>
        </div>

    </div>    
    `
})