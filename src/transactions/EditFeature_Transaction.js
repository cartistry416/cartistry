import jsTPS from "../common/jsTPS"
import jsTPS_Transaction from '../common/jsTPS'


export default class EditFeature_Transaction extends jsTPS_Transaction {

    constructor(initMap, initIndex, initOldProps, initNewProps) {
        super();
        this.map = initMap
        this.index = initIndex
        this.oldProps = initOldProps
        this.newProps = initNewProps
    }
    doTransaction() {
        this.map.editFeatureProperties(this.newProps, this.index)
    }
    
    undoTransaction() {
        this.map.editFeatureProperties(this.oldProps, this.index)
    }

    
}