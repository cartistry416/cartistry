import { UserModel, UserDocument } from '../models/user-model'; // Import the User model and UserDocument
import { PostModel, PostDocument } from '../models/post-model'; // Import the Post model and PostDocument
import { MapMetadataModel, MapMetadataDocument } from '../models/mapMetadata-model'; // Import the MapMetadata model and MapMetadataDocument
import { Types } from 'mongoose';

const uploadMap = async (req, res) => {

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