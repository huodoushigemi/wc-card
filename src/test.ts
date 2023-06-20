import { html } from 'lit'
import { defineComponent } from './defineComponent'
import { ref } from './reactivity'
import * as Hero from './hero'

defineComponent('wc-test', {}, function () {
  const show = ref(false)

  function toggle() {
    Hero.record()
    show.value = !show.value
  }

  return () => html`
  ${!show.value ? html`<wc-hero style="overflow: hidden"><img src='https://images.goodsmile.info/cgm/images/product/20210930/11847/90976/large/5ee488d8a1a91e96c13246dfb14014e8.jpg' /></wc-hero>` : ''}
    ${show.value ? html`<wc-hero style="width: 100px; height: 100px; overflow: hidden"><img src='https://images.goodsmile.info/cgm/images/product/20210930/11847/90976/large/5ee488d8a1a91e96c13246dfb14014e8.jpg' /></wc-hero>` : ''}
  <button @click=${toggle}>click</button>
  `
})
