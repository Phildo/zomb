var GLMan = function (width, height, glReadyCallback)
{
  var self = this;
  
  this.ready = false;
  
  //Init html element
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width',width);
  canvas.setAttribute('height',height);
  canvas.style.border = '1px solid black';
  canvas.innerHTML = 'Your browser can\'t handle stuff this cool...';
  this.canvas = canvas;

  //Init gl obj
  var gl_context = canvas.getContext('experimental-webgl',{antialias:false});
  gl_context.enable(gl_context.DEPTH_TEST);
  gl_context.blendFunc(gl_context.SRC_ALPHA, gl_context.ONE_MINUS_SRC_ALPHA);
  gl_context.clearColor(0.0, 0.0, 0.0, 1.0);
  this.gl_context = gl_context;

  this.lowResDim = { "width":width/10, "height":height/10 };
  //this.lowResDim = { "width":width, "height":height };
  this.highResDim = { "width":width, "height":height };

  this.geoProgram  = null;
  this.lrt1Program = null;
  this.lrt2Program = null;
  this.hrtProgram  = null;
  this.hudProgram  = null;

  var initShadersFromFiles = function(files)
  {
    if(!files) { console.log("Error loading shaders."); return; }
    
    self.geoProgram = new GeoGLProgram         (gl_context, files.geovs,  files.geofs);
    self.lrt1Program = new LowResTex1GLProgram (gl_context, files.lrt1vs, files.lrt1fs);
    self.lrt2Program = new LowResTex2GLProgram (gl_context, files.lrt2vs, files.lrt2fs);
    self.hrtProgram = new HighResTexGLProgram  (gl_context, files.hrtvs,  files.hrtfs);
    self.hudProgram = new HudGLProgram         (gl_context, files.hudvs,  files.hudfs);
    self.ready = true;
    glReadyCallback();
  };

  //Load the shaders
  AsyncLoader.loadBatch(new AsyncLoaderBatch(
    ['assets/shaders/geovshader.txt',
    'assets/shaders/geofshader.txt',
    'assets/shaders/lrt1vshader.txt',
    'assets/shaders/lrt1fshader.txt',
    'assets/shaders/lrt2vshader.txt',
    'assets/shaders/lrt2fshader.txt',
    'assets/shaders/hrtvshader.txt',
    'assets/shaders/hrtfshader.txt',
    'assets/shaders/hudvshader.txt',
    'assets/shaders/hudfshader.txt'],
    ['geovs','geofs','lrt1vs','lrt1fs','lrt2vs','lrt2fs','hrtvs','hrtfs','hudvs','hudfs'], 
    initShadersFromFiles));

  this.draw = function()
  {
    gl_context.bindFramebuffer(gl_context.FRAMEBUFFER, this.lrt1Program.frameBuffer);
    gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
    this.geoProgram.draw();

    gl_context.bindFramebuffer(gl_context.FRAMEBUFFER, this.lrt2Program.frameBuffer);
    gl_context.clear(gl_context.DEPTH_BUFFER_BIT);
    this.lrt1Program.draw();

    gl_context.bindFramebuffer(gl_context.FRAMEBUFFER, this.hrtProgram.frameBuffer);
    gl_context.clear(gl_context.DEPTH_BUFFER_BIT);
    this.lrt2Program.draw();
    
    gl_context.bindFramebuffer(gl_context.FRAMEBUFFER, null);
    gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
    this.hrtProgram.draw();

    gl_context.clear(gl_context.DEPTH_BUFFER_BIT); //JUST DEPTH!
    gl_context.enable(gl_context.BLEND);
    this.hudProgram.draw();
    gl_context.disable(gl_context.BLEND);
  };
};
