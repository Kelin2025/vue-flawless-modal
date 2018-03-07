<template>
  <portal :to="target" v-if="isOpened">
    <transition :name="`modal-${animation}`">
      <div v-bind="$attrs" v-on="$listeners" :class="overlayClass" @click.self="handleOverlay" v-if="isOpened">
        <div :class="modalClass" key="modal-window">
          <span v-if="closeButton" @click.prevent="close" class="close-icon">
            <svg version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd" istroke="none">
                <g transform="translate(-288 -12)" fill="#444" fill-rule="nonzero">
                  <polygon points="288 26.611 289.39 28 296 21.389 302.61 28 304 26.611 297.39 20 304 13.389 302.61 12 296 18.611 289.39 12 288 13.389 294.61 20"
                  />
                </g>
              </g>
            </svg>
          </span>
          <div class="modal-inner">
            <slot v-bind="context" />
          </div>
        </div>
      </div>
    </transition>
  </portal>
</template>

<script>
import { modal } from './index'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    className: {
      default: null
    },
    overlay: {
      type: Boolean,
      default: true
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    closeOnEsc: {
      type: Boolean,
      default: true
    },
    closeButton: {
      type: Boolean,
      default: true
    },
    target: {
      type: String,
      default: 'modal-root'
    },
    position: {
      type: Object,
      default: () => ({ x: 'center', y: 'center' })
    },
    animation: {
      type: String,
      default: 'fade'
    },
    animationDuration: {
      type: Object,
      default: () => ({ open: 250, close: 250 })
    }
  },
  data() {
    return {
      isOpened: false,
      context: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val === this.isOpened) return
        if (val) this.open()
        else this.close()
      },
      immediate: true
    },
    isOpened(val) {
      if (this.overlay && this.target === 'modal-root') {
        document.body.style.overflow = val ? '-hidden' : 'auto'
      }
      if (val) {
        this.$root.$emit('modal.open')
        this.$root.$emit(`modal.open:${this.name}`)
      } else {
        this.$root.$emit('modal.close')
        this.$root.$emit(`modal.close:${this.name}`)
      }
      if (val !== this.value) {
        this.$emit('input', val)
      }
    }
  },
  computed: {
    modalClass: ({ className, overlay }) => ['modal-window', className || ''],

    overlayClass: ({ overlay, position, isOpened, animation }) => [
      'modal-overlay',
      overlay ? 'modal-overlay--visible' : 'modal-overlay--hidden',
      animation ? `modal-animation--${animation}` : '',
      isOpened ? 'modal--opened' : 'modal--closed',
      `modal-halign--${position.x}`,
      `modal-valign--${position.y}`
    ]
  },
  methods: {
    open(context) {
      if (this.isOpened) return
      if (context !== undefined) this.context = context
      this.isOpened = true
      this.$emit('input', true)
      this.$emit('open')
    },

    close() {
      if (!this.isOpened) return
      this.isOpened = false
      this.$emit('input', false)
      this.$emit('close')
    },

    setContext(context) {
      if (typeof context !== 'object') {
        console.warn(
          `[Modal] Context should be an Object, ${typeof context} given`
        )
        return
      }
      this.context = context
    },

    toggle(context) {
      if (this.isOpened) this.close()
      else this.open(context)
    },

    handleEsc(evt) {
      if (!this.closeOnEsc) return
      if (evt.keyCode === 27) this.close()
    },

    handleOverlay() {
      if (!this.closeOnOverlay) return
      this.close()
    }
  },
  mounted() {
    this.$options.offOpen = modal.on(`modal.open:${this.name}`, this.open)
    this.$options.offSend = modal.on(`modal.send:${this.name}`, this.setContext)
    this.$options.offClose = modal.on(`modal.close:${this.name}`, this.close)
    document.addEventListener('keyup', this.handleEsc)
  },
  beforeDestroy() {
    this.$options.offOpen()
    this.$options.offSend()
    this.$options.offClose()
    document.removeEventListener('keyup', this.handleEsc)
  }
}
</script>

<style>
.modal-overlay {
  cursor: pointer;
  display: flex;
  z-index: 10000;
  position: fixed;
  align-items: center;
  will-change: transform;
  justify-content: center;
}
.modal-overlay.modal-overlay--visible {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(74, 74, 74, 0.7);
}
.modal-overlay.modal-overlay--hidden {
  top: 50%;
  left: 50%;
  max-width: 100%;
  max-height: 100%;
}
.modal-overlay.modal-overlay--hidden.modal-valign--top {
  top: 100px;
}
.modal-overlay.modal-overlay--hidden.modal-valign--center {
  top: 50%;
}
.modal-overlay.modal-overlay--hidden.modal-valign--bottom {
  top: auto;
  bottom: 100px;
}
.modal-overlay.modal-overlay--hidden.modal-halign--left {
  left: 100px;
}
.modal-overlay.modal-overlay--hidden.modal-halign--center {
  left: 50%;
}
.modal-overlay.modal-overlay--hidden.modal-halign--right {
  left: auto;
  right: 100px;
}
.modal-overlay.modal-overlay--hidden.modal-valign--center {
  transform: translate(0, -50%);
}
.modal-overlay.modal-overlay--hidden.modal-halign--center {
  transform: translate(-50%, 0);
}
.modal-overlay.modal-overlay--hidden.modal-valign--center.modal-halign--center {
  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.1px));
}

.modal-window {
  cursor: initial;
  padding: 20px;
  position: relative;
  max-width: 100%;
  max-height: 100%;
  min-width: 1em;
  min-height: 50px;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.modal-window .close-icon {
  top: 5px;
  right: 5px;
  width: 10px;
  cursor: pointer;
  height: 10px;
  padding: 10px;
  opacity: 0.8;
  position: absolute;
  line-height: 10px;
  border-radius: 50%;
  transition: background 0.25s ease-in-out;
}
.modal-window .close-icon:hover {
  background: rgba(0, 0, 0, 0.1);
}
.modal-window .close-icon:active {
  background: rgba(0, 0, 0, 0.2);
}
.modal-window .close-icon svg {
  width: 10px;
  height: 10px;
}

.modal-inner {
  overflow: auto;
  max-width: 100%;
  max-height: 100%;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease-in-out;
  will-change: opacity;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-top-enter-active,
.modal-top-leave-active {
  transition: opacity 0.25s ease-in-out;
  will-change: opacity;
}
.modal-top-enter-active .modal-window,
.modal-top-leave-active .modal-window {
  transition: transform 0.25s ease-in-out;
  will-change: transform;
}
.modal-top-enter,
.modal-top-leave-to {
  opacity: 0;
}
.modal-top-enter .modal-window,
.modal-top-leave-to .modal-window {
  transform: translateY(-10px);
}

.modal-flip-enter-active,
.modal-flip-leave-active {
  transition: opacity 0.25s ease-in-out;
  will-change: opacity;
}
.modal-flip-enter-active .modal-window,
.modal-flip-leave-active .modal-window {
  transition: transform 0.25s ease-in-out;
  will-change: transform;
}
.modal-flip-enter,
.modal-flip-leave-to {
  opacity: 0;
}
.modal-flip-enter .modal-window,
.modal-flip-leave-to .modal-window {
  transform: rotateX(-90deg);
}
</style>
