import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'login',
    render() {
        const login = ref(null)
        return (
            <div ref={login}>
                <span>登录</span>
                <span>注册</span>
                <span>投稿</span>
            </div>
        )
    }
})