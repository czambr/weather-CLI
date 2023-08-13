//------------------------------------------
// Importaciones de paquetes de Nodejs
//------------------------------------------
const fs = require("fs");

//------------------------------------------
// Importaciones de paquetes de terceros
//------------------------------------------
const axios = require("axios");

class Busquedas {
    dbPath = "./db/database.json";
    historial = [];

    constructor() {
        this.leerDB();
    }

    // Parametros del MAPBOX para realizar consultas
    get paramsMapBox() {
        return {
            limit: 5,
            proximity: "ip",
            language: "es",
            access_token: process.env.MAPBOX_KEY,
        };
    }

    // Parametros para Weather
    get paramsWeather() {
        return {
            units: "metric",
            lang: "es",
            appid: process.env.OPENWEATHER_KEY,
        };
    }

    // Obtener el historial el capitalizado
    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(" ");
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(" ");
        });
    }

    // ===> Se obtienen las ciudades
    async obtenerCiudades(lugar = "") {
        // Peticion HTTP
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json `,
                params: this.paramsMapBox,
            });

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            console.log(error);
            return []; // retornar los lugares
        }
    }

    // ===> Se obtiene el estado del clima de una ciudad
    async climaLugar(lat, lon) {
        try {
            // Intancia
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon },
            });

            // Respuesta
            const resp = await instance.get();
            const { main, weather } = resp.data;

            // // Retorno de objeto
            return {
                temp: main.temp,
                tMin: main.temp_min,
                tMax: main.temp_max,
                desc: weather[0].description,
            };
        } catch (error) {
            console.log(error);
        }
    }

    // ===> Agregar a Historial
    agregarHistorial(lugar = "") {
        // Prevenir duplicidad
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 5);
        this.historial.unshift(lugar);

        // Grabar en DB
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial,
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Busquedas;
