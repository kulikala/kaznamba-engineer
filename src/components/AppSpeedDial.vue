<template lang="pug">
  v-speed-dial(
    v-model="fab"
    direction="bottom"
    fixed
    open-on-hover
    right
    top
    transition="slide-y-transition"
  )
    template(
      v-slot:activator
    )
      v-btn.ma-2(
        v-model="fab"
        dark
        fab
      )
        v-icon color_lens
        v-icon close
    v-btn(
      color="deep-orange lighten-1"
      dark
      fab
      small
      @click="$store.commit('theme', 'light')"
    )
      v-icon wb_sunny
    v-btn(
      color="indigo"
      dark
      fab
      small
      @click="$store.commit('theme', 'dark')"
    )
      v-icon brightness_3
</template>

<script>
export default {
  data () {
    return {
      fab: false
    }
  }
}
</script>
