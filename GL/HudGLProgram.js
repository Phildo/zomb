var HudGLProgram = function (gl, vs, fs)
{
  var that = new XGLProgram(gl, vs, fs);
  gl.useProgram(that.gl_program);

  that.texIndexIndexesA = gl.getAttribLocation(that.gl_program, "aTexIndexIndexes");
  gl.enableVertexAttribArray(that.texIndexIndexesA);
  that.texIndexIndexesBuffer = gl.createBuffer();

  that.tileCornerA = gl.getAttribLocation(that.gl_program, "aTileCorner");
  gl.enableVertexAttribArray(that.tileCornerA);
  that.tileCornerBuffer = gl.createBuffer();

  that.vertsA = gl.getAttribLocation(that.gl_program, "aVertexPosition");
  gl.enableVertexAttribArray(that.vertsA);
  that.vertBuffer = gl.createBuffer();
  
  that.texIndexesU = gl.getUniformLocation(that.gl_program, "uTexIndexes");

  that.samplerU = gl.getUniformLocation(that.gl_program, "uSampler");

  that.indexBuffer = gl.createBuffer();

  that.initTexture = function(image)
  {
    that.tileTexture = gl.createTexture();
    that.tileTexWidth = glm.lowResDim.width*4;
    that.tileTexHeight = glm.lowResDim.height*4;
    gl.bindTexture(gl.TEXTURE_2D, that.tileTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  that.vertData            = [];
  that.tileCornerData      = [];
  that.texIndexIndexesData = [];
  that.texIndexesData      = [];
  that.indexData           = [];

  that.compileStaticData = function()
  {
    var currentVertexOffset = 0;
    that.tileCornerData = [];
    that.texIndexIndexesData = [];
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

        that.tileCornerData[(currentVertexOffset*2)+0] = currentVertexOffset%2;
        that.tileCornerData[(currentVertexOffset*2)+1] = Math.floor(currentVertexOffset/2)%2;

        that.texIndexIndexesData[that.texIndexIndexesData.length] = i;

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
    gl.vertexAttribPointer(that.vertsA, 2, gl.FLOAT, false, 0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.tileCornerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.tileCornerData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(that.tileCornerA, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.texIndexIndexesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.texIndexIndexesData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(that.texIndexIndexesA, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(that.indexData), gl.STATIC_DRAW);
  }

  var xIndex;
  var yIndex;
  that.compileDynamicData = function()
  {
    for(var i = 0; i < that.geos.length; i++)
      that.texIndexesData[i] = that.geos[i].tileIndex;
    that.commitDynamicData();
  }

  that.commitDynamicData = function()
  {
    gl.useProgram(that.gl_program);

    gl.uniform1fv(that.texIndexesU, that.texIndexesData);
  }

  that.bindAttributes = function()
  {
    gl.bindBuffer(gl.ARRAY_BUFFER, that.vertBuffer);
    gl.vertexAttribPointer(that.vertsA, 2, gl.FLOAT, false, 0,0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, that.tileCornerBuffer);
    gl.vertexAttribPointer(that.tileCornerA, 2, gl.FLOAT, false, 0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.texIndexIndexesBuffer);
    gl.vertexAttribPointer(that.texIndexIndexesA, 1, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, that.tileTexture);
    gl.uniform1i(that.samplerU, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indexBuffer);
  }

  that.draw = function()
  {
    gl.useProgram(that.gl_program);
    gl.viewport(0,0,glm.canvas.width,glm.canvas.height);
    that.compileDynamicData();
    that.bindAttributes();
    gl.drawElements(gl.TRIANGLES, that.indexData.length, gl.UNSIGNED_SHORT, 0);
  }

  return that;
}
