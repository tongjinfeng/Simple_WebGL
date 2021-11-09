(function (exports) {
  /**
   *
   * @param {*} image
   * @returns
   */
  exports.getDataURL = function (image) {
    if (/^data:/i.test(image.src)) {
      return image.src;
    }

    if (typeof HTMLCanvasElement == "undefined") {
      return image.src;
    }

    var canvas;

    if (image instanceof HTMLCanvasElement) {
      canvas = image;
    } else {
       var  _canvas = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "canvas"
        );
        _canvas.width = image.width;
        _canvas.height = image.height;

        var context = _canvas.getContext("2d");

        if (image instanceof ImageData) {
          context.putImageData(image, 0, 0);
        } else {
          context.drawImage(image, 0, 0, image.width, image.height);
        }
        canvas = _canvas;
    }

    if (canvas.width > 2048 || canvas.height > 2048) {
      return canvas.toDataURL("image/jpeg", 0.6);
    } else {
      return canvas.toDataURL("image/png");
    }
  };

  /**
   * 按照输入的文字和样式生成文字的图片纹理
   * @param {*} message 
   * @param {*} parameters 
   * fontStyle: {
        color: "#BC2121",
        fontSize: 40,
        fontFace: "Helvetica, MicrosoftYaHei ",
        bold: false,
     }
  */
  exports.createTextImage = function(message, parameters, callback) {

    if (parameters === undefined) parameters = {};

    var fontFace = parameters.hasOwnProperty("fontFace")
      ? parameters["fontFace"]
      : "Arial";

    var fontSize = parameters.hasOwnProperty("fontSize")
      ? parameters["fontSize"]
      : 16;

    var borderThickness = parameters.hasOwnProperty("borderThickness")
      ? parameters["borderThickness"]
      : 2;

    var borderColor = parameters.hasOwnProperty("borderColor")
      ? parameters["borderColor"]
      : {
          r: 0,
          g: 0,
          b: 0,
          a: 1.0,
        };

    var backgroundColor = parameters.hasOwnProperty("backgroundColor")
      ? parameters["backgroundColor"]
      : {
          r: 255,
          g: 255,
          b: 255,
          a: 1.0,
        };

    var fontColor = parameters.hasOwnProperty("color")
      ? parameters["color"]
      : "#000000";

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    var bold = parameters.bold ? "Bold " : " ";

    context.font = bold + fontSize + "px " + fontFace;

    var metrics = context.measureText(message);

    var textWidth = metrics.width + borderThickness * 2;

    canvas.width = textWidth;

    context.font = bold + fontSize + "px " + fontFace;

    context.fillStyle = fontColor;

    context.fillText(message, borderThickness, fontSize + borderThickness);

    var img = new Image();
    img.onload = function() {
      callback && callback();
    }
    img.src = exports.getDataURL(canvas);

    return img;
  };
})(window["ImageUtils"] || (window["ImageUtils"] = {}));
