
// !!DEPRECATED!!!

// import React from 'react';
// import { MapContainer, TileLayer } from 'react-leaflet';
// import ReactLeafletKml from 'react-leaflet-kml';

// function KMLMap(props) {

//     const {kmlData} = props
//     console.log("Kml data, ", kmlData)
//     return (
//         <MapContainer
//         center={[37.422, -122.084]}
//         zoom={13}
//         style={{ width: '100%', height: '400px' }}
//         >
//         <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {kmlData && <ReactLeafletKml kml={kmlData}> </ReactLeafletKml>}
//         </MapContainer>
//     );
// }

// export default KMLMap;