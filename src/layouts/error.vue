<template lang="pug">
  v-card
    v-card-title.headline
      | {{ message }}
    v-card-actions
      v-btn(
        flat
        nuxt
        replace
        to="/"
      ) Goto home page
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },

  head () {
    return {
      title: this.message
    }
  },

  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },

  computed: {
    message () {
      return this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    }
  }
}
</script>

<style lang="stylus" scoped>
h1
  font-size: 20px
</style>
