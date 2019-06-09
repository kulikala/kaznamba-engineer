export default {
  theme (state, val) {
    const isValid = [
      'dark', 'light'
    ].includes(val)

    if (isValid) {
      state.theme = val
    }
  }
}
