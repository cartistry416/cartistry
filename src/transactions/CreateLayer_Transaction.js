
import jsTPS_Transaction from '../common/jsTPS'
export default class CreateLayer_Transaction extends jsTPS_Transaction {
    constructor(initMap, initLayer, initFeatureGroupRef) {
        super();
        this.map = initMap
        this.layer = initLayer
        this.featureGroupRef = initFeatureGroupRef
    }
    doTransaction() {
        this.map.createLayerDo(this.layer, this.featureGroupRef)
    }
    
    undoTransaction() {
        this.map.createLayerUndo(this.layer, this.featureGroupRef)
    }
}

