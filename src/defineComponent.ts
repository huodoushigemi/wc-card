import { render } from 'https://unpkg.com/lit-html?module'
import { effect, reactive } from './reactivity'

let currentInstance: Lifecycs | null

type Cbs = (() => void)[]

interface Lifecycs {
  _m?: Cbs
  _bu?: Cbs
  _u?: Cbs
  _um?: Cbs
}

export function defineComponent<T extends Record<string, any>, KS extends keyof T>(name: string, ps: T, factory: (this: Element, props: T) => () => string) {
  const Component = class extends HTMLElement implements Lifecycs {
    static observedAttributes = Object.keys(ps)

    _props: T

    _m?: Cbs
    _bu?: Cbs
    _u?: Cbs
    _um?: Cbs

    constructor() {
      super()
      const root = this.attachShadow({ mode: 'open' })
      this._props = reactive(ps)

      currentInstance = this
      const template = factory.call(this, this._props)
      currentInstance = null

      let isMounted = false

      effect(() => {
        if (isMounted) this._bu?.forEach(cb => cb())
        
        console.log('render');
        render(template(), root)

        if (isMounted) {
          this._u?.forEach(cb => cb())
        } else {
          isMounted = true
        }
      })
    }
    connectedCallback() {
      this._m?.forEach(cb => cb())
    }
    disconnectedCallback() {
      this._um?.forEach(cb => cb())
    }
    attributeChangedCallback(k: KS, old: any, val: any) {
      this._props[k] = val
    }
  }

  customElements.define(name, Component)
}

function createLifecycleMethod(name: keyof Lifecycs) {
  return (cb: () => void) => (currentInstance![name] ??= []).push(cb)
}

export const onMounted = createLifecycleMethod('_m')
export const onBeforeUpdate = createLifecycleMethod('_bu')
export const onUpdated = createLifecycleMethod('_u')
export const onUnMounted = createLifecycleMethod('_um')
