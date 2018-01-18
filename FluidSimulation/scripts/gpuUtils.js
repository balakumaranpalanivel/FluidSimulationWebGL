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

    var maxTexturesInFragmentShader = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    console.log(maxTexturesInFragmentShader + " textures max");

    function GPUUtils(){
        this.reset();
    }

    GPUUtils.prototype.createProgram = function(programName, vertexShader, fragmentShader){
        var programs = this.programs;
        var program = programs[programName];
        if(program){
            console.warn("Progarm with Name already exists " + programName);
            return;
        }
        program = shaderUtils.createProgramFromScripts(gl, vertexShader, fragmentShader);
        gl.useProgram(program);
        // Load vertex data
    }
}