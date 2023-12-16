
import jsTPS_Transaction from '../common/jsTPS'
export default class UpdateLayerLatLngs_Transaction extends jsTPS_Transaction {
    constructor(initMap, initLayer, initFeatureGroupRef, initOldLatLngs, initNewLatLngs) {
        super();
        this.map = initMap
        this.layer = initLayer
        this.featureGroupRef = initFeatureGroupRef
        this.oldLatLngs = initOldLatLngs
        this.newLatLngs = initNewLatLngs
    }
    doTransaction() {
        this.map.updateLayerLatLngs(this.layer, this.featureGroupRef, this.newLatLngs)
    }
    
    undoTransaction() {
        this.map.updateLayerLatLngs(this.layer, this.featureGroupRef, this.oldLatLngs)
    }
}

