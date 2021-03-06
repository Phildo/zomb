var GeoGLProgram = function (gl, vs, fs)
{
  var that = new XGLProgram(gl, vs, fs);
  
  //Copies XGLProgram's interface for adding/removing geos
  that.lights = [];
  that.addLight = function(xLight)
  {
    xLight.programLightListIndex = that.lights.length;
    that.lights[that.lights.length] = xLight;
    return xLight;
  }
  that.removeLight = function(xLight)
  {
    for(var i = xLight.programLightListIndex+1; i < that.lights.length; i++)
      that.lights[i].programLightListIndex--;
    that.lights.splice(xLight.programLightListIndex,1);
    xLight.programLightListIndex = -1;
    return xLight;
  }
  that.getLight = function(g)
  {
    return that.lights[g];
  }

  gl.useProgram(that.gl_program);
  
  that.pMatU      = gl.getUniformLocation(that.gl_program, "uPMatrix");
  that.camMatU    = gl.getUniformLocation(that.gl_program, "uCamMatrix");
  that.mMatU      = gl.getUniformLocation(that.gl_program, "uMVMatrix");
  that.lightPosU  = gl.getUniformLocation(that.gl_program, "uLightPosition");
  that.numLightsU = gl.getUniformLocation(that.gl_program, "uNumLights");

  that.mMatIndexA = gl.getAttribLocation(that.gl_program, "aMVMatrixIndex");
  gl.enableVertexAttribArray(that.mMatIndexA);
  that.mMatIndexBuffer = gl.createBuffer();
  
  that.vertsA = gl.getAttribLocation(that.gl_program, "aVertexPosition");
  gl.enableVertexAttribArray(that.vertsA);
  that.vertBuffer = gl.createBuffer();

  that.colorsA = gl.getAttribLocation(that.gl_program, "aVertexColor");
  gl.enableVertexAttribArray(that.colorsA);
  that.colorBuffer = gl.createBuffer();

  that.normalsA = gl.getAttribLocation(that.gl_program, "aVertexNormal");
  gl.enableVertexAttribArray(that.normalsA);
  that.normalBuffer = gl.createBuffer();

  that.indexBuffer = gl.createBuffer();

  //Model references
  that.pMatData   = mat4.create(); mat4.perspective(45, glm.lowResDim.width/glm.lowResDim.height, 0.1, 100.0, that.pMatData);
  that.camMatData = mat4.create(); mat4.identity(that.camMatData); that.trueCamMatData = mat4.create();;
  that.mMatData      = [];
  that.lightPosData  = [];
  that.mMatIndexData = [];
  that.vertData      = [];
  that.colorData     = [];
  that.normalData    = [];
  that.indexData     = [];

  that.compileStaticData = function()
  {
    that.indexData = [];
    var currentVertOffset = 0;
    for(var i = 0; i < that.geos.length; i++)
    {
      for(var j = 0; j < that.geos[i].indexes.length; j++)
      {
        that.indexData[that.indexData.length] = that.geos[i].indexes[j] + currentVertOffset;
      }
      for(var j = 0; j < that.geos[i].verts.length/3; j++)
      {
        //Copy MVMat Index
        that.mMatIndexData[currentVertOffset] = i;

        //Copy Vert
        that.vertData[(currentVertOffset*3)+0] = that.geos[i].verts[(j*3)+0];
        that.vertData[(currentVertOffset*3)+1] = that.geos[i].verts[(j*3)+1];
        that.vertData[(currentVertOffset*3)+2] = that.geos[i].verts[(j*3)+2];

        //Copy Color
        that.colorData[(currentVertOffset*3)+0] = that.geos[i].colors[(j*3)+0];
        that.colorData[(currentVertOffset*3)+1] = that.geos[i].colors[(j*3)+1];
        that.colorData[(currentVertOffset*3)+2] = that.geos[i].colors[(j*3)+2];

        //Copy Normal
        that.normalData[(currentVertOffset*3)+0] = that.geos[i].normals[(j*3)+0];
        that.normalData[(currentVertOffset*3)+1] = that.geos[i].normals[(j*3)+1];
        that.normalData[(currentVertOffset*3)+2] = that.geos[i].normals[(j*3)+2];

        currentVertOffset++;
      }
    }
    
    that.commitStaticData();
  }

  that.commitStaticData = function()
  {
    gl.useProgram(that.gl_program);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.mMatIndexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.mMatIndexData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(that.mMatIndexA, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.vertData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(that.vertsA, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.colorData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(that.colorsA, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.normalData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(that.normalsA, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(that.indexData), gl.STATIC_DRAW);
  }

  that.compileDynamicData = function()
  {
    for(var i = 0; i < that.geos.length; i++)
    {
      //Compile MVMatrixes
      that.mMatData[(i*16)+0] = that.geos[i].mMat[0];
      that.mMatData[(i*16)+1] = that.geos[i].mMat[1];
      that.mMatData[(i*16)+2] = that.geos[i].mMat[2];
      that.mMatData[(i*16)+3] = that.geos[i].mMat[3];
      that.mMatData[(i*16)+4] = that.geos[i].mMat[4];
      that.mMatData[(i*16)+5] = that.geos[i].mMat[5];
      that.mMatData[(i*16)+6] = that.geos[i].mMat[6];
      that.mMatData[(i*16)+7] = that.geos[i].mMat[7];
      that.mMatData[(i*16)+8] = that.geos[i].mMat[8];
      that.mMatData[(i*16)+9] = that.geos[i].mMat[9];
      that.mMatData[(i*16)+10] = that.geos[i].mMat[10];
      that.mMatData[(i*16)+11] = that.geos[i].mMat[11];
      that.mMatData[(i*16)+12] = that.geos[i].mMat[12];
      that.mMatData[(i*16)+13] = that.geos[i].mMat[13];
      that.mMatData[(i*16)+14] = that.geos[i].mMat[14];
      that.mMatData[(i*16)+15] = that.geos[i].mMat[15];
    }
    for(var i = 0; i < that.lights.length; i++)
    {
      that.lightPosData[(i*3)+0] = that.lights[i].position[0];
      that.lightPosData[(i*3)+1] = that.lights[i].position[1];
      that.lightPosData[(i*3)+2] = that.lights[i].position[2];
    }

    mat4.inverse(that.camMatData,that.trueCamMatData)

    that.commitDynamicData();
  }

  that.commitDynamicData = function()
  {
    gl.useProgram(that.gl_program);

    gl.uniformMatrix4fv(that.pMatU, false, that.pMatData);
    gl.uniformMatrix4fv(that.camMatU, false, that.trueCamMatData);
    gl.uniformMatrix4fv(that.mMatU, false, that.mMatData);
    gl.uniform3fv(that.lightPosU, that.lightPosData);
    gl.uniform1i(that.numLightsU, that.lights.length);
  }

  that.bindAttributes = function()
  {
    gl.bindBuffer(gl.ARRAY_BUFFER, that.mMatIndexBuffer);
    gl.vertexAttribPointer(that.mMatIndexA, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.vertBuffer);
    gl.vertexAttribPointer(that.vertsA, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.colorBuffer);
    gl.vertexAttribPointer(that.colorsA, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, that.normalBuffer);
    gl.vertexAttribPointer(that.normalsA, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indexBuffer);
  }

  that.draw = function()
  {
    gl.useProgram(that.gl_program);
    gl.viewport(0,0,glm.lowResDim.width,glm.lowResDim.height);
    that.compileDynamicData();
    that.bindAttributes();
    gl.drawElements(gl.TRIANGLES, that.indexData.length, gl.UNSIGNED_SHORT, 0);
  }

  return that;
}
