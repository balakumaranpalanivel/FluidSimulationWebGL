//from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

function initShaderUtils(){

    // creates and compiles shader
    function compileShader(gl, shaderSource, shaderType){
        // create shader object
        var shader = gl.createShader(shaderType);

        // set shader source code
        gl.shaderSource(shader, shaderSource);

        // compile shader
        gl.compileShader(shader);

        // check for errors
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!success){
            throw "Could not compile shader:" + gl.getShaderInfoLog(shader);
        }

        return shader;
    }

    // creates a program from 2 shaders
    function createProgram(gl, vertexShader, fragmentShader){
        // create program
        var program = gl.createProgram();

        // attach the two shaders
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // link the program
        gl.linkProgram(program);

        // check the linking
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(!success){
            throw "Program failed to link" + gl.getProgramInfoLog(program);
        }

        return program;
    }

    // create a shader from content of script tag
    function createShaderFromSource(gl, shaderSource, shaderType){
        return compileShader(gl, shaderSource, shaderType);
    }

    // create program from two script tags
    function createProgramFromSource(gl, vertexShaderId, fragmentShaderId){
        var vertexShader = createShaderFromSource(gl, vertexShader, gl.VERTEX_SHADER);
        var fragmentShader = createShaderFromSource(gl, fragmentShader, gl.FRAGMENT_SHADER);
        return createProgram(gl, vertexShader, fragmentShader);
    }

    function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId) {
        var vertexShader = createShaderFromScript(gl, vertexShaderId);
        var fragmentShader = createShaderFromScript(gl, fragmentShaderId);
        return createProgram(gl, vertexShader, fragmentShader);
      }

    function createShaderFromScript(gl, scriptId, opt_shaderType){
        // look up script tag by id
        var shaderScript = document.getElementById(scriptId);
        if(!shaderScript){
            throw("*** Error: unknown script element" + scriptId);
        }

        // extract content of script tag
        var shaderSource = shaderScript.text;

        // If we didn't pass in a type, use the 'type' from
        // the script tag.
        if (!opt_shaderType) {
            if (shaderScript.type == "x-shader/x-vertex") {
            opt_shaderType = gl.VERTEX_SHADER;
            } else if (shaderScript.type == "x-shader/x-fragment") {
            opt_shaderType = gl.FRAGMENT_SHADER;
            } else if (!opt_shaderType) {
            throw("*** Error: shader type not set");
            }
        }

        return compileShader(gl, shaderSource, opt_shaderType);
    }

    function loadVertexData(gl, program){
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        var val = 1.0;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
            [-val, -val, val, -val, -val, val, val, val]), gl.STATIC_DRAW);

        // lookup where vertex data needs to go
        var positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.Float, false, 0, 0);
    }

    function makeTexture(gl, width, height, type, data){
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, data);

        return texture;
    }

    return{
        createProgramFromSource: createProgramFromSource,
        createProgramFromScripts: createProgramFromScripts,
        loadVertexData: loadVertexData,
        makeTexture: makeTexture
    }
}