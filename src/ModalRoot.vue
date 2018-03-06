<template>
  <portal-target slim multiple :name="name" />
</template>

<script>
import PortalTarget from 'portal-vue/src/components/portal-target'

export default {
  components: { PortalTarget },
  props: {
    name: {
      type: String,
      default: 'modal-root'
    }
  }
}
</script>
