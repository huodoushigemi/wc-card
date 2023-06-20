import { css, html, render } from 'lit'
// import { ref } from 'lit/directives/ref.js'
import { defineComponent, onMounted, onUnMounted } from './defineComponent'
import { computed, effect, nextTick, reactive, ref } from './reactivity'

const Props = {
  open: false,
  boundary: [0, 0, 0, 0],
  'z-index': 1,
  'wrap-style': ''
}

const rectKs = ['top', 'right', 'bottom', 'left']

defineComponent('wc-card', Props, function (props) {
  const el = this
  
  let placeholder = {} as any
  const style = ref('')
  
  const animating = ref(false)
  onMounted(() => {
    const container = this.shadowRoot!.querySelector('#container') as HTMLElement
    container.addEventListener('transitionend', () => animating.value = false)
  })
  onUnMounted(() => {
    
  })
  
  effect(() => props.open, () => {
    if (props.open) {
      const rect = el.getBoundingClientRect()
      placeholder = `width: ${rect.width}px; height: ${rect.height}px;`
      const { innerWidth: w, innerHeight: h } = window
      style.value = `position: fixed; left: ${rect.left}px; top: ${rect.top}px; right: ${w - rect.right}px; bottom: ${h - rect.bottom}px; z-index: ${props['z-index']}`
      animating.value = true
      setTimeout(() => {
        const { boundary: b } = props
        style.value = `position: fixed; top: ${b[0]}px; right: ${b[1]}px; bottom: ${b[2]}px; left: ${b[3]}px; z-index: ${props['z-index']}`
      }, 16)
    } else {
      const rect = el.getBoundingClientRect()
      const { innerWidth: w, innerHeight: h } = window
      style.value = `position: fixed; left: ${rect.left}px; top: ${rect.top}px; right: ${w - rect.right}px; bottom: ${h - rect.bottom}px; z-index: ${props['z-index']}`
      animating.value = true
    }
  })
  
  const opened = computed(() => props.open || animating.value)

  effect(() => opened.value, () => {
    if (opened.value) return
    style.value = ''
  })

  effect(() => {
    if (opened.value) {
      this.dispatchEvent(new Event('opened',  { bubbles: false }))
    } else {
      this.dispatchEvent(new Event('closed',  { bubbles: false }));
    }
  }, { immediate: false })

  return () => html`
    <div id="container" style="${style.value}; overflow: hidden; transition: left 300ms, top 300ms, right 300ms, bottom 300ms; border: 1px solid red; ${props['wrap-style']}">
      <slot></slot>
      ${ props.open || animating.value ? html`<slot name="info" />` : undefined }
    </div>
    ${ props.open || animating.value ? html`<div style="${placeholder}"></div>` : undefined }
    ${html`<style>:host { display: block }</style>`}
  `
})
