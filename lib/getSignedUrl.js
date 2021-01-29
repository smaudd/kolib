import { signedUrlFunction } from '../endpoints.json'

const getSignedUrl = async (file) => {

  try {
    const body = {
      fileName: file.name,
      fileType: file.type,
    }
  
    const response = await fetch(signedUrlFunction, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    const {signedUrl} = await response.json()
  
    return signedUrl
  } catch (err) {
    console.log(err)
    return false
  }
}

export default getSignedUrl