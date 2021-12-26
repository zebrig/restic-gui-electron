// $(document).ready(function() {

//     $(function() { // on page load
//         // Create the tree inside the <div id="tree"> element.
//         $("#tree").fancytree({
//             extensions: ["edit", "filter"]
//             , source: [{
//                     title: "Node 1"
//                     , key: "1"
//                 }
//                 , {
//                     title: "Folder 2"
//                     , key: "2"
//                     , folder: true
//                     , children: [{
//                             title: "Node 2.1"
//                             , key: "3"
//                         }
//                         , {
//                             title: "Node 2.2"
//                             , key: "4"
//                         }
//                     ]
//                 }
//             ]

//         });
//         // Note: Loading and initialization may be asynchronous, so the nodes may not be accessible yet.
//     });
// });

var element = document.getElementById("hostname")
const os = require('os');

var hostname = os.hostname()

const restic = `./restic_DoctorServer0.10.0_windows_amd64.exe`

function utf8_encode(str_data) { // Encodes an ISO-8859-1 string to UTF-8
    // 
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)

    str_data = str_data.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < str_data.length; n++) {
        var c = str_data.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    return utftext;
}

function sha1(str) { // Calculate the sha1 hash of a string
    // 
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://crestidg.com)

    var rotate_left = function(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    var lsb_hex = function(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    var cvt_hex = function(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    str = this.utf8_encode(str);
    var str_len = str.length;

    var word_array = new Array();
    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 |
            str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (str_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

let crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

const al = 'aes-256-cbc';
const ch = "8aIr54MTveRiFWtksxtxrE1QrCJrvTwg"; // Same key used in Golang
const ci = "ItcmDtnUkHHYs3XYQFGujiKSmspDG7rm"; // Same key used in Golang
const ck = "e91f607063a0336a872707afe49026a5"; // Same key used in Golang
const cl = "2pgkXhNNH2Enwp9EkYkn0BKOIHvA1F5L"; // Same key used in Golang
const cm = "uFm3JWBse0ISerzXxSxenTqYpd2dto7J"; // Same key used in Golang
const bs = 16;

// Decrypts cipher text into plain text
function decrypt(cipherText) {
    let decrypted
    try {
        const contents = Buffer.from(cipherText, 'hex');
        const iv = contents.slice(0, bs);
        const textBytes = contents.slice(bs);

        const decipher = crypto.createDecipheriv(al, ck, iv);
        decrypted = decipher.update(textBytes, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    } catch (e) {
        alert(e)
    } finally {
        return decrypted;
    }
}

// Encrypts plain text into cipher text
function encrypt(plainText) {
    const iv = crypto.randomBytes(bs);
    const cipher = crypto.createCipheriv(al, ck, iv);
    let cipherText;
    try {
        cipherText = cipher.update(plainText, 'utf8', 'hex');
        cipherText += cipher.final('hex');
        cipherText = iv.toString('hex') + cipherText
    } catch (e) {
        cipherText = null;
    }
    return cipherText;
}