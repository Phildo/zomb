var TileGLGeo = function (verts, colors, normals, indexes)
{
  var that = new XGLGeo(verts, colors, normals, indexes);
  that.originalVerts = verts.slice(0);

  that.bgPixelWidth = 0.03125;
  that.bgPixelHeight = 0.0625;
  that.pixelWidth = 0.0078125;
  that.pixelHeight = 0.015625;
  that.tileWidth = 0.0390625;
  that.tileHeight = 0.078125;
  that.textTileWidth = 0.046875;

  that.position = function(x,y)
  {
    that.verts[0] = that.originalVerts[0]+x;
    that.verts[1] = that.originalVerts[1]+y;
    that.verts[2] = that.originalVerts[2]+x;
    that.verts[3] = that.originalVerts[3]+y;
    that.verts[4] = that.originalVerts[4]+x;
    that.verts[5] = that.originalVerts[5]+y;
    that.verts[6] = that.originalVerts[6]+x;
    that.verts[7] = that.originalVerts[7]+y;
  };

  that.move = function(x,y)
  {
    that.verts[0] = that.verts[0]+x;
    that.verts[1] = that.verts[1]+y;
    that.verts[2] = that.verts[2]+x;
    that.verts[3] = that.verts[3]+y;
    that.verts[4] = that.verts[4]+x;
    that.verts[5] = that.verts[5]+y;
    that.verts[6] = that.verts[6]+x;
    that.verts[7] = that.verts[7]+y;
  };

  that.icons = {};
  that.icons['alphanum'] = {
    '0':0,
    '1':1,
    '2':2,
    '3':3,
    '4':4,
    '5':5,
    '6':6,
    '7':7,
    '8':8,
    '9':9,
    'a':10,
    'b':11,
    'c':12,
    'd':13,
    'e':14,
    'f':15,
    'g':16,
    'h':17,
    'i':18,
    'j':19,
    'k':20,
    'l':21,
    'm':22,
    'n':23,
    'o':24,
    'p':25,
    'q':26,
    'r':27,
    's':28,
    't':29,
    'u':30,
    'v':31,
    'w':32,
    'x':33,
    'y':34,
    'z':35
    };
  that.icons['icon'] = {
    'heart':50,
    'skull':51,
    'fire':52,
    'rain':53,
    'lightning':54
    };
  that.icons['ui'] = {
    'tlc':100,
    'tl':101,
    'trc':102,
    'll':103,
    'rl':104,
    'blc':105,
    'bl':106,
    'brc':107,
    'btlc':108,
    'btl':109,
    'btrc':110,
    'bll':111,
    'brl':112,
    'bblc':113,
    'bbl':114,
    'bbrc':115
    };

  return that;
}
