import { useMap } from "react-leaflet";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

export default function Geoman({toggleBindPopup,handleLayerCreate, handleLayerUpdate, 
  handleLayerCut, handleLayerRemove, handleLayerRotate}) {
  const map = useMap();


  map.pm.addControls();
  map.on('pm:globaleditmodetoggled', e => toggleBindPopup(e.enabled, map))
  map.on('pm:globaldrawmodetoggled', e => toggleBindPopup(e.enabled, map))
  map.on('pm:globalcutmodetoggled', e => toggleBindPopup(e.enabled, map))
  map.on('pm:globalremovalmodetoggled', e => toggleBindPopup(e.enabled, map))
  map.on('pm:globalrotatemodetoggled', e => toggleBindPopup(e.enabled, map))


  map.on('pm:create', handleLayerCreate)
  map.on('pm:update', handleLayerUpdate)
  map.on('pm:remove', handleLayerRemove)
  map.on('pm:cut', handleLayerCut)

  map.on('pm:rotate', handleLayerRotate)

}