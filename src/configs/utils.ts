// cleaning the location result list
export const filterSearchResults = (featureList: any[]) => {
  // filtering the list for features which belong to type == "administrative" and category === "boundary"
  var filteredList = featureList.filter(
    (feature) => feature.type === "administrative"
  );

  // filtering out un-used keys to get cleaner object and reduce active memory usage
  filteredList = filteredList.map((element) => {
    const {
      class: category,
      display_name,
      icon,
      importance,
      osm_id,
      place_id,
      type,
      lat,
      lon,
      extratags,
      boundingbox,
      geojson,
    } = element || {};

    return {
      boundingbox,
      lat,
      lon,
      geojson,
      category,
      display_name,
      icon,
      importance,
      osm_id,
      place_id,
      type,
      population: extratags["population"] || "No Data Recorded",
      population_date: extratags["population:date"] || "No Data Recorded",
    };
  });

  // console.log("filteredList", filteredList);

  return filteredList;
};

export const showAllKeys = (data: any) => {
  for (const [key, value] of data) {
    console.log("KEYS", key, value);
  }
};
