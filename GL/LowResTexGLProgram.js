var LowResTexGLProgram = function (gl, vs, fs)
{
  var that = new XGLProgram(gl, vs, fs);
  gl.useProgram(that.gl_program);

  that.vertsA = gl.getAttribLocation(that.gl_program, "aVertexPosition");
  gl.enableVertexAttribArray(that.vertsA);
  that.vertBuffer = gl.createBuffer();

  that.samplerU = gl.getUniformLocation(that.gl_program, "uSampler");

  that.indexBuffer = gl.createBuffer();

  that.frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, that.frameBuffer);

  that.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, that.texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glm.lowResDim.width, glm.lowResDim.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  that.depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, that.depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, glm.lowResDim.width, glm.lowResDim.height);

  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, that.depthBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, that.texture, 0);

  //Model references
  that.vertData = [];
  that.indexData = [];

  that.compileStaticData = function()
  {
    var currentVertexOffset = 0;
    for(var i = 0; i < that.geos.length; i++)
    {
      for(var j = 0; j < that.geos[i].indexes.length; j++)
      {
        that.indexData[that.indexData.length] = that.geos[i].indexes[j] + currentVertexOffset;
      }
      for(var j = 0; j < that.geos[i].verts.length/2; j++)
      {
        that.vertData[(currentVertexOffset*2)+0] = that.geos[i].verts[(j*2)+0];
        that.vertData[(currentVertexOffset*2)+1] = that.geos[i].verts[(j*2)+1];

        currentVertexOffset++;
      }
    }
    
    that.commitStaticData();
  }

  that.commitStaticData = function()
  {
    gl.useProgram(that.gl_program);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.vertData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(that.vertsA, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(that.indexData), gl.STATIC_DRAW);
  }

  that.bindAttributes = function()
  {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, that.texture);
    gl.uniform1i(that.samplerU, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.vertBuffer);
    gl.vertexAttribPointer(that.vertsA, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indexBuffer);
  }

  that.draw = function()
  {
    gl.useProgram(that.gl_program);
    gl.viewport(0,0,glm.lowResDim.width,glm.lowResDim.height);
    that.bindAttributes();
    gl.drawElements(gl.TRIANGLES, that.indexData.length, gl.UNSIGNED_SHORT, 0);
  }

  return that;
}
