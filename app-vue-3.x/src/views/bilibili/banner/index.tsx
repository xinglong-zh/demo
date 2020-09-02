import { defineComponent } from 'vue';

import Carousel from './carousel'
import Recommend from './recommend'

import './banner.scss'


export default defineComponent({
    name: 'banner',
    data() {
        return {

        }
    },
    render() {
        return (
            <div class="center content_video carousel">
                <Carousel class="left"></Carousel>
                <Recommend class="right"></Recommend>
            </div>
        )
    }
})