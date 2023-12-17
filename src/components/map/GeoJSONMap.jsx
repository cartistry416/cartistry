// eslint-disable-next-line
import GlobalMapContext from "../../contexts/map";
import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Circle,
  CircleMarker,
  Marker,
  LayerGroup
} from "react-leaflet";

// import Geoman  from './Geoman';

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as ReactDOM from "react-dom/client";

import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls, layerEvents } from "react-leaflet-geoman-v2";
import EditFeaturePopup from "./EditFeaturePopup";
import 'leaflet-choropleth';
import { matchPath } from "react-router";

function getNameFromConvertedShapeFile(properties) {
  let keyBase = "NAME_";

  for (let i = 3; i >= 0; i--) {
    const key = `${keyBase}${i}`;
    if (key in properties) {
      return properties[key];
    }
  }
  return "MISSING_NAME";
}

// https://react-leaflet.js.org/docs/example-popup-marker/
// https://github.com/CodingWith-Adam/geoJson-map-with-react-leaflet/blob/master/src/components/MyMap.jsx
// https://github.com/alex3165/react-leaflet-draw/blob/7963cfee5ea7f0c85bd294251fa0e150c59641a7/examples/class/edit-control.js
// https://stackoverflow.com/questions/73353506/extracting-values-from-html-forms-rendered-in-react-leaflet-popup

function GeoJSONMap({
  mapMetadataId,
  position,
  editEnabled,
  width,
  height,
  setMapRef,
  mapRef,
  currentMarkerIcon,
  featureGroupRef
}) {
  const { map } = useContext(GlobalMapContext);


  const [originalLatLngs, setOriginalLatLngs] = useState(null);
  const [initialGeomanLayersLoaded, setInitialGeomanLayersLoaded] = useState(false)

  const originalLatLngsRef = useRef(null);

  useEffect(() => {}, [mapRef]);

  useEffect(() => {
    // console.log(currentMarkerIcon)
  }, [currentMarkerIcon]);

  useEffect(() => {
    originalLatLngsRef.current = originalLatLngs;
  }, [originalLatLngs]);


  const loadOriginalLayers = () => {
    if (!map.originalLayersGeoJSON || !map.originalLayersGeoJSON.length) {
      return null
    }
    let layers
    if (map.currentMapProprietaryJSON.templateType !== "heat") {
      layers = map.originalLayersGeoJSON.map((layerGeoJSON, index)=> {
        const type = layerGeoJSON.properties.layerType
        let layer
        if (type === "circle") {
          // layer = L.circle([layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]], layerGeoJSON.properties.options)
          layer = <Circle 
            key={index}
            center={[layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]]}
            radius={layer.properties.options.radius}
            pathOptions={ {...layer.GeoJSON.properties.options} }
          />
        }
        else if (type === "circleMarker") {
          // layer = L.circleMarker([layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]], layerGeoJSON.properties.options)
          layer = <CircleMarker 
            key={index}
            center={[layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]]}
            radius={layer.properties.options.radius}
            pathOptions={ {...layer.GeoJSON.properties.options} }
            />
        }
        else if (type === "marker") {
          const icon = L.divIcon(layerGeoJSON.properties.options)
          // layer = L.marker([layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]], { icon })
          layer = <Marker position={[layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]]}
                          icon={icon}/>
        }
        else {
          // layer = L.geoJSON(layerGeoJSON, {pmIgnore: false, style: feature => feature.properties.option})
          layer = <GeoJSON data={layerGeoJSON} pmIgnore={false} style={feature => feature.properties.option} />
        }
        // console.log(layer)
        // if (editEnabled) {
        //   layerEvents(layer, {
        //     onUpdate: handleLayerUpdate,
        //     onLayerRemove: handleLayerRemove,
        //     onCreate: handleLayerCreate,
        //     onDragStart: handleDragStart,
        //     onMarkerDragStart: handleMarkerDragStart,
        //     onLayerRotateStart: handleLayerRotateStart
        //   }, 'on');
        // }
        return layer

      })
    }
    else {
      const choroplethOptions = {
        valueProperty: 'density', // TODO: find a way to automatically detect valueProperty
        scale: map.heatColors, 
        steps: map.numHeatSections,
        mode: 'q',
        style: {
          color: '#fff',
          weight: 2,
          fillOpacity: 0.8
        }
      }
    layers = (<LayerGroup>
      <GeoJSON
        data={map.currentMapGeoJSON}
        style={(feature) => {
          const value = feature.properties[choroplethOptions.valueProperty];
          const color = choroplethOptions.scale[
            Math.floor((value - choroplethOptions.min) / choroplethOptions.step)
          ];
          return { ...choroplethOptions.style, fillColor: color };
        }}
        onEachFeature = { function(feature, layer) {
            layer.on({
              click: chroroClick
            }); 
          }
        }
      />
    </LayerGroup>)
      // layers = L.choropleth(map.currentMapGeoJSON, choroplethOptions,
      //   onEachFeature: function(feature, layer) {
      //     layer.on({
      //       click: chroroClick
      //     }); 
      //     }
      //   )};

      // if (editEnabled) {
      //     layerEvents(layers, {
      //       onUpdate: handleLayerUpdate,
      //       onLayerRemove: handleLayerRemove,
      //       onCreate: handleLayerCreate,
      //       onDragStart: handleDragStart,
      //       onMarkerDragStart: handleMarkerDragStart,
      //       onLayerRotateStart: handleLayerRotateStart
      //     }, 'on');
      //   }
    }

    return layers
      
  }


  
  // useEffect(() => {
  //   if (!featureGroupRef || !featureGroupRef.current) {
  //     console.log(featureGroupRef)
  //     return
  //   }

  //   if (map.originalLayersGeoJSON && map.currentMapProprietaryJSON.templateType !== "heat") {
  //   }
  // }, [])


  // useEffect(() => {

  //   if (!featureGroupRef || !featureGroupRef) {
  //     console.log(featureGroupRef)
  //     return
  //   }
  //   if (map.currentMapProprietaryJSON.templateType === "heat") {
  //     if ( featureGroupRef.current && map.currentMapGeoJSON) {
  //       const choroplethLayer = L.choropleth(map.currentMapGeoJSON, {
  //         valueProperty: 'density', // TODO: find a way to automatically detect valueProperty
  //         scale: map.heatColors, 
  //         steps: map.numHeatSections,
  //         mode: 'q',
  //         style: {
  //           color: '#fff',
  //           weight: 2,
  //           fillOpacity: 0.8
  //         },
  //         onEachFeature: function(feature, layer) {
  //           layer.on({
  //             click: chroroClick
  //           }); 
  //         }
  //       });
  
  //       layerEvents(choroplethLayer, {
  //         onUpdate: handleLayerUpdate,
  //         onLayerRemove: handleLayerRemove,
  //         onCreate: handleLayerCreate,
  //         onDragStart: handleDragStart,
  //         onMarkerDragStart: handleMarkerDragStart,
  //         onLayerRotateStart: handleLayerRotateStart
  //       }, 'on');
  
  //       featureGroupRef.current.addLayer(choroplethLayer);
  //     }
  //   }
  // }, []);  
  function chroroClick(e){
    var layer = e.target;
    layer.bindPopup("Density: " + layer.feature.properties.density)
  }


  const onEachFeature = (feature, layer) => {
    const idx = map.currentMapGeoJSON.features.indexOf(feature);

    if (!feature.properties.name) {
      feature.properties.name = getNameFromConvertedShapeFile(
        feature.properties
      );
    }
    layer.bindTooltip(feature.properties.name, {
      permanent: true,
      direction: "center",
    });
    layer.bindPopup(renderPopupForm(feature, idx, layer, map.currentMapProprietaryJSON.templateType));
  };

  const renderPopupForm = (feature, idx, layer, templateType) => {
    const popup = L.popup();
    const container = L.DomUtil.create("div");
    popup.setContent(container);
    const root = ReactDOM.createRoot(container);
    root.render(
      <EditFeaturePopup
        feature={feature}
        idx={idx}
        handlePopupSubmit={handlePopupSubmit}
        layer={layer}
        templateType={templateType}
      >
        {" "}
      </EditFeaturePopup>
    );
    return popup;
  };

  const handlePopupSubmit = (e, feature, idx, layer) => {
    try {
      const oldStyle = feature.properties.style;

      const weight = parseInt(e.target[3].value);
      const opacity = parseInt(e.target[4].value);
      const fillOpacity = parseInt(e.target[5].value);

      if (weight > 100 || opacity > 100 || fillOpacity > 100) {
        alert("invalid input");
        return;
      }

      if (weight < 0 || opacity < 0 || fillOpacity < 0) {
        alert("invalid input");
        return;
      }

      const newStyle = {
        fillColor: e.target[1].value,
        color: e.target[2].value,
        weight,
        opacity,
        fillOpacity,
        name: e.target[0].value,
      };
      map.addEditFeaturePropertiesTransaction(newStyle, oldStyle, idx);
    } catch (err) {
      alert("invalid input");
      return;
    }

    layer.unbindTooltip();
    layer.bindTooltip(feature.properties.name, {
      permanent: true,
      direction: "center",
    });
  };

  const getFeatureStyle = (feature) => {
    if (!feature.properties.style) {
      feature.properties.style = {
        fillColor: "transparent",
        color: "blue",
        weight: 2,
        opacity: 1,
        fillOpacity: 100,
        name: feature.properties.name || "",
        pmIgnore: true,
      };
    }
    return feature.properties.style;
  };

  const toggleBindPopup = (enabled) => {
    if (!enabled) {
      Object.entries(mapRef._layers).forEach(([key, layer]) => {
        if (layer.prevPopup) {
          layer.bindPopup(layer.prevPopup);
          layer.prevPopup = null;
        }
      });
    } else {
      Object.entries(mapRef._layers).forEach(([key, layer]) => {
        const popup = layer.getPopup();
        if (popup) {
          layer.prevPopup = popup;
          layer.unbindPopup();
        }
      });
    }
  };
  
  const handleLayerDraw = (e) => {
    console.log(e);
  };

  // const handleVertexClick = (e) => {
  //   console.log("vertex clicked");
  //   const layer = e.layer;
  //   setOriginalLatLngs(layer.getLatLngs());
  // };

  const handleLayerUpdate = (e) => {
    const layer = e.layer;
    let updatedLatLngs

    try {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.CircleMarker) {
        updatedLatLngs = layer.getLatLng()
      } 
      else {
        updatedLatLngs = layer.getLatLngs()
      }
    }
    catch (err) {
      console.log(layer)
    }

    console.log("Original LatLngs:", originalLatLngsRef.current);
    console.log("Updated LatLngs:", updatedLatLngs);

    map.addUpdateLayerLatLngsTransaction(layer, featureGroupRef, originalLatLngsRef.current, updatedLatLngs)

  };

      // const handleLayerCut = (e) => {

      //   // console.log(e.originalLayer)
      //   // console.log(e.layer)

      //   e.layer.alreadyCut = true
      //   map.addCutLayerTransaction(e.originalLayer, e.layer, featureGroupRef, mapRef)
      // }

  const handleLayerRemove = (e) => {
    console.log('remove')
    map.addDeleteLayerTransaction(e.layer,  featureGroupRef)
  }

  const handleLayerRotateStart = (e) => {
    const layer = e.layer;
    setOriginalLatLngs(layer.getLatLngs());
  };
  // const handleLayerRotateEnd = (e) => {
  //   console.log("rotate end");
  //   console.log(e.layer)
  //   console.log(e.startAngle)
  //   console.log(e.angle)
  //   console.log(e.originLatLngs)
  //   console.log(e.newLatLngs)
  // };

  const handleLayerCreate = (e) => {
    map.addCreateLayerTransaction(e.layer,  featureGroupRef);
  };

  const handleDragStart = (e) => {
    const layer = e.layer;
    let latLngs
    if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.CircleMarker) {
      latLngs = layer.getLatLng()
    } 
    else {
      latLngs = layer.getLatLngs()
    }
    setOriginalLatLngs(latLngs);
  };

    // const handleDragEnd = (e) => {
    //   console.log(e.layer)
    // }

    // const handleEdit = (e) => {
    //   setOriginalLatLngs(e.layer.getLatLngs());
    // }

  //   const disableAllEdits = () => {
  //     if (!featureGroupRef.current) {
  //       console.log('no layers')
  //       return
  //     }
  //     Object.entries(featureGroupRef.current._layers).forEach(([key, layer]) => {
  //       layer.pm.disable()
  //     })
  //   }

  //   const enableEdits = () => {
  //     if (!featureGroupRef.current) {
  //       console.log('no layers')
  //       return
  //     }
  //     Object.entries(featureGroupRef.current._layers).forEach(([key, layer]) => {
  //       layer.pm.enable()
  //     })
  // }

  //   const enableDrags = () => {
  //     if (!featureGroupRef.current) {
  //       console.log('no layers')
  //       return
  //     }
  //     Object.entries(featureGroupRef.current._layers).forEach(([key, layer]) => {
  //       layer.pm.enableLayerDrag()
  //     })
  //   }

  const handleMarkerDragStart = (e) => {
    const layer = e.layer;
    let latLngs
    if (layer instanceof L.Marker) {
      latLngs = layer.getLatLng()
    } 
    else {
      latLngs = layer.getLatLngs()
    }
    setOriginalLatLngs(latLngs);
  }



  const defaultIcon = L.divIcon({
    className: 'custom-icon',
    html: '<span class="material-icons">location_on</span>',
    iconSize: L.point(50, 50),
  });

  return (
    <div className="mapContainerSize">
      <MapContainer
        ref={setMapRef}
        center={[51.505, -0.09]}
        zoom={3}
        style={{
          width: `${width}`,
          height: `${height}`,
          zIndex: "1",
          borderRadius: "1rem",
        }}
      >

        {editEnabled ? (
          <FeatureGroup ref={featureGroupRef} pmIgnore={false}>
            <GeomanControls
              options={{
                position: "topleft",
                drawText: false,
                cutPolygon: false,
                drawCircle: map.currentMapProprietaryJSON.templateType === "cadastral",
                drawRectangle: map.currentMapProprietaryJSON.templateType === "cadastral",
                drawPolygon: map.currentMapProprietaryJSON.templateType === "cadastral", 
                drawMarker: map.currentMapProprietaryJSON.templateType === "landmark",
                drawPolyline: true,
                drawCircleMarker: true,
              }}
              globalOptions={{
                continueDrawing: false,
                markerStyle: {
                  icon: defaultIcon,
                },
                pathOptions: {
                  color: map.colorSelected,
                  fillColor: map.colorSelected,
                },
              }}
              // onDrawEnd={handleLayerDraw}
              onCreate={handleLayerCreate}
              // onVertexClick={handleVertexClick}
              onUpdate={handleLayerUpdate}
              // onMapCut={handleLayerCut}
              // onLayerCut={handleLayerCut}
              onMarkerDragStart={handleMarkerDragStart}
              // onEdit={handleEdit}
              onDragStart={handleDragStart}
              // onDragEnd={handleDragEnd}
              onLayerRotateStart={handleLayerRotateStart}
              // onLayerRotateEnd={handleLayerRotateEnd}
              onLayerRemove= {handleLayerRemove}
              onGlobalDrawModeToggled={(e) => {
                if (e.shape === 'Marker') {
                  map.setMarkerActive(e.enabled)
                }
                  toggleBindPopup(e.enabled)
              }}
              onGlobalEditModeToggled={(e) => {
                      toggleBindPopup(e.enabled)
              }}

              onGlobalCutModeToggled = {e => {
                toggleBindPopup(e.enabled)

              }}
              onGlobalRotateModeToggled={e => {
                toggleBindPopup(e.enabled)

              }}
              onGlobalDragModeToggled={e => {
                toggleBindPopup(e.enabled)
              }}
            />
            {loadOriginalLayers(map.originalLayersGeoJSON)}
          </FeatureGroup>
        ) 
          : (<FeatureGroup ref={featureGroupRef}>
              {loadOriginalLayers(map.originalLayersGeoJSON)}
            
            </FeatureGroup>)
      }

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {map.currentMapGeoJSON && (
          <GeoJSON
            data={map.currentMapGeoJSON}
            style={(feature) => {
              return getFeatureStyle(feature);
            }}
            onEachFeature={onEachFeature}
            pmIgnore={true}
          ></GeoJSON>
        )}
      </MapContainer>
    </div>
  );
}

export default GeoJSONMap;
