import GeoJSONMap from './components/GeoJSONMap';
import './App.css';
import ShapefileMap from './components/ShapefileMap';

function App() {
  return (
    <div className="App">
      <GeoJSONMap />
      <ShapefileMap />
    </div>
  );
}

export default App;
