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

    GPUUtils.prototype.setUniformForProgram = function(programName, name, val, type){
        if(!this.programs[programName]){
            console.warn("no program with name " + programName);
            return;
        }
        var uniforms = this.programs[programName].uniforms;
        var location = uniforms[name];
        if(!location){
            location = gl.getUniformLocation(this.programs[programName].program, name);
            uniforms[name] = location;
        }

        if (type == "1f") gl.uniform1f(location, val);
        else if (type == "2f") gl.uniform2f(location, val[0], val[1]);
        else if (type == "3f") gl.uniform3f(location, val[0], val[1], val[2]);
        else if (type == "1i") gl.uniform1i(location, val);
        else {
            console.warn("no uniform for type " + type);
        }
    };

    GPUUtils.prototype.setSize = function(width, height){
        gl.viewport(0, 0, width, height);
    };

    GPUUtils.prototype.setProgram = function(programName){
        gl.useProgram(this.programs[programName].program);
    };

    GPUUtils.prototype.step = function(programName, inputTextures, outputTexture){
        gl.useProgram(this.programs[programName].program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[outputTexture]);
        for(var i=0; i<inputTextures.length; i++){
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    GPUUtils.prototype.stepBoundary = function(programName, inputTextures, outputTexture){
        gl.useProgram(this.programs[programName].program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[outputTexture]);
        for(var i=0; i<inputTextures.length; i++){
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
        }
        gl.drawArrays(gl.LINES, 0, 8);
    };

    GPUUtils.prototype.swapTextures = function(texture1Name, texture2Name){
        var temp = this.textures[texture1Name];
        this.textures[texture1Name] = this.textures[texture2Name];
        this.textures[texture2Name] = temp;
        temp = this.frameBuffers[texture1Name];
        this.frameBuffers[texture1Name] = this.frameBuffers[texture2Name];
        this.frameBuffers[texture2Name] = temp;
    };

    GPUUtils.prototype.swap3Textures = function(texture1Name, texture2Name, texture3Name){
        var temp = this.textures[texture3Name];
        this.textures[texture3Name] = this.textures[texture2Name];
        this.textures[texture2Name] = this.textures[texture1Name];
        this.textures[texture1Name] = temp;
        temp = this.frameBuffers[texture3Name];
        this.frameBuffers[texture3Name] = this.frameBuffers[texture2Name];
        this.frameBuffers[texture2Name] = this.frameBuffers[texture1Name];
        this.frameBuffers[texture1Name] = temp;
    };

    GPUUtils.prototype.readyToRead = function(){
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE;
    };

    GPUUtils.prototype.readPixels = function(xMin, yMin, width, height, array){
        gl.readPixels(xMin, yMin, width, height, gl.RGBA, gl.UNSIGNED_BYTE, array);
    };

    GPUUtils.prototype.reset = function(){
        this.programs = {};
        this.frameBuffers = {};
        this.textures = {};
        this.index = 0;
    };

    return new GPUUtils;
}