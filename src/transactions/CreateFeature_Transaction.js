import jsTPS from "../common/jsTPS"

export default class CreateFeature_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initSong) {
        super();
    }

    doTransaction() {
        this.store.updateSong(this.index, this.newSongData);
    }
    
    undoTransaction() {
        this.store.updateSong(this.index, this.oldSongData);
    }
}
