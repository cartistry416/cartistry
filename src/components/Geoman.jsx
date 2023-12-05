import { useEffect, useContext } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import GlobalMapContext from '../contexts/map'

const Geoman = () => {
  const context = useLeafletContext();
  const globalMap = useContext(GlobalMapContext); // access the global map context

  useEffect(() => {
    const leafletContainer = context.map;

    leafletContainer.pm.addControls({
    });

    leafletContainer.pm.setGlobalOptions({ pmIgnore: true });

    leafletContainer.on("pm:create", (e) => {
      if (e.layer && e.layer.pm) {
        const shape = e;
        console.log(e);

        // enable editing of circle
        shape.layer.pm.enable();

        console.log(`object created: ${shape.layer.pm.getShape()}`);
        // console.log(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        // leafletContainer.pm
        //   .getGeomanLayers(true)
        //   .bindPopup("i am whole")
        //   .openPopup();
        // leafletContainer.pm
        //   .getGeomanLayers()
        //   .map((layer, index) => layer.bindPopup(`I am figure N° ${index}`));
        shape.layer.on("pm:edit", (e) => {
          const event = e;
          console.log("placed");
          // console.log(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        });
      }
    });

    leafletContainer.on("pm:remove", (e) => {
      console.log("object removed");
      // console.log(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
    });

    return () => {
      leafletContainer.pm.removeControls();
      leafletContainer.pm.setGlobalOptions({ pmIgnore: true });
    };
  }, [context]);

  return null;
};

export default Geoman;
