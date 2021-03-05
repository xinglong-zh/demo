export const Color = function (a, b, c) {
    this.ident = a, this.steps = b, this.gradient = c, this.colors = null, this.setMinMax()
};
Color.prototype = {
    setColors: function (b) {
        this.wasModified || (this.defaultGradient = utils.clone(this.gradient)), this.wasModified = !0, this.gradient = b, this.setMinMax(), this.colors && this.forceGetColor()
    }, toDefault: function () {
        this.defaultGradient && (this.wasModified = !1, this.gradient = utils.clone(this.defaultGradient), this.setMinMax(), this.colors && this.forceGetColor())
    }, setMinMax: function () {
        this.min = this.gradient[0][0], this.max = this.gradient[this.gradient.length - 1][0]
    }, forceGetColor: function () {
        return this.colors = null, this.getColor()
    }, color: function a(b, c, d) {
        var a = this.RGBA(b);
        return "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + (c || a[3] / (d || 256)) + ")"
    },
    //取反色
    colorInvert:function(b,c,d){
        var a = this.RGBA(b);
        return "rgba(" + (255-a[0]) + "," + (255-a[1]) + "," + (255-a[2]) + "," + (c || a[3] / (d || 256)) + ")"
    },
    colorRGB: function (a) {
        var b = this.RGBA(a);
        return "rgb( " + b[0] + ", " + b[1] + ", " + b[2] + ")"
    }, colorDark: function (a, b) {
        var c = this.RGBA(a);
        return "rgba(" + (c[0] - b) + "," + (c[1] - b) + "," + (c[2] - b) + ",1)"
    }, RGBA: function (a) {
        var b = this.value2index(a);
        return [this.colors[b], this.colors[++b], this.colors[++b], this.colors[++b]]
    }, getMulArray: function (a, b) {
        var c, d = [], e = a.length;
        for (c = 0; c < e; c++)d.push(a[c] * b);
        return d
    },
    //线性插值
    lerpArray: function (a, b, c) {
        var d, e = 1 - c, f = a.length, g = [];
        for (d = 0; d < f; d++)
            g.push(a[d] * e + b[d] * c);//反距离权重
        return g
    }, rgb2yuv: function (rgba) {
        var b = [], c = .299 * rgba[0] + .587 * rgba[1] + .114 * rgba[2];
        b.push(c), //Y
            b.push(.565 * (rgba[2] - c)), //U=(B-Y)*0.565
            b.push(.713 * (rgba[0] - c)), //V=(R-Y)*0.713
            b.push(rgba.slice(3))//a of rgba
        return b;
    }, yuv2rgb: function (a) {
        var b = [a[0] + 1.403 * a[2], a[0] - .344 * a[1] - .714 * a[2], a[0] + 1.77 * a[1]];
        for (var i = 0; i < b.length; i++) {
            b[i] = Math.max(0,Math.min(1,b[i]));
        }
        return b.concat(a.slice(3))
    },
// @preserveSaturation .. (maintain |UV| size)
    gradYuv: function (fromYuv, toYuv, pos, preserveSaturation) {
        var e = this.lerpArray(fromYuv, toYuv, pos);
        if (preserveSaturation) {
            //U-V color plane |UV| size
            var f = this.vec2size(fromYuv[1], fromYuv[2]), g = this.vec2size(toYuv[1], toYuv[2]);
            if (f > .05 && g > .05) {
                var h = this.vec2size(e[1], e[2]), i = f * (1 - pos) + g * pos;
                if (h > .01) {
                    var j = i / h;
                    e[1] *= j, e[2] *= j
                }
            }
        }
        return e
    }, vec2size: function (a, b) {
        return Math.sqrt(a * a + b * b)
    }, getGradientColor: function (colorModel, fromRgba, toRgba, pos, e) {
        var f, g = 1 / 255, h = 1, i = 256;
        switch (colorModel) {
            case"YUV":
                var k = this.gradYuv(this.rgb2yuv(this.getMulArray(fromRgba, g)), this.rgb2yuv(this.getMulArray(toRgba, g)), pos, true);
                f = this.yuv2rgb(k);
                break;
            default:
                f = this.lerpArray(fromRgba, toRgba, pos), h = g, i = 1
        }
        for (var alpha = f[3] * h, m = 0; m < 4; m++) {
            var n = f[m];
            e && m < 3 && (n *= alpha),
                f[m] = Math.max(0, Math.min(n * 255 + 0.5, 255))
        }
        return f
    },
    /**
     *
     * @param colorModel 颜色模型，YUV、RGB等
     * @param graySuf {Boolean} 最后附加一个半透明灰色
     * @param alphaBlend {Boolean} 将alpha融合到RGB分量上
     * @param steps 梯度步数（停点数）
     * @param scale 放缩系数
     * @returns {Uint8Array}
     */
    createGradientArray: function (colorModel, graySuf, alphaBlend, steps, scale) {
        steps = steps || this.steps, scale = scale || 1;
        var arr = new Uint8Array(4 * (steps + (graySuf ? 1 : 0))), idx = 0;
        //步长
        var step = (this.max - this.min) / steps;
        //梯度停点
        var stops = this.gradient, stopIndex = 1, fromStop = stops[0], toStop = stops[stopIndex++];
        for (var i = 0; i < steps; i++){
            var interValue = (this.min + step * i) * scale;
            if(interValue > toStop[0] && stopIndex < stops.length)
                fromStop = toStop, toStop = stops[stopIndex++];

            var pos = (interValue - fromStop[0]) / (toStop[0] - fromStop[0]);
            var rgba = this.getGradientColor(colorModel, fromStop[1], toStop[1], pos, alphaBlend);
            for (var j = 0; j < 4; j++)
                arr[idx++] = rgba[j];
        }
        if (graySuf)
            for (this.neutralGrayIndex = idx, j = 0; j < 4; j++)
                arr[idx++] = 130;
        return arr
    }, getColor: function () {
        return this.colors ? this : (
            this.colors = this.createGradientArray("YUV", false, true),
            this.startingValue = this.min,
            this.step = (this.max - this.startingValue) / this.steps,
            this.value2index = function (a) {
            return isNaN(a) ? this.neutralGrayIndex : Math.max(0, Math.min(4 * (this.steps - 1), (a - this.startingValue) / this.step << 2))
        }, this)
    }
}