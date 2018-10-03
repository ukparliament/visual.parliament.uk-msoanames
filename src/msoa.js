import { handleLocation, getQueryString } from "./start.js";
import { createMap , createApp } from "./map.js";

const msoa = {};
msoa.handleLocation = handleLocation;
msoa.getQueryString = getQueryString;
msoa.startMap = (long, lat, zoom) => {
    const map = createMap(long, lat, zoom);
    const app = createApp(map);
    app.run();
};

window.msoa = msoa;
