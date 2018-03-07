# vue-flawless-modal

The last modal you need

## Playground

[**Go to codesandbox**](https://codesandbox.io/s/v3jx96jjl0)

## Installation

1.  Install via NPM

```
npm install vue-flawless-modal
```

2.  Use `Vue.use`:

```javascript
import VueFlawlessModal from 'vue-flawless-modal'

Vue.use(VueFlawlessModal)
```

3.  Add `<modal-root />` somewhere (e.g. `App.vue`):

```html
<template>
  <div id="app">
    <modal-root />
  </div>
</template>
```

## Documentation

### Basic usage

#### Create modal

Use `<modal-window>` with `name` property:

```html
<modal-window name="myModal">...</modal-window>
```

#### Programmatic controls

Then, you can control your modal anywhere using `$modal` methods

```javascript
/* In components */
this.$modal.open('myModal')
this.$modal.close('myModal')
```

```javascript
/* Outside vue */
import { modal } from 'vue-flawless-modal'

modal.open('myModal')
modal.close('myModal')
```

#### Control using `v-model`

Set property to `true` to open modal  
Set property to `false` to close modal

```html
<template>
  <modal-window name="myModal" v-model="isOpened">...</modal-window>
</template>

<script>
export default {
  data: () => ({ isOpened: false })
}
</script>
```

> **NOTE:** If you toggle modal with another way, prop will be changed too

### Properties

#### Overlay

By default, overlay is set to `true`. To remove it, use:

```html
<modal-window name="myModal" :overlay="false">...</modal-window>
```

### Close methods

By default, all props are set to `true`

```html
<modal-window
  name="myModal"
  :close-button="false"
  :close-on-esc="false"
  :close-on-overlay="false"
>
  <div>Some info</div>
</modal-window>
```

### Change position

If `overlay` is disabled, you can change modal position

```html
<modal-window
  name="myModal"
  :position="{ x: 'right', y: 'top' }"
>
  <div>Some info</div>
</modal-window>
```

* **x:** left | center | right
* **y:** top | center | bottom

### Animating modal

Modal is wrapper into default `<transition>` component with alias `modal-`

```html
<modal-window
  name="myModal"
  animation="fade"
  :animationDuration="{ open: 250, close: 250 }"
>
  <div>Some info</div>
</modal-window>
```

```css
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease-in-out;
  will-change: opacity;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
```

Animations out of box: fade | top | flip

### Sending context to modal

If you have some form and you need to fill it with data from another part of application, you can do it in two ways:

```javascript
export default {
  data() {
    return {
      form: {
        title: '',
        text: ''
      }
    }
  },
  methods: {
    openModal() {
      /* With modal open */
      this.$modal.open('myModal', this.form)
      /* Or just with send */
      this.$modal.send('myModal', this.form)
    }
  }
}
```

And then, you can use it with `slot-scope`

```html
<modal-window name="myModal">
  <template slot-scope="form">
    <input v-model="form.title" />
    <textarea v-model="form.text" />
  </template>
</modal-window>
```

## TODO

* [ ] Fix mobile issues
* [ ] 2+ modals of a single type on the screen
* [ ] Manually passed modal position
* [ ] Popover-style

## Author

My name is Anton, I'm frontend developer and I do little but useful things for JavaScript and especially for Vue  
Check out my GitHub: [**click here**](https://github.com/kelin2025)  
Follow me on Twitter: [**click here**](https://twitter.com/kelin2025)

## License

[**MIT**](https://github.com/Kelin2025/vue-flawless-modal/blob/master/LICENSE)
