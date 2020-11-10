import L from 'leaflet'

let Demo = L.Class.extend({
    demoMethod: function () {
        return this.demoProperty
    },

    options: {
        width: 1,
        height: 1
    },
    /**默认的构造函数 */
    initialize: function (name, options): void {
        this.name = name;
        L.setOptions(this, options)
    },

})

Demo.addInitHook(()=>{console.log('add init hook after initialize')})

let instance = new Demo('red', { width: 200 })

console.log(instance)

