import { html } from 'https://unpkg.com/lit-html?module'
import { defineComponent } from './defineComponent'
import { reactive, ref } from './reactivity'

const Props = {
  open: false,
  boundary: [] as (string | number)[]
}

defineComponent('wc-card', { ...Props } as typeof Props, function(props) {
  const el = this

  const rect = ref<DOMRect>()

  function onClick() {
    props.open = !props.open
    const rect = el.getBoundingClientRect()
  }

  return () => html`
    <slot></slot>
    ${props.open ? html`<slot name='info'></slot>` : undefined}
    <button @click=${onClick}>xxx</button>
  `
})