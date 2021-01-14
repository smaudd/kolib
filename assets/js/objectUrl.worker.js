self.addEventListener('message', (event) => {
  console.log(event.data.file.name)
  const objectURL = URL.createObjectURL(event.data.file)
  self.postMessage({ index: event.data.index, objectURL, file: event.data.file, length: event.data.length })
})