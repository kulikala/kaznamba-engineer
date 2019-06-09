<template lang="pug">
  v-layout(
    justify-center
    align-center
  )
    particle-network(
      v-bind="particleProps"
    )
    v-flex(
      xs12
      sm8
      md6
    )
      v-card
        v-card-title
          app-logo
        v-card-text.text-xs-center
          v-layout(
            column
          )
            v-flex.my-1(
              v-for="(item, i) in items"
              :key="i"
            )
              v-btn(
                v-bind="item.bind ? item.bind() : { href: item.href }"
                target="_blank"
              )
                v-icon.mr-2 {{ item.icon }}
                span.site-title {{ item.title }}
</template>

<script>
import ParticleNetwork from '@/components/ParticleNetwork'

const CODED_BASE = 'mvl.xvbCv@QbvZh.njb'
const CODED_KEY = 'FOvEh8C5JZ1kgux3AM4BL9SIfGd2zomQNKXVqscwyP0HparljbWRiTYetnUD67'

export default {
  components: {
    ParticleNetwork
  },

  data () {
    return {
      email: '',

      items: [
        {
          href: 'https://www.facebook.com/kazuyuki.namba',
          icon: 'fab fa-facebook-square',
          title: 'Facebook'
        },
        {
          href: 'https://www.messenger.com/t/kazuyuki.namba',
          icon: 'fab fa-facebook-messenger',
          title: 'Messenger'
        },
        {
          href: 'https://twitter.com/kulikala',
          icon: 'fab fa-twitter-square',
          title: 'Twitter'
        },
        {
          href: 'https://www.linkedin.com/in/kaznamba/',
          icon: 'fab fa-linkedin',
          title: 'LinkedIn'
        },
        {
          href: 'https://www.instagram.com/kazuyuki.namba/',
          icon: 'fab fa-instagram',
          title: 'Instagram'
        },
        {
          href: 'https://github.com/kulikala/',
          icon: 'fab fa-github-square',
          title: 'GitHub'
        },
        {
          href: 'https://qiita.com/kulikala',
          icon: 'code',
          title: 'Qiita'
        },
        {
          href: 'https://www.wantedly.com/users/25764',
          icon: 'account_circle',
          title: 'Wantedly'
        },
        {
          bind: () => ({
            href: `mailto:${this.email}`
          }),
          icon: 'email',
          title: 'Contact'
        }
      ]
    }
  },

  computed: {
    particleProps () {
      return {
        breakpoint: this.$vuetify.breakpoint.smAndUp,
        distance: 150,
        particleColor: '#a0a0a0',
        particleMovement: 'circular',
        particleRadius: () => Math.random() > 0.5 ? 3 : 1.5,
        speed: 'medium'
      }
    }
  },

  mounted () {
    const baseLen = CODED_BASE.length
    const keyLen = CODED_KEY.length

    this.email = CODED_BASE.split('').map((char) => {
      const idx = CODED_KEY.indexOf(char)

      if (idx === -1) {
        return char
      } else {
        return CODED_KEY.charAt((idx - baseLen + keyLen) % keyLen)
      }
    }).join('')
  }
}
</script>

<style lang="stylus">
.site-title
  min-width: 100px

.particle-network
  bottom: 0
  left: 0
  overflow: hidden
  position: fixed
  right: 0
  top: 0
</style>
