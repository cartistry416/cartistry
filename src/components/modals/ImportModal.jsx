import { useContext, useState } from "react";
import GlobalMapContext from "../../contexts/map";

import JSZip from 'jszip';
import { useNavigate } from "react-router";

function ImportModal({onClose, templateType}) {
  const { map } = useContext(GlobalMapContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImport = async () => {
    setLoading(true)
    if (selectedFile) {
      //console.log('File to be sent: ', selectedFile);
      const ext = selectedFile.name.split('.').pop().toLowerCase()

      let blob = selectedFile;
      if (ext === "json" || ext === "kml") {
  
        const zip = new JSZip()
        zip.file(selectedFile.name, selectedFile)
  
        blob = await zip.generateAsync({type: 'blob'})
      }
      else if (ext !== "zip") {
        setLoading(false)
        console.error("Unsupported file extension: " + ext)
        return
      }
  
      const response = await map.uploadMap(selectedFile.name, ext, templateType, blob)

      setLoading(false)
      // console.log("Success after upload: " + res)
      onClose();
      if (response) {
        await map.loadMap(response.data.mapMetadata._id)
        navigate(`/editMap/${response.data.mapMetadata._id}`)
      }
    } else {
      alert("Please select a file to import.");
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalHeader">
          <h2>Import Map</h2>
          <button onClick={onClose} className="closeButton material-icons">
            cancel
          </button>
        </div>
        <div className="modalBody">
          <div className="uploadMapBox">
            <input
              type="file"
              id="file-upload"
              hidden
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="uploadMapLabel">
              <span className="material-icons">upload</span>
              {!selectedFile ? (<div>Choose a file</div>) : (<div>Ready to Upload {selectedFile.name}</div>)}
            </label>
          </div>
        </div>
        <div className="modalFooter">
          <button className="authAltButton" onClick={onClose}>Cancel</button>
          <button className="modalButton" onClick={handleImport} disabled={loading}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportModal;
