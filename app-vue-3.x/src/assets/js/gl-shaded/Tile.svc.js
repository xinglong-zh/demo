//基于tile的前端服务：格点填色、等值线追踪等
export var worker = function (exports) {
    var root = this||window;
    var cache = new LruCache(50);

    var emitted = null,toEmit = null;
    function emit(){
        var tile = toEmit.tile;
        var callback = toEmit.callback;
        emitted = toEmit;
        toEmit = null;
        tile.getAbv(callback);
    }
    /**
     * @todo  回调地域 , 改为promise 实现
     * @param {*} ev 
     */
    exports.onmessage = function (ev) {
        var data = ev.data;
        var tile = new Tile(data.latLngBounds, data.zoom, data.tileSize, data.validBounds, data.url, data.typedArrayName);
        var callback = function (abv) {
            emitted = null;
            if(toEmit) emit();
            exports.postMessage({
                input: data,
                result: abv
            });
        };
        toEmit = {tile:tile,callback:callback};
        if(!emitted) emit();
        else console.log("数据下载延时，跳过一帧",new Date());
    }

    /**
     *
     * @param latLngBounds {LatLngBounds}
     * @param zoom {Integer}
     * @param tileSize {Integer}
     * @param validBounds {Bounds}
     * @param url,和TileLayer的url参数格式一样，eg：http://10.1.64.146/nwfddata/nwfd/fsol/ttt_05_1h/2018062108.024/{z}/{x}/{y}.bin
     */
    var Tile = function (latLngBounds, zoom, tileSize, validBounds, url, typedArrayName) {
        this.view = LatLngBounds.fromJSON(latLngBounds);
        this.zoom = zoom;
        this.tileSize = tileSize;
        //切图的左下角
        this.origin = toLatLng(-90, -180);
        //非全球数据，zoom对应的瓦片有效范围
        this.validBounds = Bounds.fromJSON(validBounds);
        this.url = url;
        this.typedArrayName = typedArrayName;

        this.tileRowInvalid = new root[typedArrayName](tileSize);
        var invalid = Tile.invalid[typedArrayName];
        for (var i = 0; i < tileSize; i++) {
            this.tileRowInvalid[i] = invalid;
        }
        this.catalog();
    }
//以最大值作为缺测值,瓦片是大端字节序
    Tile.invalid = {
        Int8Array: 127,
        Uint8Array: 255,
        Uint8ClampedArray: 255,
        Int16Array: (function (value) {
            var buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, value);//大端
            return new Int16Array(buffer)[0];
        })(32767),
        Uint16Array: (function (value) {
            var buffer = new ArrayBuffer(2);
            new DataView(buffer).setUint16(0, value);
            return new Uint16Array(buffer)[0]
        })(65535),
        Int32Array: (function (value) {
            var buffer = new ArrayBuffer(4);
            new DataView(buffer).setInt32(0, value);
            return new Int32Array(buffer)[0]
        })(2147483647),
        Uint32Array: (function (value) {
            var buffer = new ArrayBuffer(4);
            new DataView(buffer).setUint32(0, value);
            return new Uint32Array(buffer)[0]
        })(4294967295)
    }

    Tile.prototype = {
        //get ArrayBufferView for texture
        getAbv: function (resolve) {
            var self = this;
            var bounds = this.bounds;
            var size = bounds.getSize().add([1, 1]);
            var srcSize = size.multiplyBy(this.tileSize);
            //texture的大小必须是256的倍数，（似乎是这样的？）
            var texSize = srcSize.divideBy(256).ceil().multiplyBy(256);
            var scale = srcSize.unscaleBy(texSize);//有效范围
            var abv = new root[this.typedArrayName](texSize.x * texSize.y);
            var allInvalid = true;
            var count = size.x * size.y;
            for (var y = bounds.min.y; y <= bounds.max.y; y++) {
                for (var x = bounds.min.x; x <= bounds.max.x; x++) {
                    var tileKey = new TileKey(this.zoom, x, y);
                    this.promiseGetTile(tileKey, this.validBounds, function (tile) {
                        var tileKey = tile.tileKey;
                        var offset = toPoint(tileKey.x, tileKey.y).subtract(bounds.min).multiplyBy(self.tileSize);
                        if (tile.bin) {
                            allInvalid = false;
                            var tileAbv = new root[self.typedArrayName](tile.bin);
                            for (var row = 0; row < self.tileSize; row++) {
                                abv.set(
                                    tileAbv.subarray(row * self.tileSize, row * self.tileSize + self.tileSize),
                                    (offset.y + row) * texSize.x + offset.x
                                );
                            }
                        } else {
                            for (var row = 0; row < self.tileSize; row++) {
                                abv.set(
                                    self.tileRowInvalid,
                                    (offset.y + row) * texSize.x + offset.x
                                );
                            }
                        }
                        count--;
                        if (count == 0) {
                            resolve({
                                abv: abv,
                                size: texSize,
                                scale: scale,
                                latLngBounds: self.latLngBounds,
                                res: 360 / (2<<self.zoom) / self.tileSize,
                                allInvalid: allInvalid
                            })
                        }
                    });
                }
            }
        },
        /**
         * 计算出视窗内瓦片编号范围及经纬度范围
         */
        catalog: function () {
            //zoom级别全球地图瓦片的列数
            var colCnt = 2<<this.zoom;
            //瓦片的跨度 degree
            var span = 360 / colCnt;

            var bounds = toBounds(
                LatLng.div(this.view.getSouthWest().offset(this.origin), span).floor(),
                LatLng.div(this.view.getNorthEast().offset(this.origin), span).floor()
            )
            //减去一格
            var less1 = (this.tileSize - 1) / this.tileSize;
            var shift = toLatLng(90, 180);
            var latLngBounds = toLatLngBounds(
                Point.mul(bounds.min, span).offset(shift),
                Point.mul(bounds.max.add([less1, less1]), span).offset(shift)
            )

            this.bounds = bounds;
            this.latLngBounds = latLngBounds;
        },
        /**
         * 获取一个瓦片
         * @param tileKey 瓦片编号
         * @param validBounds 瓦片有效编号范围，tileKey超出validBounds的直接返回404，不必向服务器发出无意义的请求
         * @param resolve 回调函数
         */
        promiseGetTile: function (tileKey, validBounds, resolve) {
            var tmsTileKey = tileKey.wrap();
            if (validBounds && !(validBounds.contains(toPoint(tmsTileKey.x, tmsTileKey.y)) || validBounds.contains(toPoint(tmsTileKey._360.x, tmsTileKey._360.y)))) {
                resolve({tileKey: tileKey, status: 404});
                return;
            }
            var url = this.getTileUrl(tmsTileKey);
            var buf = cache.get(url);
            if (buf) {
                resolve({bin: buf, tileKey: tileKey});
                return;
            }
            if(url.indexOf('*')==-1)
                this._promiseGetTile(url,tileKey,resolve);
            else{//风uv分量
                this._promiseGetUVTile(url,tileKey,resolve);
            }
        },
        /**
         * 获取包含u、v分量的瓦片
         * 拆分为u、v两个请求，然后合并请求结果
         * @param url 瓦片资源标识，eg：a/u*v/1/0/1.bin
         * @param tileKey 瓦片编号，传递给回调函数，以便拼接时计算瓦片的相对位置
         * @param resolve 回调函数
         * @private
         */
        _promiseGetUVTile:function(url,tileKey,resolve){
            var self = this;
            // 将"a/b*c/d" 变为 ["a/b/d","a/c/d"]
            var u=[],v=[];
            var uv = url.split('/');
            for (var i = 0; i < uv.length; i++) {
                if(uv[i].indexOf('*')!=-1){
                    var u_v=uv[i].split('*');
                    u.push(u_v[0]);
                    v.push(u_v[1]);
                }else{
                    u.push(uv[i]);
                    v.push(uv[i]);
                }
            }
            var uUrl = u.join('/'),vUrl=v.join('/');

            var count=2,uTile,vTile;
            var uvResolve = function () {
                count--;
                if(count==0){
                    if(!uTile.bin||!vTile.bin){//缺任一分量
                        resolve({tileKey:tileKey,status:uTile.status+';'+vTile.status});
                    }else{
                        var arrLen = self.tileSize * self.tileSize;
                        var dv = new Int16Array(arrLen*2);
                        var udv = new Int16Array(uTile.bin),vdv=new Int16Array(vTile.bin)
                        for (var i = 0; i < arrLen; i++) {
                            dv[2*i] = udv[i];
                            dv[2*i+1] = vdv[i];
                        }
                        var buf = dv.buffer;
                        cache.put(url, buf);
                        resolve({bin: buf, tileKey: tileKey});
                    }
                }
            }
            this._promiseGetTile(uUrl,tileKey,function (tile) {
                uTile = tile;
                uvResolve();
            });
            this._promiseGetTile(vUrl,tileKey,function (tile) {
                vTile = tile;
                uvResolve();
            });
        },
        /**
         * 获取一个瓦片
         * @param url 瓦片资源的位置
         * @param tileKey 瓦片编号，传递给回调函数，以便拼接时计算瓦片的相对位置
         * @param resolve 回调函数
         * @private
         */
        _promiseGetTile:function(url,tileKey,resolve){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function () {
                if (this.status == 200) {
                    var buf = this.response;
                    cache.put(url, buf);
                    resolve({bin: buf, tileKey: tileKey});
                } else if (this.status >= 400) {
                    resolve({tileKey: tileKey, status: this.status});
                }
            }
            xhr.onerror = function () {
                console.error('network error!');
                resolve({tileKey: tileKey, status: this.status});
            }
            try {
                xhr.send();
            } catch (e) {
                console.error(e);
                resolve({tileKey: tileKey, status: xhr.status});
            }
        },
        getTileUrl: function (tileKey) {
            return template(this.url, tileKey);
        },
//canvas-------
        /**
         *  拼接瓦块，并按调色板生成ImageData，不考虑retina屏
         * @param uniforms {epsg,ppd,bounds,plt}
         * @param resolve
         */
        createImageData: function (uniforms, resolve) {
            var self = this;
            this._getAbv(function (data) {//{abv,size,latLngBounds,res,allInvalid}
                if(data.allInvalid){
                    return resolve(data);
                }
                self.data = data;
                self.uniforms = uniforms;
                var bounds = uniforms.bounds = Bounds.fromJSON(uniforms.bounds);//xOyBounds
                var size = bounds.getSize().add([1,1]);
                var imageData = new ImageData(size.x,size.y);
                data.imageData = imageData;

                //遍历bounds内的每一点：
                for(var y=bounds.min.y,row=size.y-1;y<=bounds.max.y;y++,row--){
                    for(var x = bounds.min.x,col=0;x<=bounds.max.x;x++,col++){
                        // 1、逆投影得到经纬度，
                        var latLng = self.pointToLatLng(new Point(x,y))
                        // 2、从abv中取值（插值），
                        var val = self.getVal(latLng);
                        // 3、从plt取色填充到imageData中
                        var index = 4 * ( row*size.x + col );
                        imageData.data.set(self.value2color(val,uniforms.plt),index);
                    }
                }
                resolve(data);
            });
        },
        _getAbv: function (resolve) {
            var self = this;
            var bounds = this.bounds;
            var size = bounds.getSize().add([1, 1]);
            var texSize = size.multiplyBy(this.tileSize);

            var abv = new root[this.typedArrayName](texSize.x * texSize.y);
            var allInvalid = true;
            var count = size.x * size.y;
            for (var y = bounds.min.y; y <= bounds.max.y; y++) {
                for (var x = bounds.min.x; x <= bounds.max.x; x++) {
                    var tileKey = new TileKey(this.zoom, x, y);
                    this.promiseGetTile(tileKey, this.validBounds, function (tile) {
                        var tileKey = tile.tileKey;
                        var offset = toPoint(tileKey.x, tileKey.y).subtract(bounds.min).multiplyBy(self.tileSize);
                        if (tile.bin) {
                            allInvalid = false;
                            var tileAbv = new root[self.typedArrayName](tile.bin);
                            for (var row = 0; row < self.tileSize; row++) {
                                abv.set(
                                    tileAbv.subarray(row * self.tileSize, row * self.tileSize + self.tileSize),
                                    (offset.y + row) * texSize.x + offset.x
                                );
                            }
                        } else {
                            for (var row = 0; row < self.tileSize; row++) {
                                abv.set(
                                    self.tileRowInvalid,
                                    (offset.y + row) * texSize.x + offset.x
                                );
                            }
                        }
                        count--;
                        if (count == 0) {
                            resolve({
                                abv: abv,
                                size: texSize,
                                latLngBounds: self.latLngBounds,
                                res: 360 / (2<<self.zoom) / self.tileSize,
                                allInvalid: allInvalid
                            })
                        }
                    });
                }
            }
        },
        pointToLatLng:function(point) {
            var epsg = this.uniforms.epsg, ppd = this.uniforms.ppd;
            if (epsg == 3857) {
                var R = 180.0 / Math.PI * ppd;
                return new LatLng(Math.atan(Math.exp(point.y / R)) * 360.0 / Math.PI - 90.0, point.x / ppd);
            } else {
                return new LatLng(point.y / ppd, point.x / ppd);
            }
        },
        getVal:function(latLng){
            var offset = LatLng.div(latLng.offset(this.data.latLngBounds.getSouthWest()),this.data.res);
            var min = offset.floor(),max = offset.ceil();
            var bounds = new Bounds(min,max);
            var ratio = offset.subtract(min);

            //暂用双线性插值取值，如果不行，再改用hermite插值
            //1--2
            //4--3
            var p1 = this._getCell(bounds.getTopLeft());
            var p2 = this._getCell(bounds.getTopRight());
            var p3 = this._getCell(bounds.getBottomRight());
            var p4 = this._getCell(bounds.getBottomLeft());

            return (p1*(1-ratio.x)+p2*ratio.x) * (1-ratio.y) +
                (p4*(1-ratio.x)+p3*ratio.x) * ratio.y;
        },
        _getCell:function (cell) {
            if(cell.y<0||cell.y>=this.data.size.y||cell.x<0||cell.x>=this.data.size.x)
                return NaN;
            var int16 = new DataView(this.data.abv.buffer).getInt16((cell.y * this.data.size.x + cell.x)*2);
            if(int16==32767)//缺测
                return NaN;
            return int16/10;
        },
        value2color:function (val,plt) {
            if (isNaN(val)) {
                return [0, 0, 0, 0];
            } else {
                var index = Math.max(0, Math.min(4 * (plt.steps - 1), (val - plt.startingValue) / plt.step << 2))
                return plt.colors.slice(index,index+4);
            }
        }
    }

    function TileKey(z, x, y) {
        this.z = z;
        this.x = x;
        this.y = y;
    }

    TileKey.prototype = {
        clone: function () {
            return new TileKey(this.z, this.x, this.y);
        },
        wrap: function () {
            var colCnt = 2<<this.z;
            var tileKey = new TileKey(this.z, (this.x % colCnt + colCnt) % colCnt, this.y);
            //为了便于判断数据经度范围在[0,360]的瓦片的validBounds
            tileKey._360 = new TileKey(tileKey.z, tileKey.x + colCnt, tileKey.y);
            return tileKey;
        },
        toString: function () {
            return this.z + ":" + this.x + ":" + this.y;
        }
    }

    /**
     * 自定义了一个LRU (最近 最少使用)缓存 
     * @param {Number} limit  缓存大小 
     */
    function LruCache(limit) {
        this.size = 0, this.limit = limit, this._keymap = {}
    }

    LruCache.prototype.put = function (k, v) {
        var c = {key: k, value: v};
        this._keymap[k] = c;
        if (this.tail) {
            this.tail.newer = c;
            c.older = this.tail;
        } else
            this.head = c;

        this.tail = c;
        if (this.size === this.limit)
            this.shift();
        else
            this.size++;
    };
    LruCache.prototype.shift = function () {
        var head = this.head;
        if (this.head.newer) {
            this.head = this.head.newer;
            this.head.older = undefined;
        } else {
            this.head = undefined;
        }
        head.newer = head.older = undefined;
        delete this._keymap[head.key];
        return head;
    };
    LruCache.prototype.get = function (k, b) {
        var c = this._keymap[k];
        if (!c) {
            return undefined;
        } else if (c === this.tail) {
            return b ? c : c.value
        }

        if (c.newer) {
            if (c == this.head) {
                this.head = c.newer;
            }
            c.newer.older = c.older;
        }
        if (c.older) {
            c.older.newer = c.newer;
        }
        c.newer = undefined;
        c.older = this.tail;
        if (this.tail) this.tail.newer = c;
        this.tail = c;
        return b ? c : c.value;
    };
    LruCache.prototype.remove = function (k) {
        var b = this._keymap[k];
        if (b) delete this._keymap[b.key];
        if (b.newer && b.older) {
            b.older.newer = b.newer;
            b.newer.older = b.older;
        } else if (b.newer) {
            b.newer.older = undefined;
            this.head = b.newer
        } else if (b.older) {
            b.older.newer = undefined;
            this.tail = b.older;
        } else {
            this.head = this.tail = undefined;
        }
        this.size--;
        return b.value;
    };

    var templateRe = /\{ *([\w_-]+) *\}/g;

// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values — they will be evaluated passing `data` as an argument.
    function template(str, data) {
        return str.replace(templateRe, function (str, key) {
            var value = data[key];

            if (value === undefined) {
                throw new Error('No value provided for variable ' + str);

            } else if (value.constructor.name === 'Function') {
                value = value(data);
            }
            return value;
        });
    }

    // @function isArray(obj): Boolean
// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
    var isArray = Array.isArray || function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    };


    function Point(x, y, round) {
        // @property x: Number; The `x` coordinate of the point
        this.x = (round ? Math.round(x) : x);
        // @property y: Number; The `y` coordinate of the point
        this.y = (round ? Math.round(y) : y);
    }

    var trunc = Math.trunc || function (v) {
        return v > 0 ? Math.floor(v) : Math.ceil(v);
    };

    Point.prototype = {

        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function () {
            return new Point(this.x, this.y);
        },

        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function (point) {
            // non-destructive, returns a new point
            return this.clone()._add(toPoint(point));
        },

        _add: function (point) {
            // destructive, used directly for performance in situations where it's safe to modify existing point
            this.x += point.x;
            this.y += point.y;
            return this;
        },

        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function (point) {
            return this.clone()._subtract(toPoint(point));
        },

        _subtract: function (point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        },

        // @method divideBy(num: Number): Point
        // Returns the result of division of the current point by the given number.
        divideBy: function (num) {
            return this.clone()._divideBy(num);
        },

        _divideBy: function (num) {
            this.x /= num;
            this.y /= num;
            return this;
        },

        // @method multiplyBy(num: Number): Point
        // Returns the result of multiplication of the current point by the given number.
        multiplyBy: function (num) {
            return this.clone()._multiplyBy(num);
        },

        _multiplyBy: function (num) {
            this.x *= num;
            this.y *= num;
            return this;
        },

        // @method scaleBy(scale: Point): Point
        // Multiply each coordinate of the current point by each coordinate of
        // `scale`. In linear algebra terms, multiply the point by the
        // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
        // defined by `scale`.
        scaleBy: function (point) {
            return new Point(this.x * point.x, this.y * point.y);
        },

        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function (point) {
            return new Point(this.x / point.x, this.y / point.y);
        },

        // @method round(): Point
        // Returns a copy of the current point with rounded coordinates.
        round: function () {
            return this.clone()._round();
        },

        _round: function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        },

        // @method floor(): Point
        // Returns a copy of the current point with floored coordinates (rounded down).
        floor: function () {
            return this.clone()._floor();
        },

        _floor: function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        },

        // @method ceil(): Point
        // Returns a copy of the current point with ceiled coordinates (rounded up).
        ceil: function () {
            return this.clone()._ceil();
        },

        _ceil: function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        },

        // @method trunc(): Point
        // Returns a copy of the current point with truncated coordinates (rounded towards zero).
        trunc: function () {
            return this.clone()._trunc();
        },

        _trunc: function () {
            this.x = trunc(this.x);
            this.y = trunc(this.y);
            return this;
        },

        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function (point) {
            point = toPoint(point);

            var x = point.x - this.x,
                y = point.y - this.y;

            return Math.sqrt(x * x + y * y);
        },

        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function (point) {
            point = toPoint(point);

            return point.x === this.x &&
                point.y === this.y;
        },

        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function (point) {
            point = toPoint(point);

            return Math.abs(point.x) <= Math.abs(this.x) &&
                Math.abs(point.y) <= Math.abs(this.y);
        },

        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function () {
            return 'Point(' +
                formatNum(this.x) + ', ' +
                formatNum(this.y) + ')';
        }
    };

// @factory L.point(x: Number, y: Number, round?: Boolean)
// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

// @alternative
// @factory L.point(coords: Number[])
// Expects an array of the form `[x, y]` instead.

// @alternative
// @factory L.point(coords: Object)
// Expects a plain object of the form `{x: Number, y: Number}` instead.
    function toPoint(x, y, round) {
        if (x instanceof Point) {
            return x;
        }
        if (isArray(x)) {
            return new Point(x[0], x[1]);
        }
        if (x === undefined || x === null) {
            return x;
        }
        if (x.constructor.name === 'Object' && 'x' in x && 'y' in x) {
            return new Point(x.x, x.y);
        }
        return new Point(x, y, round);
    }

    /*
     * @class Bounds
     * @aka L.Bounds
     *
     * Represents a rectangular area in pixel coordinates.
     *
     * @example
     *
     * ```js
     * var p1 = L.point(10, 10),
     * p2 = L.point(40, 60),
     * bounds = L.bounds(p1, p2);
     * ```
     *
     * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
     *
     * ```js
     * otherBounds.intersects([[10, 10], [40, 60]]);
     * ```
     *
     * Note that `Bounds` does not inherit from Leafet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function Bounds(a, b) {
        if (!a) {
            return;
        }

        var points = b ? [a, b] : a;

        for (var i = 0, len = points.length; i < len; i++) {
            this.extend(points[i]);
        }
    }

    Bounds.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        extend: function (point) { // (Point)
            point = toPoint(point);

            // @property min: Point
            // The top left corner of the rectangle.
            // @property max: Point
            // The bottom right corner of the rectangle.
            if (!this.min && !this.max) {
                this.min = point.clone();
                this.max = point.clone();
            } else {
                this.min.x = Math.min(point.x, this.min.x);
                this.max.x = Math.max(point.x, this.max.x);
                this.min.y = Math.min(point.y, this.min.y);
                this.max.y = Math.max(point.y, this.max.y);
            }
            return this;
        },

        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function (round) {
            return new Point(
                (this.min.x + this.max.x) / 2,
                (this.min.y + this.max.y) / 2, round);
        },

        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function () {
            return new Point(this.min.x, this.max.y);
        },

        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function () { // -> Point
            return new Point(this.max.x, this.min.y);
        },

        // @method getTopLeft(): Point
        // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
        getTopLeft: function () {
            return this.min; // left, top
        },

        // @method getBottomRight(): Point
        // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
        getBottomRight: function () {
            return this.max; // right, bottom
        },

        // @method getSize(): Point
        // Returns the size of the given bounds
        getSize: function () {
            return this.max.subtract(this.min);
        },

        // @method contains(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains(point: Point): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function (obj) {
            var min, max;

            if (isArray(obj) && obj[0].constructor.name === 'Number' || obj instanceof Point) {
                obj = toPoint(obj);
            } else {
                obj = toBounds(obj);
            }

            if (obj instanceof Bounds) {
                min = obj.min;
                max = obj.max;
            } else {
                min = max = obj;
            }

            return (min.x >= this.min.x) &&
                (max.x <= this.max.x) &&
                (min.y >= this.min.y) &&
                (max.y <= this.max.y);
        },

        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function (bounds) { // (Bounds) -> Boolean
            bounds = toBounds(bounds);

            var min = this.min,
                max = this.max,
                min2 = bounds.min,
                max2 = bounds.max,
                xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
                yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

            return xIntersects && yIntersects;
        },

        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function (bounds) { // (Bounds) -> Boolean
            bounds = toBounds(bounds);

            var min = this.min,
                max = this.max,
                min2 = bounds.min,
                max2 = bounds.max,
                xOverlaps = (max2.x > min.x) && (min2.x < max.x),
                yOverlaps = (max2.y > min.y) && (min2.y < max.y);

            return xOverlaps && yOverlaps;
        },

        isValid: function () {
            return !!(this.min && this.max);
        }
    };


// @factory L.bounds(corner1: Point, corner2: Point)
// Creates a Bounds object from two corners coordinate pairs.
// @alternative
// @factory L.bounds(points: Point[])
// Creates a Bounds object from the given array of points.
    function toBounds(a, b) {
        if (!a || a instanceof Bounds) {
            return a;
        }
        return new Bounds(a, b);
    }

    /*
     * @class LatLngBounds
     * @aka L.LatLngBounds
     *
     * Represents a rectangular geographical area on a map.
     *
     * @example
     *
     * ```js
     * var corner1 = L.latLng(40.712, -74.227),
     * corner2 = L.latLng(40.774, -74.125),
     * bounds = L.latLngBounds(corner1, corner2);
     * ```
     *
     * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
     *
     * ```js
     * map.fitBounds([
     * 	[40.712, -74.227],
     * 	[40.774, -74.125]
     * ]);
     * ```
     *
     * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
     *
     * Note that `LatLngBounds` does not inherit from Leafet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function LatLngBounds(corner1, corner2) { // (LatLng, LatLng) or (LatLng[])
        if (!corner1) {
            return;
        }

        var latlngs = corner2 ? [corner1, corner2] : corner1;

        for (var i = 0, len = latlngs.length; i < len; i++) {
            this.extend(latlngs[i]);
        }
    }

    LatLngBounds.prototype = {

        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point

        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function (obj) {
            var sw = this._southWest,
                ne = this._northEast,
                sw2, ne2;

            if (obj instanceof LatLng) {
                sw2 = obj;
                ne2 = obj;

            } else if (obj instanceof LatLngBounds) {
                sw2 = obj._southWest;
                ne2 = obj._northEast;

                if (!sw2 || !ne2) {
                    return this;
                }

            } else {
                return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
            }

            if (!sw && !ne) {
                this._southWest = new LatLng(sw2.lat, sw2.lng);
                this._northEast = new LatLng(ne2.lat, ne2.lng);
            } else {
                sw.lat = Math.min(sw2.lat, sw.lat);
                sw.lng = Math.min(sw2.lng, sw.lng);
                ne.lat = Math.max(ne2.lat, ne.lat);
                ne.lng = Math.max(ne2.lng, ne.lng);
            }

            return this;
        },

        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function (bufferRatio) {
            var sw = this._southWest,
                ne = this._northEast,
                heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
                widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

            return new LatLngBounds(
                new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
                new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
        },

        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function () {
            return new LatLng(
                (this._southWest.lat + this._northEast.lat) / 2,
                (this._southWest.lng + this._northEast.lng) / 2);
        },

        // @method getSouthWest(): LatLng
        // Returns the south-west point of the bounds.
        getSouthWest: function () {
            return this._southWest;
        },

        // @method getNorthEast(): LatLng
        // Returns the north-east point of the bounds.
        getNorthEast: function () {
            return this._northEast;
        },

        // @method getNorthWest(): LatLng
        // Returns the north-west point of the bounds.
        getNorthWest: function () {
            return new LatLng(this.getNorth(), this.getWest());
        },

        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function () {
            return new LatLng(this.getSouth(), this.getEast());
        },

        // @method getWest(): Number
        // Returns the west longitude of the bounds
        getWest: function () {
            return this._southWest.lng;
        },

        // @method getSouth(): Number
        // Returns the south latitude of the bounds
        getSouth: function () {
            return this._southWest.lat;
        },

        // @method getEast(): Number
        // Returns the east longitude of the bounds
        getEast: function () {
            return this._northEast.lng;
        },

        // @method getNorth(): Number
        // Returns the north latitude of the bounds
        getNorth: function () {
            return this._northEast.lat;
        },

        // @method contains(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle contains the given one.

        // @alternative
        // @method contains (latlng: LatLng): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
            if (isArray(obj) && obj[0].constructor.name === 'Number' || obj instanceof LatLng || 'lat' in obj) {
                obj = toLatLng(obj);
            } else {
                obj = toLatLngBounds(obj);
            }

            var sw = this._southWest,
                ne = this._northEast,
                sw2, ne2;

            if (obj instanceof LatLngBounds) {
                sw2 = obj.getSouthWest();
                ne2 = obj.getNorthEast();
            } else {
                sw2 = ne2 = obj;
            }

            return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
                (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
        },

        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function (bounds) {
            bounds = toLatLngBounds(bounds);

            var sw = this._southWest,
                ne = this._northEast,
                sw2 = bounds.getSouthWest(),
                ne2 = bounds.getNorthEast(),

                latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
                lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

            return latIntersects && lngIntersects;
        },

        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function (bounds) {
            bounds = toLatLngBounds(bounds);

            var sw = this._southWest,
                ne = this._northEast,
                sw2 = bounds.getSouthWest(),
                ne2 = bounds.getNorthEast(),

                latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
                lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

            return latOverlaps && lngOverlaps;
        },

        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function () {
            return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
        },

        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function (bounds, maxMargin) {
            if (!bounds) {
                return false;
            }

            bounds = toLatLngBounds(bounds);

            return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
                this._northEast.equals(bounds.getNorthEast(), maxMargin);
        },

        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function () {
            return !!(this._southWest && this._northEast);
        }
    };


// @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
// Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

// @alternative
// @factory L.latLngBounds(latlngs: LatLng[])
// Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
    function toLatLngBounds(a, b) {
        if (a instanceof LatLngBounds) {
            return a;
        }
        return new LatLngBounds(a, b);
    }

    /* @class LatLng
     * @aka L.LatLng
     *
     * Represents a geographical point with a certain latitude and longitude.
     *
     * @example
     *
     * ```
     * var latlng = L.latLng(50.5, 30.5);
     * ```
     *
     * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
     *
     * ```
     * map.panTo([50, 30]);
     * map.panTo({lon: 30, lat: 50});
     * map.panTo({lat: 50, lng: 30});
     * map.panTo(L.latLng(50, 30));
     * ```
     *
     * Note that `LatLng` does not inherit from Leafet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function LatLng(lat, lng, alt) {
        if (isNaN(lat) || isNaN(lng)) {
            throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
        }

        // @property lat: Number
        // Latitude in degrees
        this.lat = +lat;

        // @property lng: Number
        // Longitude in degrees
        this.lng = +lng;

        // @property alt: Number
        // Altitude in meters (optional)
        if (alt !== undefined) {
            this.alt = +alt;
        }
    }

    LatLng.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function (obj, maxMargin) {
            if (!obj) {
                return false;
            }

            obj = toLatLng(obj);

            var margin = Math.max(
                Math.abs(this.lat - obj.lat),
                Math.abs(this.lng - obj.lng));

            return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
        },

        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function (precision) {
            return 'LatLng(' +
                formatNum(this.lat, precision) + ', ' +
                formatNum(this.lng, precision) + ')';
        },

        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function (other) {
            return Earth.distance(this, toLatLng(other));
        },

        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function () {
            return Earth.wrapLatLng(this);
        },

        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function (sizeInMeters) {
            var latAccuracy = 180 * sizeInMeters / 40075017,
                lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

            return toLatLngBounds(
                [this.lat - latAccuracy, this.lng - lngAccuracy],
                [this.lat + latAccuracy, this.lng + lngAccuracy]);
        },

        clone: function () {
            return new LatLng(this.lat, this.lng, this.alt);
        }
    };


// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

// @alternative
// @factory L.latLng(coords: Array): LatLng
// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

// @alternative
// @factory L.latLng(coords: Object): LatLng
// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

    function toLatLng(a, b, c) {
        if (a instanceof LatLng) {
            return a;
        }
        if (isArray(a) && a[0].constructor.name !== 'Object') {
            if (a.length === 3) {
                return new LatLng(a[0], a[1], a[2]);
            }
            if (a.length === 2) {
                return new LatLng(a[0], a[1]);
            }
            return null;
        }
        if (a === undefined || a === null) {
            return a;
        }
        if (a.constructor.name === 'Object' && 'lat' in a) {
            return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
        }
        if (b === undefined) {
            return null;
        }
        return new LatLng(a, b, c);
    }

//-----------------------------------------------------
    LatLng.prototype.offset = function (other) {
        return toLatLng(this.lat - other.lat, this.lng - other.lng);
    }
    LatLng.div = function (latLng, deg) {
        return toPoint(latLng.lng / deg, latLng.lat / deg);
    }
    Point.mul = function (point, deg) {
        return toLatLng(point.y * deg, point.x * deg);
    }
    LatLng.fromJSON = function (latLng) {
        return toLatLng(latLng.lat, latLng.lng);
    }
    Point.fromJSON = function (point) {
        return toPoint(point.x, point.y);
    }
    LatLngBounds.fromJSON = function (latLngBounds) {
        return toLatLngBounds(
            LatLng.fromJSON(latLngBounds._southWest),
            LatLng.fromJSON(latLngBounds._northEast)
        )
    }
    Bounds.fromJSON = function (bounds) {
        return toBounds(
            Point.fromJSON(bounds.min),
            Point.fromJSON(bounds.max)
        )
    }

    exports.Tile = Tile;
    exports.TileKey = TileKey;
    exports.Point = Point;
    exports.point = toPoint;
    exports.LatLng = LatLng;
    exports.latLng = toLatLng;
    exports.Bounds = Bounds;
    exports.bounds = toBounds;
    exports.LatLngBounds = LatLngBounds;
    exports.latLngBounds = toLatLngBounds;
    exports.template = template;
}