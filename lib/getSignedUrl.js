import { signedUrlFunction } from '../endpoints.json'

const getSignedUrl = async ({ files }) => {
  console.log(files)
  try {
    const parsedData = files.map(file => {
      return {
        path: `${file.folder}/${file.name}`,
        fileType: file.type,
      }
    })  
    const response = await fetch(signedUrlFunction, {
      method: 'POST',
      body: JSON.stringify({ files: parsedData }),
      headers: {'Content-Type': 'application/json'}
    });
    console.log(parsedData)
    const { signedUrls } = await response.json();
  
    return signedUrls;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getSignedUrl