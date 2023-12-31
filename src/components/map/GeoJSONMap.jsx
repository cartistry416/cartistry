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
  LayerGroup,
  useMapEvents,
  useMap
} from "react-leaflet";

// import Geoman  from './Geoman';

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as ReactDOM from "react-dom/client";
import chroma from 'chroma-js';

import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls, layerEvents } from "react-leaflet-geoman-v2";
import EditFeaturePopup from "./EditFeaturePopup";
import 'leaflet-choropleth';
import 'leaflet.heat'
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
  const { map, gradientLayersRef, choroplethLayersRef} = useContext(GlobalMapContext);


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

  // useEffect(() => {
  //   const heatValueProperties = findHeatValueProperties(map.currentMapGeoJSON)
  //   const selectedHeatValueProperty = heatValueProperties[0]
  //   map.setHeatPropertiesAndSelected(selectedHeatValueProperty, heatValueProperties)
  // },[map.currentMapGeoJSON]);
  function findHeatValueProperties(geojsonData) {
    let potentialProperties = new Set();
  
    if (geojsonData) {
      geojsonData.features.forEach(feature => {
        Object.keys(feature.properties).forEach(key => {
          if (typeof feature.properties[key] === 'number') {
            potentialProperties.add(key);
          }
        });
      });
    }
  
    return Array.from(potentialProperties);
  }
  const loadOriginalLayers = () => {


    if (!map.originalLayersGeoJSON || !map.originalLayersGeoJSON.length) {
      return null
    }


    let layers
    if (map.currentMapProprietaryJSON.templateType === "choropleth") {
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
      const calculateChoroplethStyle = (geojson, options) => {
        const values = geojson.features.map(feature =>
          feature.properties[options.valueProperty]
        );
        const limits = chroma.limits(values, options.mode, options.steps - 1);
        const colors = chroma.scale(options.scale).colors(limits.length);
      
        return { limits, colors };
      };
      const { limits, colors } = calculateChoroplethStyle(map.currentMapGeoJSON, choroplethOptions);
      layers = (<LayerGroup>
        <GeoJSON
          data={map.currentMapGeoJSON}
          style={(feature) => {
            const value = feature.properties[choroplethOptions.valueProperty];
            let fillColor = '#fff'; // Default color
            for (let i = 0; i < limits.length; i++) {
              if (value <= limits[i]) {
                fillColor = colors[i];
                break;
              }
            }
            return { ...choroplethOptions.style, fillColor };
          }}
        />
      </LayerGroup>)
    }
    else {

      layers = map.originalLayersGeoJSON.map((layerGeoJSON, index)=> {
        console.log(layerGeoJSON)
        const type = layerGeoJSON.properties.layerType
        let layer
        if (type === "circle") {
          // layer = L.circle([layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]], layerGeoJSON.properties.options)
          layer = <Circle 
            key={index}
            center={[layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]]}
            radius={ layerGeoJSON.properties.options.radius}
            pathOptions={ {...layerGeoJSON.properties.options} }
          />
        }
        else if (type === "circleMarker") {
          // layer = L.circleMarker([layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]], layerGeoJSON.properties.options)
          layer = <CircleMarker 
            key={index}
            center={[layerGeoJSON.geometry.coordinates[1],layerGeoJSON.geometry.coordinates[0]]}
            radius={layerGeoJSON.properties.options.radius}
            pathOptions={ {...layerGeoJSON.properties.options} }
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
        return layer

      })
    }

    //setInitialGeomanLayersLoaded(true)
    return layers
      
  }


  
  // useEffect(() => {
  //   if (!featureGroupRef || !featureGroupRef.current) {
  //     console.log(featureGroupRef)
  //     return
  //   }

  //   if (map.originalLayersGeoJSON && map.currentMapProprietaryJSON.templateType !== "choropleth") {
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
    if (map.currentMapProprietaryJSON && map.currentMapProprietaryJSON.templateType !== "gradient"
    && map.currentMapProprietaryJSON.templateType !== "choropleth") {
      layer.bindPopup(renderPopupForm(feature, idx, layer, map.currentMapProprietaryJSON.templateType));
    }
  };

  const renderPopupForm = (feature, idx, layer, templateType, selectedHeatValueProperty) => {
    const popup = L.popup();
    const container = L.DomUtil.create("div");
    popup.setContent(container);
    const root = ReactDOM.createRoot(container);
    console.log(selectedHeatValueProperty);
    root.render(
      <EditFeaturePopup
        feature={feature}
        idx={idx}
        handlePopupSubmit={handlePopupSubmit}
        layer={layer}
        templateType={templateType}
        selectedHeatValueProperty={selectedHeatValueProperty}
      >
        {" "}
      </EditFeaturePopup>
    );
    return popup;
  };

  const handlePopupSubmit = (e, feature, idx, layer) => {
    if(map.currentMapProprietaryJSON.templateType === "choropleth"){
      try {
        const newValue = parseInt(e.target[1].value);
        if (newValue < 0) {
          alert("invalid input");
          return;
        }
        const oldValue = feature.properties[map.heatValueSelectedProperty];
        // map.addEditChoroFeaturePropertiesTransaction(choroplethData, newValue, oldValue, idx);
      } catch (err) {
        alert("invalid input");
        return;
      }
     
    } else {
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
    }
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

  const [heatmapData, setHeatmapData] = useState([])
  const [choroplethData, setChoroplethData] = useState([])

  useEffect(() => {
    if (map.currentMapProprietaryJSON && map.currentMapProprietaryJSON.templateType === "gradient") {
      map.loadGradientLayers(setHeatmapData)
    }
    if (map.currentMapProprietaryJSON && map.currentMapProprietaryJSON.templateType === "choropleth")
      if (choroplethData.length === 0) {
        const heatValueProperties = findHeatValueProperties(map.currentMapGeoJSON)
        const selectedHeatValueProperty = heatValueProperties[0]
        map.setHeatPropertiesAndSelected(selectedHeatValueProperty, heatValueProperties)
        setChoroplethData(map.currentMapGeoJSON);
      } else {
        map.loadChoroplethLayers(setChoroplethData)
      }
      
  },[]) 

  const ChoroplethLayer = ({data, options}) => {
    const choroMap = useMap();
    useEffect(() => {
      console.log(choroMap);
      console.log(data);
      console.log(data && data.features && data.features.length > 0);
      if (choroMap && data && Array.isArray(data.features) && data.features.length > 0) {
        const choroplethLayer = L.choropleth(map.currentMapGeoJSON, {
          valueProperty: map.heatValueSelectedProperty,
          scale: map.heatColors, 
          steps: map.numHeatSections,
          mode: 'q',
          style: {
            color: '#fff',
            weight: 2,
            fillOpacity: 0.8
          },
          onEachFeature: function(feature, layer) {
            const idx = data.features.indexOf(feature);

            layer.bindPopup(renderPopupForm(feature, idx, layer, map.currentMapProprietaryJSON.templateType, map.heatValueSelectedProperty));
          }
        });
        choroplethLayer.addTo(choroMap);
        return () => {
          choroMap.removeLayer(choroplethLayer);
        }
      }
    }, [choroMap, data, options]);
    
    return null; 

  }

  const addDataPointToHeatmap = (lat, lng) => {
    setHeatmapData((prevData) => [...prevData, [lat, lng, map.gradientOptions.intensity]]);
    gradientLayersRef.current.push([lat, lng, map.gradientOptions.intensity])
  };

  const popDataFromHeatMap = () => {
    const newData = [...heatmapData]
    newData.pop()
    gradientLayersRef.current.pop()
    setHeatmapData(newData);
  }

  const HeatLayer = ({data, options}) => {
    const map = useMap();

    useEffect(() => {
      if (map && data && data.length > 0) {
        const heatData = data.map(([lat, lng, intensity]) => [lat, lng, intensity]);

        const modifiedOptions = JSON.parse(JSON.stringify(options))
        Object.entries(modifiedOptions.gradient).forEach(([k,v]) => {
          const newKey = k/100
          modifiedOptions.gradient[newKey] = v
          delete modifiedOptions.gradient[k]
        })


        console.log(heatData)
        const heatLayer = L.heatLayer(heatData, modifiedOptions).addTo(map);
        console.log(heatLayer)

        return () => {
          map.removeLayer(heatLayer);
        };
      }
    }, [map, data, options]);
  
    return null; 
  }


  
  const HandleGradientClick = () => {
    useMapEvents({
      click: (e) => {
        map.addCreateGradientPointTransaction(e.latlng.lat, e.latlng.lng, addDataPointToHeatmap, popDataFromHeatMap)
      },
    });

    return null;
  };



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
                drawPolyline: map.currentMapProprietaryJSON.templateType !== "gradient",
                drawCircleMarker: map.currentMapProprietaryJSON.templateType !== "gradient",
                removalMode: map.currentMapProprietaryJSON.templateType !== "gradient",
                dragMode:map.currentMapProprietaryJSON.templateType !== "gradient",
                editMode: map.currentMapProprietaryJSON.templateType !== "gradient",
                rotateMode: map.currentMapProprietaryJSON.templateType !== "gradient"
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

      {(map.currentMapProprietaryJSON && map.currentMapProprietaryJSON.templateType === "gradient") ? 
        <>

          <HeatLayer data={heatmapData} options={map.gradientOptions.options}/>
          <HandleGradientClick />
        </>
      
      
      : null}
      {(map.currentMapProprietaryJSON && map.currentMapProprietaryJSON.templateType === "choropleth") ? 
        <>
         <ChoroplethLayer data={choroplethData} options={map.choroplethOptions.options}/>
        </>
      : null}
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
