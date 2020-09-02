import { defineComponent, PropType, toRefs, ref } from 'vue';

interface Icon {
    text: string,
    url: string,
    child: Array<any> | undefined,
    icon: string | null
}

export default defineComponent({
    name: 'navButton',
    props: {
        navButton: {
            type: Object as PropType<Icon>
        }
    },
    setup(props) {
        const navB = ref(null)
        let { navButton } = toRefs(props)
        return () => (
            <li>
                <span class="button">
                    {navButton?.value?.text}
                    <div class="content">
                        悬浮之后的内容
                    </div>
                </span>
            </li >
        )
    }
})