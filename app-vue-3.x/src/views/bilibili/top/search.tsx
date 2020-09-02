import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'search',
    render() {
        let serach = ref(null)
        return (
            <div ref={serach}>
                <input type="text"></input>
                <button>按钮</button>
            </div>
        )
    }
})