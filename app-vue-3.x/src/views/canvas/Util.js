// Vertex shader program

export const vsSource = `
// 一个属性变量，将会从缓冲中获取数据

attribute vec2 a_position;
uniform  vec2 u_resolution;  // 全局变量

attribute vec2 a_texCoord; // 纹理使用
varying vec2 v_texCoord; // 纹理坐标

// 所有着色器都有一个main方法
void main() {

  // gl_Position 是一个顶点着色器主要设置的变量
  // gl_Position = a_position;  diff
  // 从像素坐标转换到 0.0 到 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // 再把 0->1 转换 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // 把 0->2 转换到 -1->+1 (裁剪空间)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace, 0, 1);

  v_texCoord = a_texCoord;

}
`;

export const fsSource = `
// 片断着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;
// 纹理
uniform sampler2D u_image;

// 从顶点着色器传入的纹理坐标
varying vec2 v_texCoord;


void main() {
  // gl_FragColor是一个片断着色器主要设置的变量
  // gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“瑞迪施紫色”/
  gl_FragColor = texture2D(u_image,v_texCoord);

}
  `;


/**
 * 创建着色器的方法 , 上下文 , 类型(顶点 ,片段) 数据源
 * @param {WebGLRenderingContextBase} gl 
 * @param {number} type 
 * @param {string} source 
 * @returns {*} shader
 */
export function createShader(gl,type,source){
  var shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
    
}

/**
 * 两个着色器链接为一个程序
 * @param {WebGLRenderingContextBase} gl 
 * @param {WebGLShader} vertexShader 
 * @param {WebGLShader} fragmentShader 
 * @returns {WebGLProgram} program
 */
export function createProgram(gl,vertexShader,fragmentShader){
    let program = gl.createProgram();
    gl.attachShader(program,vertexShader); // 顶点着色器
    gl.attachShader(program,fragmentShader); // 片段着色器
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program,gl.LINK_STATUS);
    if(success){
        return program;
    }

    // 失败情况
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);

}

/**
 * 重置canvas 的大小 ,使  画布尺寸 == css 尺寸 
 * @param {HTMLCanvasElement} canvas 
 */
export function resizeCanvas(canvas){
  var realToCSSPixels = window.devicePixelRatio;

  // 获取浏览器显示的画布的CSS像素值
  // 然后计算出设备像素设置drawingbuffer
  var displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
  var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

  // 检查画布尺寸是否相同
  if (canvas.width  !== displayWidth ||
      canvas.height !== displayHeight) {

    // 设置为相同的尺寸
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

//  demo代码  , 暂时不使用

    /**
     * @param {WebGLRenderingContextBase} gl;
     */
    function main(gl,image) {
      console.log(gl);
      let vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      let fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      let program = createProgram(gl, vs, fs);

      let positionAttributeLocation = gl.getAttribLocation(
        program,
        "a_position"
      ); // 初始化的时候完成 寻找属性位置(全局位置)
      let resolutionUniformLocation = gl.getUniformLocation(
        program,
        "u_resolution"
      );

      // 寻找纹理坐标
      let texCoordLocation = gl.getAttribLocation(program,'a_texCoord');

      // 创建纹理的缓冲
      let texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([ 0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]),gl.STATIC_DRAW);

      gl.enableVertexAttribArray(texCoordLocation);
      gl.vertexAttribPointer(texCoordLocation,2,gl.FLOAT,false,0,0);

      
      //创建纹理 , 
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,texture);

      // 设置参数 , 
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);

      // 将图像上传至纹理  image 
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


      // 创建一个缓冲
      let positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // 通过绑定点 向缓冲写入数据
      let positions = [
        10, 20, 
        80, 20, 
        10, 30, 
        10, 30, 
        80, 20, 
        80, 30
        ];
      // bufferData  复制数据 positions  ==> GPU 的 array_buffer ===> 绑定到 positionBuffer  ,gl.STATIC_DRAW提示WebGL我们不会经常改变这些数据 . 方便编译器优化
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
      );

      resizeCanvas(gl.canvas); // 重置canvas 大小
      //  -1 -> +1 分别对应到x轴的 0 -> gl.canvas.width 和y轴的 0 -> gl.canvas.height
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program); // 使用着色器程序

      

      // 获取数据
      gl.enableVertexAttribArray(positionAttributeLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      let size = 2; // 每次迭代运行读取两个单位数据
      let type = gl.FLOAT; // 数据类型 32浮点
      let mormalize = false; // 不需要归一化
      let stride = 0; // 0= 移动单位数量* 每单位占用内存(sizeof(type))  // 每次迭代运动 , 运动多少到下一个数据开始点
      let offset = 0; // 读取缓冲偏移

      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        mormalize,
        stride,
        offset
      );
      // 设置全局变量
      gl.uniform2f(resolutionUniformLocation,gl.canvas.width,gl.canvas.height); // 分辨率投射到 -1 1 使用的全局变量.

      // vec4是一个有四个浮点数据的数据类型。
      // 在JavaScript中你可以把它想象成 a_position = {x: 0, y: 0, z: 0, w: 0}。之前我们设置的size = 2，
      //  属性默认值是0, 0, 0, 1，然后属性将会从缓冲中获取前两个值（ x 和 y ）。 z和w还是默认值 0 和 1 。

      // 运行着色器程序
      let primitiveType = gl.TRIANGLES; // 绘制三角形
      offset = 0;
      // let count = 3; //所以顶点着色器将运行三次
      let count = 6; //  绘制正方形 , 需要绘制两个三角形 , 六个顶点 .
      gl.drawArrays(primitiveType, offset, count);
      // 第一次运行将会从位置缓冲中读取前两个值赋给属性值a_position.x和a_position.y。
      //  第二次运行a_position.xy将会被赋予后两个值，
      // 最后一次运行将被赋予最后两个值   positions [-1,1] // 裁剪空间 , 映射到cavas 屏幕空间
    }