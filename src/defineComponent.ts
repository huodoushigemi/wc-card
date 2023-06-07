import { render, TemplateResult } from 'lit'
import { effect, reactive } from './reactivity'

let currentInstance: Lifecycs | null

type Cbs = (() => void)[]

const toType = (val: any) => Object.prototype.toString.call(val).slice(8, -1) as keyof typeof TypeConverter

const TypeConverter = {
  String,
  Number: (val: string) => Number(val),
  Boolean: (val: string) => val === 'false' ? false : Boolean(val),
  Object: (val: string) => val != null ? JSON.parse(val) : val,
  Array: (val: string) => val != null ? JSON.parse(val) : val,
  Date: (val: string) => new Date(val),
  RegExp: (val: string) => new RegExp(val),
}

interface Lifecycs {
  _m?: Cbs
  _bu?: Cbs
  _u?: Cbs
  _um?: Cbs
}

export function defineComponent<T extends Record<string, any>, KS extends keyof T>(name: string, ps: T, factory: (this: HTMLElement, props: T) => void | (() => void | TemplateResult<1>)) {
  const Component = class extends HTMLElement implements Lifecycs {
    _props = JSON.parse(JSON.stringify(ps)) as T
    props: T
    static get observedAttributes() { return Object.keys(ps) }

    _m?: Cbs
    _bu?: Cbs
    _u?: Cbs
    _um?: Cbs

    constructor() {
      super()
      const root = this.attachShadow({ mode: 'open' })
      this.props = reactive(this._props)

      currentInstance = this
      const template = factory.call(this, this.props)
      currentInstance = null

      let isMounted = false

      effect(() => {
        if (isMounted) this._bu?.forEach(cb => cb())
        
        console.log('render');
        template && render(template(), root)

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
    attributeChangedCallback(k: KS, old: string, val: string) {
      this.props[k] = TypeConverter[toType(ps[k] ?? '')](val)
      console.log('attributeChangedCallback', k, this.props[k])
    }
  }

  Object.keys(ps).forEach(prop => {
    Object.defineProperty(Component.prototype, prop, {
      get() { return this.props[prop] },
      set(v) { this.props[prop] = v }
    })
  })

  customElements.define(name, Component)
}

function createLifecycleMethod(name: keyof Lifecycs) {
  return (cb: () => void) => (currentInstance![name] ??= []).push(cb)
}

export const onMounted = createLifecycleMethod('_m')
export const onBeforeUpdate = createLifecycleMethod('_bu')
export const onUpdated = createLifecycleMethod('_u')
export const onUnMounted = createLifecycleMethod('_um')
