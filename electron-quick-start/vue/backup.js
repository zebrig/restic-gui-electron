var backup = Vue.component('backup', {
    data: function() {
        return {
            start: null
        }
    }
    , props: {
        json: Array
    }
    , methods: {
        formatBytes: function(c) {
            return formatBytes(c)
        }
        , timeago: function(x) {
            return timeago.format(x, 'ru')
        }
        , time: function() {
            var now = new Date()
            var x = now - this.start
            var seconds = Math.round(x / 1000);
            var minutes = 0
            if (seconds > 60) {
                minutes = Math.floor(seconds / 60)
            }
            if (minutes > 0) {
                seconds = seconds - minutes * 60;
                return minutes + ' мин. ' + seconds + ' сек.'
            } else {
                return seconds + ' сек.'
            }
        }
    }
    , computed: {
        
    }
    , mounted() {
        this.start = new Date();
    }
    , template: `
    <tbody>
        <tr><td>Процент</td><td>Файлов</td><td>Байт</td><td>Время</td></tr>
        <tr v-for="line in json" v-if="line.message_type == 'status'">
            <td> {{ Math.round(line.percent_done*100) }}% </td>
            <td> {{ line.total_files }} </td>
            <td> {{ formatBytes(line.total_bytes) }} </td>
            <td> {{ time() }} </td>
        </tr>
        <tr><td colspan=100></td></tr>
        <tr>
            <td>Snapshot</td>
            <td>Новых файлов</td>
            <td>Измененных файлов</td>
            <td>Неизмененных файлов</td>
            <td>Новых папок</td>
            <td>Измененных папок</td>
            <td>Неизмененных папок</td>
            <td>Обработано файлов</td>
            <td>Обработано байт</td>
            <td>Время</td>
        </tr>
        <tr v-for="line in json" v-if="line.message_type == 'summary'">
            <td>{{ line.snapshot_id }}</td>
            <td>{{ line.files_new }}</td>
            <td>{{ line.files_changed }}</td>
            <td>{{ line.files_unmodified }}</td>
            <td>{{ line.dirs_new }}</td>
            <td>{{ line.dirs_changed }}</td>
            <td>{{ line.dirs_unmodified }}</td>
            <td>{{ line.total_files_processed }}</td>
            <td>{{ formatBytes(line.total_bytes_processed) }}</td>
            <td>{{ line.total_duration }}</td>
        </tr>
    </tbody>
    `
})