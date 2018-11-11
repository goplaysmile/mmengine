const toCanvas = (map, [ chx, chy ], resolve) => {
  const canvas = document.createElement('canvas')
  const { width, height, layers } = require(`./assets/maps/${map}.json`)
  const ch = 8
  
  if (chx < 0
    || chx >= width/ch
    || chy < 0
    || chy >= height/ch
  ) return canvas /* consider mirroring layer-0 tiles outside boundaries */
  
  console.log(`requesting chunk ${[chx, chy]}`)

  const img = new Image()
  img.src = require('./assets/tiles/0.png')
  img.onload = () => {
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    // ctx.clearRect(0, 0, canvas.width, canvas.height)

    const visible = layers.filter(({ visible }) => visible)

    for (const { data, name } of visible) {
      if (name.toLowerCase().includes('(*)')) console.log(`${name} => ENTITY`)
      
      for (let y=0; y<ch; y++) {
        for (let x=0; x<ch; x++) {

          const t = (data[(chy*width*ch + y*width) + (chx*ch + x)]-1)
          const tx = t % (img.width/32)
          const ty = ~~(t / (img.width/32))
          
          ctx.drawImage(img, tx*32, ty*32, 32, 32, x*32, y*32, 32, 32)
        }
      }
    }

    resolve(canvas)
  }
  
  return canvas
}

export { toCanvas }
