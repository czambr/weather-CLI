//------------------------------------------
// Paquete para configurar variables de
// entorno
//------------------------------------------
require("dotenv").config();

//------------------------------------------
// Modulos desarrollados
//------------------------------------------
const {
    leerInput,
    inquirerMenu,
    pausa,
    listarLugares,
} = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");

//------------------------------------------
// Main
//------------------------------------------

const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar Mensaje
                const termino = await leerInput("Ciudad: ");

                // Buscar los lugares
                const lugares = await busquedas.obtenerCiudades(termino);

                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === "0") {
                    continue;
                }
                const lugarSel = lugares.find(l => l.id === id);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const datosClima = await busquedas.climaLugar(
                    lugarSel.lat,
                    lugarSel.lng
                );

                // Mostrar resultados
                console.clear();
                console.log("\nInformacion de la ciudad\n".green);
                console.log("Ciudad:", lugarSel.nombre);
                console.log("Latitud:", lugarSel.lat);
                console.log("Longitud:", lugarSel.lng);
                console.log("Temperatura:", datosClima.temp);
                console.log("Temp. Min:", datosClima.tMin);
                console.log("Temp. Max:", datosClima.tMax);
                console.log("Estado del clima:", datosClima.desc);
                console.log();
                break;

            case 2:
                // busquedas.historial.forEach((lugar, i) => {
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}`.green;
                    console.log(`${idx}. ${lugar}`);
                });
                break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0);
};

main();
