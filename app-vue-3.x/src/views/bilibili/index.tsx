import { defineComponent, toRefs, ref } from "vue"
import top from './header/index'
import banner from './banner/index'
import content from './content/index'
import bottom from './foot/index'

import './index.scss'

export default defineComponent({
    name: 'index',
    data() {
        return {

        }
    },
    components: {
        top, banner, content, bottom
    },
    setup(props, context) {
        return {
        }

    },
    render() {
        return (
            <div>
                <top>hello from top</top>
                <banner>hello banner</banner>
                <content>content</content>
                <bottom>bottom</bottom>
            </div>
        )

    }
})

