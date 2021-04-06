/**
 * Created by xml on 2017/1/13.
 */
import * as L from 'leaflet'

L.TextMarker = L.Path.extend({

    options: {
        fill: true,
        fillOpacity:1,
        stroke: false,
        offset: [0,0],
        rotate:0,
        bounds:[[-10,0],[0,20]],
        background: false,//{color:'red',bounds:[[]]}
        avoidOverlap: false,
        detectOverlap: function(layer){
            var drawnLayers = layer._renderer._drawnLayers;
            for(var key in drawnLayers){
                drawnLayer = drawnLayers[key];
                if(drawnLayer._pxBounds.intersects(layer._pxBounds))
                    return true;
            }
        },
        drawn: function(layer){
            var drawnLayers = layer._renderer._drawnLayers;
            drawnLayers[layer._leaflet_id] = layer;
        }
    },

    initialize: function (latlng, options) {
        L.setOptions(this, options);
        this._latlng = L.latLng(latlng);
        this._text = this.options.text;
        this._offset = L.point(this.options.offset);
        this._bounds = L.bounds(this.options.bounds);
    },

    // @method setLatLng(latLng: LatLng): this
    // Sets the position of a text marker to a new location.
    setLatLng: function (latlng) {
        this._latlng = L.latLng(latlng);
        this.redraw();
        return this.fire('move', {latlng: this._latlng});
    },

    // @method getLatLng(): LatLng
    // Returns the current geographical position of the text marker
    getLatLng: function () {
        return this._latlng;
    },

    // @method setText(text: String): this
    // Sets the text.
    setText: function (text) {
        this.options.text = this._text = text;
        return this.redraw();
    },

    // @method getText(): Number
    // Returns the current text
    getText: function () {
        return this._text;
    },

    setStyle : function (options) {
        var text = options && options.text || this._text;
        L.Path.prototype.setStyle.call(this, options);
        this.setText(text);
        return this;
    },

    _project: function () {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._point._add(this._offset);
        this._updateBounds();
    },

    _updateBounds: function () {
        var w = this._clickTolerance(),
            p = [w,w]
        this._pxBounds = new L.Bounds(this._point.add(this._bounds.min).subtract(p), this._point.add(this._bounds.max).add(p));
    },

   _update: function () {
        if (this._map) {
            this._updatePath();
        }
    },

    _updatePath: function () {

        if (!this._renderer._drawing || this._empty()) { return; }
        var p = this._point,
            text = this._text,
            options = this.options,
            ctx = this._renderer._ctx;

        ctx.font=options.font;
        ctx.textAlign=options.textAlign;
        ctx.textBaseline=options.textBaseline;
        ctx.save();
        ctx.translate(p.x,p.y);
        if(options.rotate){
            ctx.rotate(options.rotate);
        }
        if(options.background){
            var bg = options.background;
            ctx.globalAlpha = bg.opacity;
            ctx.fillStyle = bg.color;
            switch (bg.shape){
                case "rect":
                    var bgBounds = L.bounds(bg.bounds||options.bounds);
                    var topLeft = bgBounds.getTopLeft();
                    var size = bgBounds.getSize();
                    ctx.fillRect(topLeft.x,topLeft.y,size.x,size.y);
                    break;
                case "roundRect":
                    var bgBounds = L.bounds(bg.bounds||options.bounds);
                    var topLeft = bgBounds.getTopLeft();
                    var size = bgBounds.getSize();
                    ctx.roundRect(topLeft.x,topLeft.y,size.x,size.y,bg.radius||4);
                    ctx.fill();
                    break;
                case "circle":
                default:
                    ctx.beginPath();
                    ctx.arc(0,0,bg.radius||15,0,Math.PI*2);
                    ctx.closePath();
                    ctx.fill();
            }
        }

        if (options.stroke && options.weight !== 0) {
            if (ctx.setLineDash) {
                ctx.setLineDash(this.options._dashArray || []);
            }
            ctx.globalAlpha = options.opacity;

            ctx.lineWidth = options.weight;
            ctx.strokeStyle = options.color;
            var tune=this.options.tune||[0,0];
            ctx.strokeText(text,tune[0],tune[1])
        }

        if (options.fill!==false) {
            ctx.globalAlpha = options.fillOpacity;
            ctx.fillStyle = options.fillColor || options.color;
            var tune=this.options.tune||[0,0];
            ctx.fillText(text,tune[0],tune[1])
        }
        ctx.restore();

        if(options.avoidOverlap)
            options.drawn(this);
    },

    _empty: function () {
        return !this._renderer._bounds.intersects(this._pxBounds)||
            this.options.avoidOverlap&&this.options.detectOverlap(this)
        ;
    },

    _containsPoint:function (p) {
        return p.distanceTo(this._point) <= this._clickTolerance();
    }
});


// @factory L.textMarker(latlng: LatLng, options? TextMarker options)
//
L.textMarker = function (latlng, options) {
    return new L.TextMarker(latlng, options);
};
L.Canvas.include({
    _removePath: function (layer) {
        var order = layer._order;
        var next = order.next;
        var prev = order.prev;

        if (next) {
            next.prev = prev;
        } else {
            this._drawLast = prev;
        }
        if (prev) {
            prev.next = next;
        } else {
            this._drawFirst = next;
        }

        delete layer._order;

        delete this._layers[L.stamp(layer)];
        
        if(this._drawnLayers) //Leaflet1.2 有此属性
            delete this._drawnLayers[L.stamp(layer)];

        this._requestRedraw(layer);
    }
});
//http://www.zhangxinxu.com/study/201406/image-border-radius-canvas.html
/**
 *
 * @param x left
 * @param y top
 * @param w width
 * @param h height
 * @param r round corner radius
 * @returns {CanvasRenderingContext2D}
 */
CanvasRenderingContext2D.prototype.roundRect=function (x, y, w, h, r) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}
