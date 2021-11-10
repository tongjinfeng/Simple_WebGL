/**
 * 该工具类主要封装一些WebGL的纹理类
 */
(function (exports) {
  /**
   * 创建一个纹理贴图
   * @param {*} context
   * @param {*} source
   * @param {*} attribute
   * @param {*} callback
   */
  exports.createTexture = function (context, source, attribute, callback) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function () {
      context.activeTexture(context.TEXTURE0);
      var texture = context.createTexture();
      context.bindTexture(context.TEXTURE_2D, texture);
      context.texParameterf(
        context.TEXTURE_2D,
        context.TEXTURE_MAG_FILTER,
        context.LINEAR
      );
      context.texParameterf(
        context.TEXTURE_2D,
        context.TEXTURE_MIN_FILTER,
        context.LINEAR
      );
      context.texImage2D(
        context.TEXTURE_2D,
        0,
        context.RGBA,
        context.RGBA,
        context.UNSIGNED_BYTE,
        image
      );
      context.uniform1i(attribute, 0);
      typeof callback === 'function' && callback();
    };
    image.src = source;
  };

  /**
   * 初始化纹理
   * @param {*} context 
   * @param {*} program 
   * @param {*} attributeCode 
   * @param {*} source 
   * @param {*} callback 
   * @returns 
   */
  exports.initTextures = function(context, program, attributeCode, source, callback) {
    var texture = context.createTexture();  
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    var attribute = context.getUniformLocation(program, attributeCode);

    if (!attribute) {
      console.log('Failed to get the storage location of attribute');
      return false;
    }
    var image = new Image();  
    image.crossOrigin = "anonymous";
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }

    image.onload = function(){ exports.loadTexture(context, texture, attribute, image, callback); };

    image.src = source;

    return true;
    }

  /**
   * 加载纹理对象
   * @param {*} context 
   * @param {*} texture 
   * @param {*} attribute 
   * @param {*} image 
   * @param {*} callback 
   */
  exports.loadTexture = function (context, texture, attribute, image, callback) {

    // 因WEBGL坐标系统和纹理坐标系统在Y轴上相反，因此需要对其进行翻转
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1); 

    context.activeTexture(context.TEXTURE0);

    context.bindTexture(context.TEXTURE_2D, texture);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);

    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
    
    context.uniform1i(attribute, 0);
    console.log(`loadTexture successfully`);

    typeof callback  === 'function' && callback();
  }

})(window["Texture"] || (window["Texture"] = {}));
