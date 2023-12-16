
import jsTPS_Transaction from '../common/jsTPS'
export default class CutLayer_Transaction extends jsTPS_Transaction {
    constructor(initMap, initBeforeLayer, initAfterLayer, initFeatureGroupRef, mapRef) {
        super();
        this.map = initMap
        this.beforeLayer = initBeforeLayer
        this.afterLayer = initAfterLayer
        this.featureGroupRef = initFeatureGroupRef
        this.mapRef = mapRef
    }
    doTransaction() {
        this.map.cutLayerDo(this.beforeLayer, this.afterLayer, this.featureGroupRef, this.mapRef)
    }
    
    undoTransaction() {
        this.map.cutLayerUndo(this.beforeLayer, this.afterLayer, this.featureGroupRef, this.mapRef)
    }
}

