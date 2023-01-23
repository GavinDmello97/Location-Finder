import { LatLngBoundsExpression, LatLngExpression, LatLngTuple } from "leaflet";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  FeatureGroupProps,
  useMap,
} from "react-leaflet";

function ChangeView({
  center,
  bound,
}: {
  center: LatLngExpression;
  bound: LatLngBoundsExpression;
}) {
  const map = useMap();

  map.setView(center);
  map.fitBounds(bound, {
    padding: [40, 40],
  });
  return null;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ selectedLocation }: { selectedLocation: any }) => {
  var latCoordinate = 42.3554334;
  var lngCoordinate = -71.060511;

  if (selectedLocation) {
    latCoordinate =
      Math.sign(selectedLocation.bbox[1]) *
      ((Math.abs(selectedLocation.bbox[1]) +
        Math.abs(selectedLocation.bbox[3])) /
        2);
    lngCoordinate =
      Math.sign(selectedLocation.bbox[0]) *
      ((Math.abs(selectedLocation.bbox[0]) +
        Math.abs(selectedLocation.bbox[2])) /
        2);
  }

  var position: LatLngExpression = [latCoordinate, lngCoordinate];

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={true}
      style={{ zIndex: 0 }}
      touchZoom={true}
    >
      <ChangeView
        center={position}
        bound={
          selectedLocation
            ? [
                ...selectedLocation.geometry.coordinates[0].map((c: any) =>
                  [...c].reverse()
                ),
              ]
            : [position, position]
        }
      />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedLocation && (
        <Polygon
          positions={selectedLocation.geometry.coordinates[0].map(
            (x: string[]) => [...x].reverse()
          )}
        >
          <Popup>
            <div className="p-2 px-3">
              <b className="m-0 p-0">{selectedLocation.display_name}</b>
              <p className="m-0 p-0">
                Population: {selectedLocation.population}
              </p>
              <p className="m-0 p-0">
                Population Date: {selectedLocation.population_date}
              </p>
            </div>
          </Popup>
        </Polygon>
      )}
      {/* <Marker position={[42.3554334, -71.060511]}>
     
    </Marker> */}
    </MapContainer>
  );
};
