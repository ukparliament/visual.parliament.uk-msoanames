import { handleLocation, getQueryString } from "./start.js";
import { createMap , createApp } from "./map.js";

const msoa = {};
msoa.handleLocation = handleLocation;
msoa.getQueryString = getQueryString;
msoa.startMap = (config, long, lat, zoom, csrf) => {
    const map = createMap(config, long, lat, zoom);
    const app = createApp(config, map, csrf);
    app.run();
};

window.msoa = msoa;
