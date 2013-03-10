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

  this.geoProgram = null;
  this.lrtProgram = null;
  this.hrtProgram = null;
  this.hudProgram = null;

  var initShadersFromFiles = function(files)
  {
    if(!files) { console.log("Error loading shaders."); return; }
    
    self.geoProgram = new GeoGLProgram       (gl_context, files.geovs, files.geofs);
    self.lrtProgram = new LowResTexGLProgram (gl_context, files.lrtvs, files.lrtfs);
    self.hrtProgram = new HighResTexGLProgram(gl_context, files.hrtvs, files.hrtfs);
    self.hudProgram = new HudGLProgram       (gl_context, files.hudvs, files.hudfs);
    self.ready = true;
    glReadyCallback();
  };

  //Load the shaders
  AsyncLoader.loadBatch(new AsyncLoaderBatch(
    ['assets/shaders/geovshader.txt',
    'assets/shaders/geofshader.txt',
    'assets/shaders/lrtvshader.txt',
    'assets/shaders/lrtfshader.txt',
    'assets/shaders/hrtvshader.txt',
    'assets/shaders/hrtfshader.txt',
    'assets/shaders/hudvshader.txt',
    'assets/shaders/hudfshader.txt'],
    ['geovs','geofs','lrtvs','lrtfs','hrtvs','hrtfs','hudvs','hudfs'], 
    initShadersFromFiles));

  this.draw = function()
  {
    gl_context.bindFramebuffer(gl_context.FRAMEBUFFER, this.lrtProgram.frameBuffer);
    gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
    this.geoProgram.draw();

    gl_context.bindFramebuffer(gl_context.FRAMEBUFFER, this.hrtProgram.frameBuffer);
    gl_context.clear(gl_context.DEPTH_BUFFER_BIT);
    this.lrtProgram.draw();

    gl_context.bindFramebuffer(gl_context.FRAMEBUFFER, null);
    gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
    this.hrtProgram.draw();

    gl_context.clear(gl_context.DEPTH_BUFFER_BIT); //JUST DEPTH!
    gl_context.enable(gl_context.BLEND);
    this.hudProgram.draw();
    gl_context.disable(gl_context.BLEND);
  };
};
