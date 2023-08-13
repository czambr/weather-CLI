//------------------------------------------
// Paquetes de terceros
//------------------------------------------
const colors = require("colors");
const inquirer = require("inquirer");

// ==> Preguntas lanzadas en el menu principal
const preguntas = [
    {
        type: "list",
        name: "opcion",
        message: "¿Qué desea hacer?",
        choices: [
            {
                value: 1,
                name: `${"1".green}. Buscar ciudad`,
            },
            {
                value: 2,
                name: `${"2".green}. Historial`,
            },
            {
                value: 0,
                name: `${"0".green}. Salir`,
            },
        ],
    },
];

const inquirerMenu = async () => {
    console.clear();
    console.log("===========================".green);
    console.log("   Seleccione un Opcion    ".white);
    console.log("===========================\n".green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
};

const pausa = async () => {
    const question = [
        {
            type: "input",
            name: "envio",
            message: `Presione ${"Enter".blue} para continuar `,
        },
    ];
    const { envio } = await inquirer.prompt(question);
    return envio;
};

const leerInput = async mensaje => {
    const question = [
        {
            type: "input",
            name: "desc",
            message: `${mensaje}`,
            validate(value) {
                if (value.length === 0) {
                    return "Por favor, ingresa un mensaje";
                }
                return true;
            },
        },
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
};

const listarLugares = async (lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`,
        };
    });

    choices.unshift({
        value: "0",
        name: "0.".green + " Cancelar",
    });

    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "Seleccione Lugar:",
            choices,
        },
    ];

    const { id } = await inquirer.prompt(preguntas);
    return id;
};

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
};
