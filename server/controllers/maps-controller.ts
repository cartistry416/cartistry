import { UserModel, UserDocument } from '../models/user-model'; // Import the User model and UserDocument
import { PostModel, PostDocument } from '../models/post-model'; // Import the Post model and PostDocument
import { MapMetadataModel, MapMetadataDocument } from '../models/mapMetadata-model'; // Import the MapMetadata model and MapMetadataDocument
import { Types } from 'mongoose';
import * as shp from 'shpjs';
import * as tj from '@mapbox/togeojson';
const DOMParser = require('xmldom').DOMParser;
const AdmZip = require('adm-zip');

const uploadMap = async (req, res) => {

    const body = req.body
    if (!body || !body.zipFile || !body.fileExtension) {
        return res.status(400).json({sucess: false, errorMessage: "Body is missing required data"})
    }

    let geoJSON;
    if (body.fileExtension === '.shp') {
        const zipFileBuffer = body.zipFile as Buffer
        geoJSON = await shp.parseZip(zipFileBuffer)
 
    }
    else if (body.fileExtension === '.json') {
        const zipFileBuffer = body.zipFile as Buffer
        const zip = new AdmZip(zipFileBuffer)

        const zipEntries = zip.getEntries();
        if (zipEntries.length !== 1) {
        return res.status(400).send('Expected one file in the zip archive.');
        }
        const zipEntry = zipEntries[0].getData().toString()
        geoJSON = JSON.parse(zipEntry)

    }
    else if (body.fileExtension === '.kml') {
        const zipFileBuffer = body.zipFile as Buffer
        const zip = new AdmZip(zipFileBuffer)

        const zipEntries = zip.getEntries();
        if (zipEntries.length !== 1) {
        return res.status(400).send('Expected one file in the zip archive.');
        }
        const zipEntry = zipEntries[0].getData.toString()
        const xmlParser = new DOMParser()
        const kml = xmlParser.parseFromString(zipEntry, 'text/xml')
        geoJSON = tj.kml(kml)

    }
    else {
        return res.status(400).json({sucess: false, errorMessage: "Unsupported file extension!"})
    }


    
    
}


const forkMap = async (req, res) => {
    
}

const exportMap = async (req, res) => {
    
}
const getMapMetadataOwnedByUser = async (req, res) => {
    
}
const getPublicMapMetadataOwnedByUser = async (req, res) => {
    
}
const getMapData = async (req, res) => {
    
}
const updateMapPrivacy = async (req, res) => {
    
}
const saveMapEdits = async (req, res) => {
    
}
const publishMap = async (req, res) => {
    
}



const favoriteMap = async (req, res) => {
    
}
const renameMap = async (req, res) => {
    
}

const deleteMap = async (req, res) => {
    
}

module.exports = {
    uploadMap,
    renameMap,
    forkMap,
    exportMap,
    favoriteMap,
    deleteMap,
    updateMapPrivacy,
    saveMapEdits,
    publishMap,
    getMapMetadataOwnedByUser,
    getPublicMapMetadataOwnedByUser,
    getMapData
}