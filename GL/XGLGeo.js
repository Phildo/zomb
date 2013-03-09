var XGLGeo = function (verts, colors, normals, indexes)
{
  //Model Matrix
  this.mMatStack = [];
  for(var i = 0; i < 10; i++)
    this.mMatStack.push(mat4.identity(mat4.create())); //give it 10 levels to start (creation is slow)
  this.mMatIndex = 0;
  this.mMat = this.mMatStack[this.mMatIndex];
  this.mPush = function() 
  { 
    if(this.mMatIndex >= this.mMatStack.length)
      this.mMatStack[this.mMatIndex+1] = mat4.create;
    else
      mat4.set(this.mMatStack[this.mMatIndex],this.mMatStack[this.mMatIndex+1]);
    this.mMat = this.mMatStack[++this.mMatIndex];
  }
  this.mPop = function() 
  { 
    this.mMat=this.mMatStack[--this.mMatIndex];
  }

  this.verts = verts;
  this.colors = colors;
  this.normals = normals;
  this.indexes = indexes;

  this.programGeoListIndex = -1; //Used entirely by XGLPrograms. Should be otherwise ignored.
}
