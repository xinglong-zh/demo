import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'type',
    data() {
        return {
            msg: 'hello world'
        }
    },
    setup(props) {
        console.log('composition api')
    },
    render() {
        return (<div>{this.msg}</div>)
    }
})