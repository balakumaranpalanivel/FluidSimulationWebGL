function initGPUUtils(){

    var shaderUtils = initShaderUtils();

    var canvas = document.getElementById("glCanvas");
    var gl = canvas.getContext("webgl", {antialias:false}) || canvas.getContext("experimental-webgl", {antialias:false});
    var floatTextures = gl.getExtension("OES_texture_float");

    function notSupported(){
        var elm = '<div id="coverImg" ' +
          'style="background: url(content/img.jpg) no-repeat center center fixed;' +
            '-webkit-background-size: cover;' +
            '-moz-background-size: cover;' +
            '-o-background-size: cover;' +
            'background-size: cover;">'+
          '</div>';
        $(elm).appendTo(body);
        $("#noSupportModal").modal("show");
       console.warn("floating point textures are not supported on your system");
    }

    if(!floatTextures){
        notSupported();
    }
}