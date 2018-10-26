import { handleLocation, getQueryString } from "./start.js";
import { createMap , createApp } from "./map.js";

const msoa = {};
msoa.handleLocation = handleLocation;
msoa.getQueryString = getQueryString;
msoa.startMap = (long, lat, zoom, csrf) => {
    const map = createMap(long, lat, zoom);
    const app = createApp(map, csrf);
    app.run();
};

window.msoa = msoa;
