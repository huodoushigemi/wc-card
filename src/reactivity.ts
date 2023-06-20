type CB = () => void

const wm = new WeakMap<any, Record<string, Set<Function>>>()

export function reactive<T extends Record<string, any>>(obj: T): T {
  return new Proxy(obj, {
    get(o, k: string, r) {
      track(o, k)
      return Reflect.get(obj, k, r)
    },
    set(o, k: string, v, r) {
      if (o[k] === v) return true
      const ret = Reflect.set(o, k, v, r)
      trigger(o, k)
      return ret
    }
  })
}

export type Ref<T> = { value: T }
export function ref<T>(value: T): Ref<T>
export function ref<T = any>(): Ref<T | undefined>
export function ref<T>(value?: T ) { return reactive({ value }) }

export const computed = <T>(get: () => T) => {
  const cahced = ref<T>()
  effect(() => cahced.value = get(), { scheduler: cb => cb() })
  return cahced
}

const es = [] as Function[]

type EffectOption = Partial<{ scheduler: (fun: Function) => void, immediate: boolean, cb: () => void }>

export function effect(depFn: () => void, opt?: EffectOption | (CB & EffectOption)) {
  const fun = () => (opt?.scheduler ?? enqueue)(typeof opt === 'function' ? opt : (opt?.cb ?? fun.run))
  fun.run = () => {
    es.push(fun)
    depFn()
    es.pop()
  }
  (opt?.immediate == null || opt?.immediate) && fun.run()
}

function trigger(o: any, k: string) {
  wm.get(o)?.[k]?.forEach(e => e())
}

function track(o: any, k: string) {
  const e = es.at(-1)
  if (!e) return
  ((wm.get(o) || wm.set(o, {}).get(o)!)[k] ??= new Set()).add(e)
  
}

export function queueMicro(cb: () => void) {
  queueMicrotask ? queueMicrotask(cb) : Promise.resolve().then(cb)
}

const queue = [] as Function[]
const postQueue = [] as Function[]
let looping = false

export function enqueue(cb: Function) {
  queue.includes(cb) || queue.push(cb)
  flushJobs()
}

export function nextTick(cb: Function) {
  postQueue.includes(cb) || postQueue.push(cb)
  flushJobs()
}

function flushJobs() {
  if (looping) return
  looping = true
  queueMicro(() => {
    while (queue.length || postQueue.length) {
      while (queue.length) queue.shift()!()
      while (postQueue.length) postQueue.shift()!()
    }
    looping = false
  })
}