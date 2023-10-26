import shp from 'shpjs';
import * as tj from "@mapbox/togeojson";

interface MapParser {
    parse(data: string | ArrayBuffer): Promise<Object>
    readFile(file: File): void
}

class GeoJSONFileReader implements MapParser {
    constructor(private reader: FileReader) {
    }
    async parse(data: string): Promise<Object> {
        return JSON.parse(data)
    }
    readFile(file: File): void {
        this.reader.readAsText(file)
        
    }
}

class KMLFileReader implements MapParser {
    constructor(private reader: FileReader, private xmlParser: DOMParser = new DOMParser()) {

    }
    async parse(data: string): Promise<Object> {
        return tj.kml(this.xmlParser.parseFromString(data, 'text/xml'))
    }
    readFile(file: File): void {
        this.reader.readAsText(file)
    }
}

class SHPFileReader implements MapParser {
    constructor(private reader: FileReader) {

    }
    async parse(data: ArrayBuffer): Promise<Object>  {
        return await shp.parseZip(data)
    }
    readFile(file: File): void {
        this.reader.readAsArrayBuffer(file)
    }
}

export default function MapFileParserFactory(fileExtension: string, reader: FileReader): MapParser | null {

    if (fileExtension === "json") {
        return new GeoJSONFileReader(reader)
    }
    else if (fileExtension === "kml") {
        return new KMLFileReader(reader)
    }
    else if (fileExtension === "zip") {
        return new SHPFileReader(reader)
    }

    return null
  
  }