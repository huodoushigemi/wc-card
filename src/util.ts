export function remove<T>(list: T[], e: T) {
  const i = list.indexOf(e)
  ~i && list.splice(i, 1)
}

export function h<K extends keyof HTMLElementTagNameMap, T extends HTMLElementTagNameMap[K]>(tag: K, props?: T | null, children?: Element[]): HTMLElementTagNameMap[K] {
  const el = Object.assign(document.createElement(tag), props)
  children && el.replaceChildren(...children)
  return el
}
