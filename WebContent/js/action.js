var gCtx = null;
var gCanvas = null;

var imageData = null;
var ii = 0;
var jj = 0;
var c = 0;

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}
function handleFiles(f) {
  var o = [];
  for (var i = 0; i < f.length; i++) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        $("#result1").val($("#result1").val() + '\n' + theFile.name);
        qrcode.decode(e.target.result);
      };
    })(f[i]);
    // Read in the image file as a data URL.
    // $("#result").val($("#result").val() + '\n' + f[i].name);
    reader.readAsDataURL(f[i]);
  }
}
function load() {
  initCanvas(100, 480);
  qrcode.success = function(d) {
    $("#result2").val($("#result2").val() + '\n' + utf8ToUtf16(d));
  };
  qrcode.error = function(d) {
    $("#result2").val($("#result2").val() + '\n' + utf8ToUtf16(d));
  };
  // qrcode.callback = function(d, status) {
  // alert('读取二维码信息' + (status == 1 ? '成功' : '失败') + '：' + utf8ToUtf16(d));
  // };
  // qrcode.decode("meqrthumb.png");
}

function initCanvas(ww, hh) {
  gCanvas = document.getElementById("qr-canvas");
  gCanvas.addEventListener("dragenter", dragenter, false);
  gCanvas.addEventListener("dragover", dragover, false);
  gCanvas.addEventListener("drop", drop, false);
  var w = ww;
  var h = hh;
  gCanvas.style.width = w + "px";
  gCanvas.style.height = h + "px";
  gCanvas.width = w;
  gCanvas.height = h;
  gCtx = gCanvas.getContext("2d");
  gCtx.clearRect(0, 0, w, h);
  imageData = gCtx.getImageData(0, 0, 320, 240);
}

function utf8ToUtf16(s) {// 将utf-8字符串转码为unicode字符串，要不读取的二维码信息包含中文会乱码
  if (!s) { return; }

  var i, codes, bytes, ret = [], len = s.length;
  for (i = 0; i < len; i++) {
    codes = [];
    codes.push(s.charCodeAt(i));
    if (((codes[0] >> 7) & 0xff) == 0x0) {
      // 单字节 0xxxxxxx
      ret.push(s.charAt(i));
    } else if (((codes[0] >> 5) & 0xff) == 0x6) {
      // 双字节 110xxxxx 10xxxxxx
      codes.push(s.charCodeAt(++i));
      bytes = [];
      bytes.push(codes[0] & 0x1f);
      bytes.push(codes[1] & 0x3f);
      ret.push(String.fromCharCode((bytes[0] << 6) | bytes[1]));
    } else if (((codes[0] >> 4) & 0xff) == 0xe) {
      // 三字节 1110xxxx 10xxxxxx 10xxxxxx
      codes.push(s.charCodeAt(++i));
      codes.push(s.charCodeAt(++i));
      bytes = [];
      bytes.push((codes[0] << 4) | ((codes[1] >> 2) & 0xf));
      bytes.push(((codes[1] & 0x3) << 6) | (codes[2] & 0x3f));
      ret.push(String.fromCharCode((bytes[0] << 8) | bytes[1]));
    }
  }
  return ret.join('');
}
