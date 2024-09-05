import { Requests } from "../../network/requests";

class MapDatabase {
    constructor(name, entryModel) {
        this.name = name;
        this.entryModel = entryModel;
  
        this.store = {};
      }

    getEntry(key) {
        var entry;
        entry = this.store[key];

        if(!entry) {
            // TODO Ask the backend for the entry. If it also doest has, the entry was deleted.
        }

        return entry;
    }

    addEntry(entry) {
        // 
        return this.store[key];
    }    

}

class DatabaseController {
    // WIP: controls existing databases. Meant to be a singleton.
    constructor(height, width) {
      this.height = height;
      this.width = width;

    }
  }





