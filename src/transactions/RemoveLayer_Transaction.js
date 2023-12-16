import jsTPS from "../common/jsTPS"
import jsTPS_Transaction from '../common/jsTPS'

export default class RemoveLayer_Transaction extends jsTPS_Transaction {
    constructor(initMap, initLayer, initFeatureGroupRef) {
        super();
        this.map = initMap
        this.layer = initLayer
        this.featureGroupRef = initFeatureGroupRef
    }
    doTransaction() {
        this.map.deleteLayerDo(this.layer, this.featureGroupRef);
    }
    
    undoTransaction() {
        this.map.deleteLayerUndo(this.layer, this.featureGroupRef);
    }
}