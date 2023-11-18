import jsTPS from "../common/jsTPS"

export default class EditFeature_Transaction extends jsTPS_Transaction {

    constructor(initStore, initIndex, initOldProps, initNewProp) {
        super();
    }
    doTransaction() {
        this.store.updateSong(this.index, this.newSongData);
    }
    
    undoTransaction() {
        this.store.updateSong(this.index, this.oldSongData);
    }

    
}