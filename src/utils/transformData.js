
export const transformData = (cities) => {
  const structured = Array.isArray(cities) ? cities : cities?.default;

  const stateMap = {};

  structured.forEach(city => {
    const stateName = city.state;
    if (!stateMap[stateName]) {
      stateMap[stateName] = {
        name: stateName,
        cities: []
      };
    }
    stateMap[stateName].cities.push({ cname: city.name });
  });

  // console.log(stateMap);
  // stateMap.sort((a,b)=>a.stateName==='Tamil Nadu' - b.stateName==='Tamil Nadu')
  // console.log(stateMap);

  return Object.values(stateMap);
};
