import PortalVue from 'portal-vue'
import NanoEvents from 'nanoevents'
import ModalRoot from './src/ModalRoot'
import ModalWindow from './src/ModalWindow'

const bus = new NanoEvents()

export const modal = {
  on(evt, cb) {
    return bus.on(evt, cb)
  },
  emit(evt, ...data) {
    return bus.emit(evt, ...data)
  },
  open(name, context) {
    return bus.emit(`modal.open:${name}`, context)
  },
  send(name, context) {
    return bus.emit(`modal.send:${name}`, context)
  },
  close(name) {
    return bus.emit(`modal.close:${name}`)
  }
}

export default Vue => {
  Vue.use(PortalVue)
  Vue.component('modal-root', ModalRoot)
  Vue.component('modal-window', ModalWindow)
  Vue.mixin({
    created() {
      this.$modal = modal
    }
  })
}
