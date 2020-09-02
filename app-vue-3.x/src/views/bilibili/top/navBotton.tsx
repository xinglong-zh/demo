import { defineComponent, PropType, toRefs } from 'vue';

interface Icon {
    text: string,
    url: string,
    child: Array<any> | undefined,
    icon: string | null
}

export default defineComponent({
    name: 'nav',
    props: {
        navButton: {
            type: Object as PropType<Icon>
        }
    },
    setup(props) {
        let { navButton } = toRefs(props)
        return () => (
            <>
                {navButton?.value?.text}
            </>
        )
    }
})