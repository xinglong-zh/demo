import { defineComponent } from 'vue';
import About from './about'
import Info from './info'

export default defineComponent({
    name: 'content',
    data() {
        return {

        }
    },
    setup() {
        return {

        }
    },
    render() {
        return (
            <div class="content_video">
                <About></About>
                <Info></Info>
            </div>
        )
    }
})