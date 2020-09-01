import { defineComponent } from 'vue';

import Carousel from './carousel'
import Recommend from './recommend'


export default defineComponent({
    name: 'banner',
    data() {
        return {

        }
    },
    render() {
        return (
            <div class="center content_video">
                <Carousel></Carousel>
                <Recommend></Recommend>
            </div>
        )
    }
})