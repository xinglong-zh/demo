import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
    name: 'logo',
    render() {
        return (<RouterLink to="/"> <img src={require('@/image/logo.png')}></img></RouterLink>)
        // return (<RouterLink to="/bilibili">router </RouterLink>)
    }
})