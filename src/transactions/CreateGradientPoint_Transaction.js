
import jsTPS_Transaction from '../common/jsTPS'
export default class CreateGradientPoint_Transaction extends jsTPS_Transaction {
    constructor(lat, lng, addDataPointToHeatmap, popDataFromHeatMap) {
        super();
        this.lat = lat
        this.lng = lng
        this.addDataPointToHeatmap = addDataPointToHeatmap
        this.popDataFromHeatMap = popDataFromHeatMap


    }
    doTransaction() {
        this.addDataPointToHeatmap(this.lat, this.lng)
    }
    
    undoTransaction() {
        this.popDataFromHeatMap()
    }
}

