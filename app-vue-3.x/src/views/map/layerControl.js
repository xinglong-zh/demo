/**
 * 扩展 control 
 */

import * as L from 'leaflet'
import { DomUtil,DomEvent,Util } from 'leaflet';

export const LayesControl = L.Control.extend({
    options:{
        // @option collapsed: Boolean = true
		// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
		collapsed: true,
		position: 'topright',

		// @option autoZIndex: Boolean = true
		// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
		autoZIndex: true,

		// @option hideSingleBase: Boolean = false
		// If `true`, the base layers in the control will be hidden when there is only one.
		hideSingleBase: false,

		// @option sortLayers: Boolean = false
		// Whether to sort the layers. When `false`, layers will keep the order
		// in which they were added to the control.
    },
    //  基础地图 , 交互地图
    initialize:function(baseLayers,overLayrs,options){
        Util.setOptions(this,options)  
        this._layerControlInputs = [];
        this._layers =[];  // 储存所有的layer
        this._lastZIndex = 0;

        for(let i in baseLayers){
            this._addLayer(baseLayers[i],i)  
        }
        for(let i in overLayrs){
            this._addLayer(overLayrs[i],i,true)
        }

    },
    // 更新
    _update:function(){
        if(this._container){return this;}

        DomUtil.empty(this._baseLayersList); //Removes all of `el`'s children elements from `el`
        DomUtil.empty(this._overLayersList) //Removes all of `el`'s children elements from `el`

        this._layerControlInputs =[]
        let obj,baseLayersCount= 0;

        // 遍历数据,创建对象
        for(let i=0;i<this._layers.length;i++){
            obj = this._layers[i]  // {layer:  , name , isOverLayer}
            this._addItem(obj)
            // TODO:  获取当前base/over -layer
            baseLayersCount += !obj.overLayer?1:0  // baseLayer 的数量
        }

        return this;

    },
    onAdd:function(map){
        this._initLayout();  // 初始化布局
        this._update();

        this._map = map;
        map.on('zoomend',this._checkDisabledLayers,this)

        for(let i =0;i<this._layers.length;i++){
            this._layers[i].layer.on('add remove',this._onLayerChange,this)
        }

        return this._container;

    },
    onRemove:function(){
        // 去掉监听事件
    },
    _addLayer:function(layer,name,overLayer){
        if(this._map){
            layer.on('add remove',this._onLayerChange,this); //监听
        }
        this._layers.push({
            layer:layer,
            name:name,
            overLayer:overLayer
        })
        if(this.options.autoZIndex&&layer.setZIndex){
            this._lastZIndex++
            layer.setZIndex(this._lastZIndex)
        }
        this._expandIfNotCollapsed();

    },

    _onLayerChange:function(e){
        // layer change 的时候做一些事情
        console.log(e)

        let obj = this._getLayer(Util.stamp(e.target))

        let type = obj.overLayer?
        (e.type==='add'?'overlayadd':'overlayremove'):
        (e.type==='add'?'baselayerchange':null);

        if(type){
            this._map.fire(type,obj)
        }
        
    },

    // 展开icon
    _expandIfNotCollapsed: function () {
		if (this._map && !this.options.collapsed) {
			this.expand();
		}
		return this;
    },
    // 初始化布局    
    _initLayout:function(){
        let className = 'control-container', 
        container = this._container = DomUtil.create('div',className) ,
        collapsed = this.options.collapsed;

        DomEvent.disableClickPropagation(container);
        DomEvent.disableScrollPropagation(container);
        
        let section = this._section = DomUtil.create('section',className+'-list')

        // 展开情况下
        if(collapsed){
            this._map.on('click',this.collapsed,this);  // 目前不需要 ,   
        }
        if(!collapsed){
            this.expand();
        }
        // section 下加入两个dom元素
        this._baseLayersList = DomUtil.create('div',className+'-baseLayer',section)
        this._overLayersList = DomUtil.create('div',className+'-overLayers',section)
        container.appendChild(section)
    },
    /**
     * layers 数组中的对象添加到集合中
     * @param {Object} obj  _layers 数组中存储的元素 
     * @param {Layer} obj.layer  layer 对象
     * @param {String} obj.name  layer 对象名称 , 展示在label中
     * @param {Boolean} obj.overLayer  是否是overlayer , 非baselayer 
     */
    _addItem:function(obj){
        let className = 'control-layers'
        // this._layers 中的数组会被重新渲染
        let item =  DomUtil.create('div',className), 
        checked = this._map.hasLayer(obj.layer);
        // item  : <span>name</span> <img src=''><img src=''>
        let name = DomUtil.create('span',className+'-name',item)
        name.innerHTML = ' ' + obj.name;
        let eye = DomUtil.create('span',className + checked?'-showEye':'-NOTshowEye',item)
        let close = DomUtil.create('span',className+'-close',item)

        DomEvent.on(eye,'click',this._eyeIconClick,this)
        DomEvent.on(close,'click',this._closeIconClick,this)

        item.layerId = Util.stamp(obj.layer) // 返回id?

        let container = obj.overLayr?this._overLayersList:this._baseLayersList; 
        container.appendChild(item)

        return item;
        
    },
    /**
     * eyeIcon click 改变状态 , load / remove  layer
     */
    _eyeIconClick:function(){
        console.log('click eyeIcon')
        // 
        // let addedLayers =[] , removedLayers =[];

    },
    /**
     * _closeIcon  删除layer  , baseLayers/ overLayers   , 然后从layers[]  数组中去掉 , 则不会渲染
     */
    _closeIconClick:function(){
        console.log('click closeIcon')
    }



})