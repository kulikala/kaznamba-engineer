<script>
function isNumber (value) {
  return typeof value === 'number'
}

function isFunction (value) {
  return typeof value === 'function'
}

function valueOf (expression) {
  return typeof expression === 'function' ? expression() : expression
}

export default {
  name: 'ParticleNetwork',

  props: {
    breakpoint: {
      type: Boolean,
      default: true
    },
    density: {
      type: [String, Number],
      default: 'medium', // 10000
      validator: value => isNumber(value) || ['low', 'medium', 'high'].includes(value)
    },
    distance: {
      type: Number,
      default: 120,
      validator: value => value > 0
    },
    interactive: {
      type: Boolean,
      default: true
    },
    particleAlpha: {
      type: [Number, Function],
      default: 0.7,
      validator: value => isFunction(value) || (value > 0 && value <= 1)
    },
    particleColor: {
      type: [String, Function],
      default: '#ffffff',
      validator: value => isFunction(value) || /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value)
    },
    particleMovement: {
      type: String,
      default: 'linear',
      validator: value => ['linear', 'circular', 'random'].includes(value)
    },
    particleRadius: {
      type: [Number, Function],
      default: 1.5,
      validator: value => isFunction(value) || value > 0
    },
    speed: {
      type: [String, Number],
      default: 'medium',
      validator: value => (isNumber(value) && value >= 0) || ['none', 'slow', 'medium', 'fast'].includes(value)
    }
  },

  mounted () {
    if (this.breakpoint) {
      this.init()
    }
  },

  beforeDestroy () {
    this.clean()
  },

  methods: {
    init () {
      this.setVelocity(this.speed)
      this.setDensity(this.density)

      this.renderBg(this.$el)
      this.renderCanvas(this.$el)

      this.ctx = this.canvas.getContext('2d')
      this.listeningEvents = {}

      this.updateSize()
      this.renderParticles()
      this.listenEvents()

      this.startTimer()
    },

    setVelocity (speed) {
      // Default: medium
      let velocity = 0.66

      switch (speed) {
        case 'fast':
          velocity = 1
          break
        case 'slow':
          velocity = 0.33
          break
        case 'none':
          velocity = 0
          break
        default:
          if (typeof speed === 'number' && speed >= 0) {
            velocity = speed
          }
      }

      this.velocity = velocity
    },

    setDensity (density) {
      // Default: medium
      let densityVal = 10000

      switch (density) {
        case 'high':
          densityVal = 5000
          break

        case 'low':
          densityVal = 20000
          break

        default:
          densityVal = parseInt(density, 10)

          if (isNaN(densityVal)) {
            densityVal = 10000
          }
      }

      this.densityVal = densityVal
    },

    renderBg (root) {
      const el = document.createElement('div')

      el.className = 'particle-network__background'

      this.bg = el
      root.appendChild(el)
    },

    renderCanvas (root) {
      const el = document.createElement('canvas')

      el.className = 'particle-network__canvas'

      this.canvas = el
      root.appendChild(el)
    },

    updateSize () {
      if (this.canvasSize && this.canvasSize.height === this.$el.offsetHeight && this.canvasSize.width === this.$el.offsetWidth) {
        return false
      }

      this.canvasSize = {
        height: this.$el.offsetHeight,
        width: this.$el.offsetWidth
      }

      this.canvas.height = this.canvasSize.height
      this.canvas.width = this.canvasSize.width

      return true
    },

    renderParticles () {
      this.particles = []

      for (let i = 0; i < this.canvas.width * this.canvas.height / this.densityVal; i++) {
        this.particles.push(new Particle(this))
      }

      this.renderMouseParticle()
    },

    renderMouseParticle () {
      if (!this.interactive || this.mouseParticle) {
        return
      }

      // Add mouse particle if interactive
      this.mouseParticle = new Particle(this)
      this.mouseParticle.velocity = {
        x: 0,
        y: 0
      }

      this.particles.push(this.mouseParticle)
    },

    listenEvents () {
      if (this.interactive && !this.listeningEvents.mouse) {
        // Mouse event listeners
        this.canvas.addEventListener('mousemove', this.onMouseMove)
        this.canvas.addEventListener('mouseup', this.onMouseUp)

        this.listeningEvents.mouse = true
      }

      if (!this.listeningEvents.resize) {
        // Add resize listener to canvas
        window.addEventListener('resize', this.onWindowResize)

        this.listeningEvents.resize = true
      }
    },

    removeEvents () {
      if (this.listeningEvents.mouse) {
        this.canvas.removeEventListener('mousemove', this.onMouseMove)
        this.canvas.removeEventListener('mouseup', this.onMouseUp)

        this.listeningEvents.mouse = false
      }

      if (this.listeningEvents.resize) {
        window.removeEventListener('resize', this.onWindowResize)

        this.listeningEvents.resize = false
      }
    },

    onMouseMove (e) {
      this.mouseParticle.x = e.clientX - this.canvas.offsetLeft
      this.mouseParticle.y = e.clientY - this.canvas.offsetTop
    },

    onMouseUp (e) {
      // Release current mouseParticle
      this.mouseParticle.velocity = {
        x: (Math.random() - 0.5) * this.velocity,
        y: (Math.random() - 0.5) * this.velocity
      }
      this.mouseParticle = null

      this.renderMouseParticle()
    },

    onWindowResize (e) {
      clearTimeout(this.resizeTimer)

      this.resizeTimer = setTimeout(this.resizeCanvas, 500)
    },

    resizeCanvas () {
      if (!this.updateSize()) {
        return
      }

      this.renderParticles()
      this.restartTimer()
    },

    startTimer () {
      this.updateTimer = requestAnimationFrame(this.update)
    },

    cancelTimer () {
      cancelAnimationFrame(this.updateTimer)
    },

    restartTimer () {
      this.cancelTimer()

      if (this.velocity > 0) {
        this.startTimer()
      }
    },

    update () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.globalAlpha = 1

      // Draw particles
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update()
        this.particles[i].draw()

        // Draw connections
        for (let j = this.particles.length - 1; j > i; j--) {
          const distance = Math.sqrt(
            Math.pow(this.particles[i].x - this.particles[j].x, 2) +
            Math.pow(this.particles[i].y - this.particles[j].y, 2)
          )
          if (distance > this.distance) {
            continue
          }

          this.ctx.beginPath()
          this.ctx.strokeStyle = this.particleColor
          this.ctx.globalAlpha = (this.distance - distance) / this.distance
          this.ctx.lineWidth = 0.7
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.stroke()
        }
      }

      this.restartTimer()
    },

    clean () {
      if (!this.listeningEvents) {
        return
      }

      this.cancelTimer()
      this.removeEvents()
      this.particles = []
      this.mouseParticle = null
      this.ctx = null
      this.bg = null
      this.canvas = null
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'particle-network'
    })
  }
}

class Particle {
  constructor (parent) {
    this.canvas = parent.canvas
    this.ctx = parent.ctx
    this.particleColor = valueOf(parent.particleColor)
    this.particleAlpha = valueOf(parent.particleAlpha)
    this.particleMovement = parent.particleMovement
    this.particleRadius = valueOf(parent.particleRadius)

    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.velocity = {
      x: (Math.random() - 0.5) * parent.velocity,
      y: (Math.random() - 0.5) * parent.velocity
    }
    this.step = 0

    if (this.particleMovement === 'circular') {
      this.radius = Math.min(this.canvas.width, this.canvas.height) * Math.random()
    }
  }

  update () {
    this.step++

    // Change dir if outside map
    if (this.x > this.canvas.width + 20 || this.x < -20) {
      this.velocity.x *= -1
    }
    if (this.y > this.canvas.height + 20 || this.y < -20) {
      this.velocity.y *= -1
    }

    // Update position
    switch (this.particleMovement) {
      case 'random':
        this.x += Math.random() * this.velocity.x
        this.y += Math.random() * this.velocity.y
        break

      case 'circular':
        const theta = this.velocity.x + this.step * this.velocity.y / 100
        const thetaNext = this.velocity.x + (this.step + 1) * this.velocity.y / 100

        this.x += this.radius * (Math.cos(thetaNext) - Math.cos(theta))
        this.y += this.radius * (Math.sin(thetaNext) - Math.sin(theta))
        break

      case 'linear':
      default:
        this.x += this.velocity.x
        this.y += this.velocity.y
        break
    }
  }

  draw () {
    // Draw particle
    this.ctx.beginPath()
    this.ctx.fillStyle = this.particleColor
    this.ctx.globalAlpha = this.particleAlpha
    this.ctx.arc(this.x, this.y, this.particleRadius, 0, 2 * Math.PI)
    this.ctx.fill()
  }
}
</script>

<style lang="stylus">
.particle-network
  position: relative

  .particle-network__background
    bottom: 0
    left: 0
    position: absolute
    right: 0
    top: 0

  .particle-network__canvas
    position: relative
</style>
