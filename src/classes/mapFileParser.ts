import shp from 'shpjs';

interface MapParser {
    parse(data): Promise<any>
    readFile(file: File): void
}

class GeoJSONFileReader implements MapParser {
    constructor(private reader: FileReader) {
    }
    async parse(data: string): Promise<Object> {
        return JSON.parse(data)
    }
    readFile(file: any): void {
        this.reader.readAsText(file)
    }
}

class KMLFileReader implements MapParser {
    constructor(private reader: FileReader, private xmlParser: DOMParser = new DOMParser()) {

    }
    async parse(data: string): Promise<Document> {
        return this.xmlParser.parseFromString(data, 'text/xml')
    }
    readFile(file: File): void {
        this.reader.readAsText(file)
    }
}

class SHPFileReader implements MapParser {
    constructor(private reader: FileReader) {

    }
    async parse(data: ArrayBuffer): Promise<any>  {
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