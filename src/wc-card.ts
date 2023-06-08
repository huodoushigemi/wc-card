import { html, render } from 'lit'
// import { ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { defineComponent } from './defineComponent'
import { effect, nextTick, reactive, ref } from './reactivity'

const Props = {
  open: false,
  boundary: [0, 0, 0, 0]
}

const rectKs = ['top', 'right', 'bottom', 'left']

defineComponent('wc-card', Props, function (props) {
  const el = this

  let placeholder = {} as any
  const style = ref<any>({})

  effect(() => props.open, {
    cb: () => {
      if (props.open) {
        const rect = el.getBoundingClientRect()
        // @ts-ignore
        // plceholder = rectKs.reduce((o, k) => (o[k] = _rect[k], o), {})
        placeholder = `width: ${rect.width}px; height: ${rect.height}px;`
        style.value = { position: 'fixed', top: rect.top + 'px', right: rect.right + 'px', bottom: rect.bottom + 'px', left: rect.left + 'px' }
        requestAnimationFrame(() => {
          const { boundary: b } = props
          style.value = { position: 'fixed', left: b[0] + 'px', top: b[1] + 'px', right: b[2] + 'px', bottom: b[3] + 'px' }
        })
      } else {
        style.value = {}
      }
    }
  })

  // ${ props.open ? html`<slot name="info" />` : undefined }
  return () => html`
    <div style="${styleMap({ ...style.value, overflow: 'hidden', transition: 'inset 1600ms', border: '1px solid red' })}">
      <slot></slot>
      <div>aaaa</div>
    </div>
    ${props.open ? html`<div style="${placeholder}"></div>` : undefined}
  `
})
