
import {create as createDiffPatcher} from 'jsondiffpatch'
import JSZip from 'jszip';
import * as L from "leaflet";

async function unzipBlobToJSON(blob) {
    const zip = await JSZip.loadAsync(blob);
    const [firstFileName] = Object.keys(zip.files);
    try {
        if (firstFileName) {
            let content = await zip.file(firstFileName).async('uint8array')
            content = new TextDecoder('utf-8').decode(content)
            return {currentGeoJSON: JSON.parse(content), originalGeoJSON: JSON.parse(content)}
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

function getImage({ imageData }) {
  if (!imageData) {
    return null;
  }

  const blob = new Blob([imageData], { type: String });

  const imageUrl = URL.createObjectURL(blob);

  return  imageUrl;
}

function formatDate(dateStr) {
  const options = { month: 'long', day: 'numeric' };
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', options);
}

function getAllTags() {
  const tags = [
    "Bin Map",
    "Heat Map",
    "Subway Map",
    "Cadastral Map",
    "Landmark Map",
    "Austrailia",
    "Antartica",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
  ]
  return tags.sort()
}


function deepCopyLayer(originalLayer) {
  let newLayer;

  if (originalLayer instanceof L.Marker) {
      newLayer = L.marker(originalLayer.getLatLng(), { ...originalLayer.options, pmIgnore: false });
  } else if (originalLayer instanceof L.Polyline) {
      newLayer = L.polyline(originalLayer.getLatLngs(), { ...originalLayer.options, pmIgnore: false });
  } else if (originalLayer instanceof L.Polygon) {
      newLayer = L.polygon(originalLayer.getLatLngs(), { ...originalLayer.options, pmIgnore: false });
  }


  return newLayer;
}

export {generateDiff, unzipBlobToJSON, jsonToZip, getImage, formatDate, getAllTags, deepCopyLayer}
