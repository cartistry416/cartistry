import { useContext, useState } from 'react'
import GlobalMapContext from '../../contexts/map';

function ImportModal({onClose}) {
  const { map } = useContext(GlobalMapContext);
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleImport = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      console.log('File to be sent: ', selectedFile);
      
      // TODO: upload map logic
      onClose();
    } else {
      alert('Please select a file to import.');
    }
  }

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalHeader">
          <h2>Import Map</h2>
          <button onClick={onClose} className="closeButton material-icons">cancel</button>
        </div>
        <div className="modalBody">
          <div className="uploadMapBox">
            <input type="file" id="file-upload" hidden onChange={handleFileChange}/>
            <label htmlFor="file-upload" className="uploadMapLabel">
              <span className="material-icons">upload</span>
              <div>Choose a file or Drag it here</div>
            </label>
          </div>
        </div>
        <div className="modalFooter">
          <button className="modalButton" onClick={handleImport}>Import</button>
        </div>
      </div>
    </div>
  );
}

export default ImportModal