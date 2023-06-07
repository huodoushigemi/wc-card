import { html } from 'lit'
import { defineComponent } from "./defineComponent";
import { computed, effect, enqueue } from './reactivity';

const TeleportProps = {
  to: '',
  disabled: false
}

defineComponent('wc-teleport', TeleportProps, function(props) {
  const to = computed(() => props.to ? document.querySelector(props.to) as HTMLElement : null)
  const enable = computed(() => to?.value && !props.disabled)

  let first = true

  let children = [] as Element[]

  effect(() => {
    if (enable.value) {
      children = [...this.children]
      const fragment = document.createDocumentFragment()
      fragment.replaceChildren(...children)
      to.value!.appendChild(fragment)
    } else if (!first) {
      this.replaceChildren(...children)
    }

    first = false
  })

  return () => html`<slot></slot>`
})