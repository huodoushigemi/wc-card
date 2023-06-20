import { html } from "lit";
import { defineComponent, onMounted, onUnMounted } from "./defineComponent";
import { ref } from "./reactivity";

export const appbarProps = {
  expandedHeight: 0,
  floating: false,
  pinned: false,
  snap: false
}

function getScrollParent(el: HTMLElement) {
  while(el = el.parentElement!) {
    const { overflowY } = getComputedStyle(el)
    if (overflowY === 'auto' || overflowY === 'scroll') return el
  }
  return el || window
}

const range = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max))

defineComponent('wc-appbar', appbarProps, function (props) {
  const style = ref('')
  const h = 44
  let y = 0

  function onScroll(e: WheelEvent) {
    y = range(y - e.deltaY, -h, 0)
  }

  onMounted(() => {
    const scroll = getScrollParent(this)
    scroll.addEventListener('wheel', onScroll, { passive: true })
  })

  onUnMounted(() => {
    const scroll = getScrollParent(this)
    scroll.removeEventListener('wheel', onScroll)
  })

  return () => html`
  <div>
    <slot></slot>
  </div>
  <div style='position: absolute; inset: 0'>
    <slot name='flexibleSpace'></slot>
  </div>
  <style>:host { position: relative; display: block; height: 44px }</style>
  `
})