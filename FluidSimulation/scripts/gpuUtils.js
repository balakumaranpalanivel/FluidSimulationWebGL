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
        // Load vertex 
        shaderUtils.loadVertexData(gl, program);
        programs[programName] = {
            program: program,
            uniforms: {}
        };
    };

    GPUUtils.prototype.initTextureFromData = function(name, width, height, typeName, data, shouldReplace){
        var texture = this.textures[name];
        if(!shouldReplace && texture){
            console.warn("already a texture with name " + name)
            return;
        }
        texture = shaderUtils.makeTexture(gl, width, height, gl[typeName], data);
        this.textures[name] = texture;
    };

    GPUUtils.prototype.initFrameBufferForTexture = function(textureName, shouldReplace){
        if(!shouldReplace){
            var frameBuffer = this.frameBuffers[textureName];
            if(frameBuffer){
                console.warn("Framebuffer already exists for texture " + textureName);
                return;
            }
        }

        var texture = this.textures[textureName];
        if(!texture){
            console.warn("texture " + textureName + " does not exist");
            return;
        }

        frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHEMENT0, gl.TEXTURE_2D, texture, 0);

        var check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if(check != gl.FRAMEBUFFER_COMPLETE){
            notSupported();
        }

        this.frameBuffers[textureName] = framebuffer;
    };
}