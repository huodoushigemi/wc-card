import { html } from "lit";
import { defineComponent, onMounted, onUnMounted } from "./defineComponent";
import { h, remove } from "./util";

const heroProps=  {
  tag: ''
}

type A = {
  rect: DOMRect
  style: CSSStyleDeclaration
}

const map = {} as Record<string, A>

const list = [] as (HTMLElement & typeof heroProps)[]

export function record() {
  list.forEach(e => {
    map[e.tag] = {
      rect: e.getBoundingClientRect(),
      style: {...getComputedStyle(e)}
    }
  })
}


defineComponent('wc-hero', heroProps, function(props) {
  onMounted(() => {
    list.push(this)
    const prev = map[props.tag], rect = this.getBoundingClientRect()

    document.body.appendChild(h('div', { style: `position: fixed; top: ${rect.top}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px; border: 1px solid red; pointer-events: none;` } ))

    if (!prev) return

    const aim = this.animate({
      transform: [`translate(${prev.rect.left - rect.left}px, ${prev.rect.top - rect.top}px)`, ``],
      width: [`${prev.style.width}`, `${rect.width}px`],
      height: [`${prev.style.height}`, `${rect.height}px`],
      borderRadius: [prev.style.borderRadius, getComputedStyle(this).borderRadius],
    }, { duration: 300 })
    aim.play()
  })
  onUnMounted(() => {
    remove(list, this)
  })

  return () => html`
    <slot></slot>
    <style>:host{display: flex;}</style>
  `
})