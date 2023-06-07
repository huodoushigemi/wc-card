import { html, render } from 'lit'
import { defineComponent } from "./defineComponent";
import { computed, effect } from './reactivity';

const TeleportProps = {
  to: '',
  disabled: false
}

defineComponent('wc-teleport', TeleportProps, function(props) {
  const fragment = document.createDocumentFragment()
  const to = computed(() => props.to && document.querySelector(props.to))

  effect(() => {
    // render(html`<slot></slot>`, props.disabled ? this.shadowRoot! : document.querySelector(props.to) as HTMLElement)
    
    const enable =  !to || props.disabled
    if (enable) {
      this.replaceChildren(...fragment.children)
    } else {
      fragment.replaceChildren(...this.children)
      to.value!.appendChild(fragment)
    }
  })

  return () => html`<slot></slot>`
})