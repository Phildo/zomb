var AssetMan = function(assetsReadyCallback)
{
  var self = this;
  
  this.ready      = false;
  geoready        = false;
  texturesready   = false;
  
  this.light1     = null;
  this.light2     = null;
  this.light3     = null;
  
  this.leftarm   = null;
  this.rightarm  = null;
  this.street     = null;
  this.lightbox1  = null;
  this.lightbox2  = null;
  this.clipscreen = null;
  this.fps10      = null;
  this.fps1       = null;
  this.tilef      = null;
  this.tilep      = null;
  this.tiles      = null;
  this.tileh1     = null;
  this.tileh2     = null;
  this.tileh3     = null;
  this.tileskull  = null;
  this.tilesc10   = null;
  this.tilesc1    = null;
  
  this.tileTex    = null;

  var initGeoFromFiles = function(files)
  {
    if(!files) { console.log('Error loading Geometry.'); return; }
      
    self.light1 = new XGLLight([0,0,0]);
    self.light2 = new XGLLight([0,0,0]);
    self.light3 = new XGLLight([5,2,0]);
    
    var leftArmData = JSON.parse(files.left_arm);
    self.leftarm = new XGLGeo(leftArmData.verts, leftArmData.colors, leftArmData.normals, leftArmData.indexes);
  
    var rightArmData = JSON.parse(files.right_arm);
    self.rightarm = new XGLGeo(rightArmData.verts, rightArmData.colors, rightArmData.normals, rightArmData.indexes);
    
    var streetData = JSON.parse(files.street);
    self.street = new XGLGeo(streetData.verts, streetData.colors, streetData.normals, streetData.indexes);
  
    var lightboxData = JSON.parse(files.lightbox);
    self.lightbox1 = new XGLGeo(lightboxData.verts, lightboxData.colors, lightboxData.normals, lightboxData.indexes);
  
    lightboxData = JSON.parse(files.lightbox);
    self.lightbox2 = new XGLGeo(lightboxData.verts, lightboxData.colors, lightboxData.normals, lightboxData.indexes);
  
    var lrClipscreenData = JSON.parse(files.clipscreen);
    self.clipscreen = new XGLGeo(lrClipscreenData.verts, lrClipscreenData.colors, lrClipscreenData.normals, lrClipscreenData.indexes);
  
    var hrClipscreenData = JSON.parse(files.clipscreen);
    self.clipscreen = new XGLGeo(hrClipscreenData.verts, hrClipscreenData.colors, hrClipscreenData.normals, hrClipscreenData.indexes);
  
    var tileData = JSON.parse(files.tile);
    self.fps10 = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.fps10.tileIndex = 0;
    self.fps10.position(-1.0+self.fps10.bgPixelWidth,-1.0+(self.fps10.tileHeight+self.fps10.bgPixelHeight));
    
    tileData = JSON.parse(files.tile);
    self.fps1 = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.fps1.tileIndex = 0;
    self.fps1.position(-1.0+self.fps1.bgPixelWidth+self.fps1.textTileWidth,-1.0+(self.fps1.tileHeight+self.fps1.bgPixelHeight));

    tileData = JSON.parse(files.tile);
    self.tilef = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tilef.tileIndex = self.tilef.icons['alphanum']['f'];
    self.tilef.position(-1.0+self.tilef.bgPixelWidth+(2*self.tilef.textTileWidth),-1.0+(self.tilef.tileHeight+self.tilef.bgPixelHeight));
    
    tileData = JSON.parse(files.tile);
    self.tilep = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tilep.tileIndex = self.tilep.icons['alphanum']['p'];
    self.tilep.position(-1.0+self.tilep.bgPixelWidth+(3*self.tilep.textTileWidth),-1.0+(self.tilep.tileHeight+self.tilep.bgPixelHeight));
    
    tileData = JSON.parse(files.tile);
    self.tiles = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tiles.tileIndex = self.tiles.icons['alphanum']['s'];
    self.tiles.position(-1.0+self.tiles.bgPixelWidth+(4*self.tiles.textTileWidth),-1.0+(self.tiles.tileHeight+self.tiles.bgPixelHeight));
    
    tileData = JSON.parse(files.tile);
    self.tileh1 = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tileh1.tileIndex = self.tileh1.icons['icon']['heart'];
    self.tileh1.position(1.0-self.tileh1.bgPixelWidth-self.tileh1.tileWidth,-1+self.tileh1.bgPixelHeight+self.tileh1.tileHeight);
    
    tileData = JSON.parse(files.tile);
    self.tileh2 = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tileh2.tileIndex = self.tileh2.icons['icon']['heart'];
    self.tileh2.position(1.0-self.tileh2.bgPixelWidth-self.tileh2.tileWidth-self.tileh2.textTileWidth,-1+self.tileh2.bgPixelHeight+self.tileh2.tileHeight);
    
    tileData = JSON.parse(files.tile);
    self.tileh3 = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tileh3.tileIndex = self.tileh3.icons['icon']['heart'];
    self.tileh3.position(1.0-self.tileh3.bgPixelWidth-self.tileh3.tileWidth-(2*self.tileh3.textTileWidth),-1+self.tileh3.bgPixelHeight+self.tileh3.tileHeight);

    tileData = JSON.parse(files.tile);
    self.tileskull = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tileskull.tileIndex = self.tileskull.icons['icon']['skull'];
    self.tileskull.position(1.0-self.tileskull.bgPixelWidth-self.tileskull.tileWidth-(2*self.tileskull.textTileWidth),-1+self.tileskull.bgPixelHeight+(2*self.tileskull.tileHeight)+self.tileskull.pixelHeight);
    
    tileData = JSON.parse(files.tile);
    self.tilesc10 = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tilesc10.tileIndex = 0;
    self.tilesc10.position(1.0-self.tilesc10.bgPixelWidth-self.tilesc10.tileWidth-self.tilesc10.textTileWidth,-1+self.tilesc10.bgPixelHeight+(2*self.tilesc10.tileHeight)+self.tilesc10.pixelHeight);
    
    tileData = JSON.parse(files.tile);
    self.tilesc1 = TileGLGeo(tileData.verts, tileData.colors, tileData.normals, tileData.indexes);
    self.tilesc1.tileIndex = 0;
    self.tilesc1.position(1.0-self.tilesc1.bgPixelWidth-self.tilesc1.tileWidth,-1+self.tilesc1.bgPixelHeight+(2*self.tilesc1.tileHeight)+self.tilesc1.pixelHeight);
  
    geoready = true;
    if(texturesready) { self.ready = true; assetsReadyCallback(); }
  };

  AsyncLoader.loadBatch(new AsyncLoaderBatch(
    ['assets/geometry/left_arm.json',
    'assets/geometry/right_arm.json',
    'assets/geometry/street.json',
    'assets/geometry/lightbox.json',
    'assets/geometry/clipscreen.json',
    'assets/geometry/tile.json'],
    ['left_arm','right_arm','street','lightbox','clipscreen','tile'], 
    initGeoFromFiles));
    
  function initTexture()
  {
    texturesready = true;
    if(geoready) { self.ready = true; assetsReadyCallback(); }
  }
  
  this.tileTex = new Image();
  this.tileTex.onload = initTexture;
  this.tileTex.src = "assets/images/tiles.png";

  this.commitAssetsToGL = function(glm)
  {
    glm.geoProgram.addLight(this.light1);
    glm.geoProgram.addLight(this.light2);
    glm.geoProgram.addLight(this.light3);
    
    glm.geoProgram.addGeo(this.leftarm);
    glm.geoProgram.addGeo(this.rightarm);
    glm.geoProgram.addGeo(this.street);
    glm.geoProgram.addGeo(this.lightbox1);
    glm.geoProgram.addGeo(this.lightbox2);
    glm.lrtProgram.addGeo(this.clipscreen);
    glm.hrtProgram.addGeo(this.clipscreen);
    glm.hudProgram.addGeo(this.fps10);
    glm.hudProgram.addGeo(this.fps1);
    glm.hudProgram.addGeo(this.tilef);
    glm.hudProgram.addGeo(this.tilep);
    glm.hudProgram.addGeo(this.tiles);
    glm.hudProgram.addGeo(this.tileh1);
    glm.hudProgram.addGeo(this.tileh2);
    glm.hudProgram.addGeo(this.tileh3);
    glm.hudProgram.addGeo(this.tileskull);
    glm.hudProgram.addGeo(this.tilesc10);
    glm.hudProgram.addGeo(this.tilesc1);
    
    glm.hudProgram.initTexture(this.tileTex);
  
    glm.geoProgram.compileStaticData();
    glm.lrtProgram.compileStaticData();
    glm.hrtProgram.compileStaticData();
    glm.hudProgram.compileStaticData();
  };
};
