<template lang="pug">
  v-app(
    :dark="$store.getters.dark"
    :light="$store.getters.light"
  )
    v-content
      v-container
        nuxt

    v-footer
      span.ml-2 Copyright &copy; {{ year }} Kazuyuki Namba

    app-speed-dial
</template>

<script>
export default {
  computed: {
    year () {
      return new Date().getFullYear()
    }
  }
}
</script>
