import { defineComponent, toRefs, ref } from "vue"
import Top from './top/index'
import Banner from './banner/index'
import Content from './content/index'
import Bottom from './foot/index'
import ADs from './ads/advertise'

import './index.scss'

export default defineComponent({
    name: 'index',
    data() {
        return {

        }
    },

    render() {
        return (
            <div>
                <Top>hello from top</Top>
                <Banner>hello banner</Banner>
                <ADs></ADs>
                <Content>content</Content>
                <Bottom>bottom</Bottom>
            </div>
        )

    }
})

