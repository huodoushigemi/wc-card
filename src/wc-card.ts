import { html, render } from 'lit'
// import { ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { defineComponent } from './defineComponent'
import { nextTick, reactive, ref } from './reactivity'

const Props = {
  open: false,
  boundary: [] as (string | number)[]
}

const rectKs = ['top', 'right', 'bottom', 'left']

defineComponent('wc-card', Props, function(props) {
  const el = this

  const rect = ref<DOMRect>()

  function onClick() {
    props.open = !props.open
    rect.value = el.getBoundingClientRect()

    render(renderDialog(), el.shadowRoot!)

    nextTick(() => {
          const dialog = document.querySelector('#dialog')! as HTMLElement
          console.log(3);
          
          dialog.offsetWidth
          
          const boundary = Array(4).fill(0)
          Object.assign(dialog.style, { top: boundary[0], right: boundary[0], bottom: boundary[0], left: boundary[0] } )
    })
  }

  function renderDialog() {
    // @ts-ignore
    const style = { position: 'fixed', ...rectKs.reduce((o, k) => (o[k] = rect.value[k] + 'px', o), {}), transition: 'all 300ms ease' }
    return html`
      <wc-teleport to='body'>
        <div id="dialog" style="${styleMap(style)}">teleport</div>
      </wc-teleport>
    `
  }

  return () => html`
    <div style='visibility: ${props.open ? 'hidden' : ''}'>
      <slot></slot>
    </div>
    <button @click=${onClick}>xxx</button>
    `
    // ${props.open ? html`<slot name='info'></slot>` : undefined}
})