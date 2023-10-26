/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const MapsController = require('../controllers/map-controller')
const router = express.Router()
const auth = require('../auth')


router.get('/maps/:id/export', MapsController.exportMap)
router.get('/maps/map-metadata/:userId', auth.verify, MapsController.getMapMetadataOwnedByUser)
router.get('/maps/public-map-metadata/:userId/', MapsController.getPublicMapMetadataOwnedByUser)
router.get('/maps/:id', auth.verify, MapsController.getMapData)


router.post('/maps/:id/upload', auth.verify, MapsController.uploadMap)
router.post('/maps/:id/fork', auth.verify, MapsController.forkMap)
router.post('/maps/:id/publish', auth.verify, MapsController.publishMap)



router.put('/maps/:id/favorite', auth.verify, favoriteMap)
router.put('/maps/:id/rename', auth.verify, MapsController.renameMap)

router.delete('/maps/:id', auth.verify, MapsController.deleteMap)





module.exports = router