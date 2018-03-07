<template>
  <portal-target slim multiple :name="name" />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'modal-root'
    }
  }
}
</script>
