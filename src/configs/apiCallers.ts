export const apiCaller = async (search: string) => {
  var result: any[] = [];
  await fetch(
    `https://nominatim.openstreetmap.org/search?q=${search}&format=json&extratags=1&&polygon_geojson=1`
  )
    .then(async (response) => response.json())
    .then(async (data) => {
      result = data;
    });

  return result;
};
