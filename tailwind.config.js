module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#DB5375',
        secondary: '#FFFFFF',
        davys: '#595959ff',
        web: '#7f7f7fff',
        quicksilver: '#a5a5a5ff',
        light: '#ccccccff',
        cultured: '#f2f2f2ff',
        ryb: '#FF101F',
        melon: '#FFBFB7',
        granny: '#88D18A',
      },
      maxWidth: {
        'xs': '375px',
      },
      minHeight: {
        'screen': '100vh',
      },
      maxHeight: {
        '566px': '566px',
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      opacity: ['active'],
      border: ['hover']
    }
  },
}