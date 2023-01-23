// cleaning the location result list
export const filterSearchResults = (featureList: any[]) => {
  // filtering the list for features which belong to type == "administrative" and category === "boundary"
  var filteredList = featureList.filter(
    (feature) => feature.properties.type === "administrative"
  );

  // filtering out un-used keys to get cleaner object and reduce active memory usage
  filteredList = filteredList.map((element) => {
    const { bbox, geometry, properties } = element || {};
    const {
      category,
      display_name,
      icon,
      importance,
      osm_id,
      type,
      extratags,
    } = properties || {};

    return {
      bbox,
      geometry,
      category,
      display_name,
      icon,
      importance,
      osm_id,
      type,
      population: extratags["population"] || "No Data Available",
      population_date: extratags["population:date"] || "No Data Available",
    };
  });

  return filteredList;
};
