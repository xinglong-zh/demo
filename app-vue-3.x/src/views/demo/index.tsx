import { defineComponent } from 'vue';

export default defineComponent({
    name: 'demo',
    data(){
        return{
            res:null,
        }
    },
    render() {
        let arr =[1,2,3,4,5,6]
        let obj = {name:'xx',sex:'man'}
        
    return (<div><ul>{arr.map(item=>{return <li>{item}</li>})}</ul></div>)
    }
})