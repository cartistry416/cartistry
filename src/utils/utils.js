
import {create as createDiffPatcher} from 'jsondiffpatch'
import JSZip from 'jszip';

async function unzipBlobToJSON(blob) {
    const zip = await JSZip.loadAsync(zipFile);
    const [firstFileName] = Object.keys(zip.files);
    try {
        if (firstFileName) {
            let content = await zip.file(firstFileName).async('uint8array')
            content = new TextDecoder().decode(content)
            return JSON.parse(content)
          }
    }
    catch (err) {
        console.error(err)
        return null
    }
}

async function jsonToZip(obj) {
    const zip = new JSZip()
    zip.file('geoJSON.json', JSON.stringify(obj));
    return await zip.generateAsync({type: 'blob', mimeType:'application/zip', compressionOptions:{level: 9}})
}

function generateDiff(originalGeoJSON, editedGeoJSON) {
    const diffPatcher = createDiffPatcher({
        objectHash: function(obj, index) {
            if (obj.properties !== undefined) {
                return JSON.stringify(obj.properties)
            }
            return '$$index:' + index;
        }
    })
    return diffPatcher.diff(originalGeoJSON, editedGeoJSON)
}

export {generateDiff, unzipBlobToJSON, jsonToZip}

// // TODO MOVE THESE TO APPROPRIATE PLACES LATER

// // <input type="file" id="geojsonFile" accept="*" onChange={handleFileUpload} />
// const handleFileUpload = (event) => {
//     const file = event.target.files[0]
//     if (!file) {
//       console.error("No file uploaded?")
//       return 
//     }

//     const ext = file.name.split('.').pop().toLowerCase()

//     const formData = new FormData()
//     if (ext === ".json" || ext === ".kml") {

//       const zip = new JSZip()
//       zip.file(file.name, file)

//       zip.generateAsync({type: 'blob'}).then(blob => {
//         formData.append('zipFile', blob)
//         formData.append('json', JSON.stringify({fileExtension: ext}))
//         api.uploadMap(formData)
//       })

//     }
//     else if (ext === ".zip") {
//       formData.append('zipFile', file)
//       formData.append('json', JSON.stringify({fileExtension: ext}))
//       api.uploadMap(formData)
//     }
//     else {
//       console.error("Unsupported file extension: " + ext)
//       return
//     }
//   }