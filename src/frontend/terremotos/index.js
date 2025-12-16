// Constante que almacena las opciones categóricas con sus significados reales
const CATEGORICAL_OPTIONS_DESCRIPTIONS = {
    land_surface_condition: [
        ['n', 'No-natural'],
        ['o', 'Otro'],
        ['t', 'Asfalto/Terraplén']
    ],
    foundation_type: [
        ['h', 'Arcilla dura'],
        ['i', 'Aislada (bloques)'],
        ['r', 'Roca/Piedra'],
        ['u', 'No Asegurada'],
        ['w', 'Madera']
    ],
    roof_type: [
        ['n', 'Poco importante'],
        ['q', 'Celosía'],
        ['x', 'Voladizo']
    ],
    ground_floor_type: [
        ['f', 'Plano'],
        ['m', 'Masivo (piedra)'],
        ['v', 'Forma de V'],
        ['x', 'Forma de X'],
        ['z', 'Cero (Poco importante)']
    ],
    other_floor_type: [
        ['j', 'Viga/Vigueta'],
        ['q', 'Celosía'],
        ['s', 'Losa de piedra'],
        ['x', 'Voladizo']
    ],
    position: [
        ['j', 'Esquina/Intersección'],
        ['o', 'Exterior'],
        ['s', 'Bloque/Manzana'],
        ['t', 'Intersección en T']
    ],
    plan_configuration: [
        ['a', 'Forma de A'],
        ['c', 'Esquina'],
        ['d', 'Forma de D'],
        ['f', 'Forma de E/F'],
        ['m', 'Masivo/Múltiple'],
        ['n', 'Forma de N'],
        ['o', 'Abierto'],
        ['q', 'Cuadrado/Bloque'],
        ['s', 'Forma de S'],
        ['u', 'Forma de U']
    ],
    legal_ownership_status: [
        ['a', 'Anónimo'],
        ['r', 'Alquilado'],
        ['v', 'Vacante'],
        ['w', 'Propietario registrado']
    ],
    
    // Para Geo Levels, mantenemos la estructura actual para el ejemplo
    geo_level_1_id: Array.from({length: 31}, (_, i) => [i.toString(), `Nivel 1: ${i}`]),
    geo_level_2_id: Array.from({length: 1428}, (_, i) => [i.toString(), `Nivel 2: ${i}`]), 
    geo_level_3_id: Array.from({length: 12568}, (_, i) => [i.toString(), `Nivel 3: ${i}`]) 
};

// Nombres de las variables binarias de superestructura
const SUPERSTRUCTURE_VARIABLES = [
    'has_superstructure_adobe_mud',
    'has_superstructure_mud_mortar_stone',
    'has_superstructure_stone_flag',
    'has_superstructure_cement_mortar_stone',
    'has_superstructure_mud_mortar_brick',
    'has_superstructure_cement_mortar_brick',
    'has_superstructure_timber',
    'has_superstructure_bamboo',
    'has_superstructure_rc_non_engineered',
    'has_superstructure_rc_engineered',
    'has_superstructure_other'
];

const SUPERSTRUCTURE_VARIABLES_SPANISH = [
    'Adobe/Barro',
    'Piedra con mortero de barro',
    'Lajas de piedra',
    'Piedra con mortero de cemento',
    'Ladrillo con mortero de barro',
    'Ladrillo con mortero de cemento',
    'Madera',
    'Bambú',
    'Hormigón armado no diseñado',
    'Hormigón armado diseñado',
    'Otro',
];

// Nombres de las variables binarias de uso secundario (excluyendo la general 'has_secondary_use')
const SECONDARY_USE_VARIABLES = [
    'has_secondary_use_agriculture',
    'has_secondary_use_hotel',
    'has_secondary_use_rental',
    'has_secondary_use_institution',
    'has_secondary_use_school',
    'has_secondary_use_industry',
    'has_secondary_use_health_post',
    'has_secondary_use_gov_office',
    'has_secondary_use_use_police',
    'has_secondary_use_other'
];

const SECONDARY_USE_VARIABLES_SPANISH = [
    'Agricultura',
    'Hotel',
    'Alquiler',
    'Institución',
    'Escuela/Colegio',
    'Industria',
    'Centro de salud',
    'Oficina gubernamental',
    'Uso policial',
    'Otro'
];

// Este mapa define la posición (índice 0 a 38) de cada columna en el CSV 
// y el ID del elemento HTML correspondiente.
const CSV_COLUMN_MAP = [
    { index: 0, id: 'building_id', type: 'ignore' },
    { index: 1, id: 'geo_level_1_id', type: 'select' },
    { index: 2, id: 'geo_level_2_id', type: 'select' },
    { index: 3, id: 'geo_level_3_id', type: 'select' },
    { index: 4, id: 'count_floors_pre_eq', type: 'number' },
    { index: 5, id: 'age', type: 'number' },
    { index: 6, id: 'area_percentage', type: 'number' },
    { index: 7, id: 'height_percentage', type: 'number' },
    { index: 8, id: 'land_surface_condition', type: 'select' },
    { index: 9, id: 'foundation_type', type: 'select' },
    { index: 10, id: 'roof_type', type: 'select' },
    { index: 11, id: 'ground_floor_type', type: 'select' },
    { index: 12, id: 'other_floor_type', type: 'select' },
    { index: 13, id: 'position', type: 'select' },
    { index: 14, id: 'plan_configuration', type: 'select' },
    { index: 15, id: 'has_superstructure_adobe_mud', label: 'Adobe/Barro', type: 'checkbox' },
    { index: 16, id: 'has_superstructure_mud_mortar_stone', label: 'Piedra con mortero de barro', type: 'checkbox' },
    { index: 17, id: 'has_superstructure_stone_flag', label: 'Lajas de piedra', type: 'checkbox' },
    { index: 18, id: 'has_superstructure_cement_mortar_stone', label: 'Piedra con mortero de cemento', type: 'checkbox' },
    { index: 19, id: 'has_superstructure_mud_mortar_brick', label: 'Ladrillo con mortero de barro', type: 'checkbox' },
    { index: 20, id: 'has_superstructure_cement_mortar_brick', label: 'Ladrillo con mortero de cemento', type: 'checkbox' },
    { index: 21, id: 'has_superstructure_timber', label: 'Madera', type: 'checkbox' },
    { index: 22, id: 'has_superstructure_bamboo', label: 'Bambú', type: 'checkbox' },
    { index: 23, id: 'has_superstructure_rc_non_engineered', label: 'Hormigón armado no diseñado', type: 'checkbox' },
    { index: 24, id: 'has_superstructure_rc_engineered', label: 'Hormigón armado diseñado', type: 'checkbox' },
    { index: 25, id: 'has_superstructure_other', label: 'Otro', type: 'checkbox' },
    { index: 26, id: 'legal_ownership_status', label: '', type: 'select' },
    { index: 27, id: 'count_families', label: '', type: 'number' },
    { index: 28, id: 'has_secondary_use', label: '', type: 'checkbox' },
    { index: 29, id: 'has_secondary_use_agriculture', label: 'Agricultura', type: 'checkbox' },
    { index: 30, id: 'has_secondary_use_hotel', label: 'Hotel', type: 'checkbox' },
    { index: 31, id: 'has_secondary_use_rental', label: 'Alquiler', type: 'checkbox' },
    { index: 32, id: 'has_secondary_use_institution', label: 'Institución', type: 'checkbox' },
    { index: 33, id: 'has_secondary_use_school', label: 'Escuela/Colegio', type: 'checkbox' },
    { index: 34, id: 'has_secondary_use_industry', label: 'Industria', type: 'checkbox' },
    { index: 35, id: 'has_secondary_use_health_post', label: 'Centro de salud', type: 'checkbox' },
    { index: 36, id: 'has_secondary_use_gov_office', label: 'Oficina gubernamental', type: 'checkbox' },
    { index: 37, id: 'has_secondary_use_use_police', label: 'Uso policial', type: 'checkbox' },
    { index: 38, id: 'has_secondary_use_other', label: 'Otro', type: 'checkbox' }
];

// Variable para la ruta del endpoint de predicción
const ENDPOINT_PREDICT = `${URL_PYTHON}/terremotos`;

// Función de inicialización: configura los eventos y construye los selectores
function inicializar() {
    document.addEventListener('DOMContentLoaded', function() {
        construirSelects(CATEGORICAL_OPTIONS_DESCRIPTIONS);
        construirCheckboxes('superstructure-container', SUPERSTRUCTURE_VARIABLES, SUPERSTRUCTURE_VARIABLES_SPANISH, false, 'superstructure');
        construirCheckboxes('secondary-use-container', SECONDARY_USE_VARIABLES, SECONDARY_USE_VARIABLES_SPANISH, false, 'secondary-use');

        // Evento para el botón de predicción
        document.getElementById('predict-button').addEventListener('click', async function() {
            if (document.getElementById('formulario-terremoto').checkValidity()) {
                await obtenerPrediccion();
            } else {
                document.getElementById('formulario-terremoto').classList.add('was-validated');
                alert('Por favor, rellena todos los campos obligatorios.');
            }
        });
        
        //Evento para el botón de cargar CSV
        document.getElementById('load-csv-button').addEventListener('click', loadCsvData);

        // Evento para limpiar el resultado al resetear el formulario
        document.getElementById('formulario-terremoto').addEventListener('reset', function() {
            document.getElementById('prediction-output').innerHTML = "<p class='mb-0 text-muted'>Haz clic en \"PREDECIR DAÑO\" para obtener el resultado.</p>";
            document.getElementById('csv-message').innerHTML = ""; // Limpiar mensaje CSV
        });
    });
}

// Procesa la fila CSV pegada y la inyecta en el formulario
function loadCsvData() {
    const csvInput = document.getElementById('csv-input').value.trim();
    const messageElement = document.getElementById('csv-message');
    
    // Limpiar el estado de los checkboxes
    document.getElementById('formulario-terremoto').reset();

    if (!csvInput) {
        messageElement.innerHTML = "<span class='text-danger'>El campo CSV está vacío.</span>";
        return;
    }

    // Dividir la cadena por comas
    const values = csvInput.split(',').map(v => v.trim());

    // El CSV debe tener 39 columnas (incluyendo building_id)
    if (values.length !== 39) {
        messageElement.innerHTML = `<span class='text-danger'>Error: Se esperaban 39 columnas, pero se encontraron ${values.length}.</span>`;
        return;
    }

    // Recorrer el mapa e inyectar valores en el formulario
    CSV_COLUMN_MAP.forEach(map => {
        const element = document.getElementById(map.id);
        const value = values[map.index];

        if (!element || map.type === 'ignore') return;

        try {
            if (map.type === 'checkbox') {
                // Para checkboxes: 1 es marcado, 0 es desmarcado
                element.checked = (value === '1');
            } else {
                // Para números y selects: asignar el valor directamente
                element.value = value;
            }
        } catch (e) {
            console.error(`Error al establecer valor para ${map.id} (${map.type}): ${value}`, e);
            // Mostrar un error más específico si falla la asignación
            messageElement.innerHTML = `<span class='text-warning'>Advertencia: Valor '${value}' no válido para el campo '${map.id}'.</span>`;
        }
    });

    messageElement.innerHTML = "<span class='text-success'>✅ Datos cargados exitosamente. Haz clic en 'Predecir daño'.</span>";
}

// Construye los elementos <select> a partir del objeto de opciones
function construirSelects(options) {
    for (const id in options) {
        const selectElement = document.getElementById(id);
        if (selectElement) {
            
            // Los elementos de las opciones ahora tienen el formato [valor, descripción]
            const optionsHtml = options[id].map(option => {
                const value = option[0];     // La letra (n, o, t, etc.)
                const description = option[1]; // La descripción (No-natural, Otro, etc.)
                return `<option value="${value}">${description}</option>`;
            }).join('');
            
            selectElement.innerHTML = optionsHtml;
            // Establecer un valor por defecto (el primero)
            selectElement.value = options[id][0][0]; // Accede al valor real: [0] primer elemento, [0] primer valor
        }
    }
}

// Construye los checkboxes a partir de un array de variables
function construirCheckboxes(containerId, variables, variables_spanish, isSecondary = false, name='') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = variables.map((variable, index) => {
        // Formato para el texto de la etiqueta
        const labelText = variables_spanish[index];
        return `
            <div class="form-check form-check-inline">
                <input class="form-check-input ${isSecondary ? 'secondary-use-flag' : ''}" type="radio" id="${variable}" name="${name}" value="1">
                <label class="form-check-label" for="${variable}">${labelText.charAt(0).toUpperCase() + labelText.slice(1)}</label>
            </div>
        `;
    }).join('');

    container.innerHTML += html;
}

// Recolecta todos los datos del formulario y los formatea para el backend
function recolectarDatos() {
    const data = {};
    const form = document.getElementById('formulario-terremoto');

    // 1. Recolectar datos de campos numéricos y selectores (categóricos)
    const allInputs = form.querySelectorAll('input, select');
    allInputs.forEach(input => {
        const value = input.value;
        if (input.type === 'number') {
            data[input.id] = parseInt(value);
        } else if (input.type === 'select-one') {
            data[input.id] = value;
        }
    });

    // 2. Recolectar datos de checkboxes (binarias)
    // Inicializar todas las binarias en 0
    const allBinaryVars = SUPERSTRUCTURE_VARIABLES.concat(SECONDARY_USE_VARIABLES).concat(['has_secondary_use']);
    allBinaryVars.forEach(varName => {
        data[varName] = 0;
    });

    // Sobreescribir con 1 si están marcadas
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        data[checkbox.id] = 1;
    });

    // LightGBM requiere el ID (aunque solo sea temporal), y el building_id de la predicción final
    data['building_id'] = 999999; 
    
    // El backend espera un objeto donde la clave es el nombre de la variable y el valor es el valor seleccionado
    return data;
}

// Envía los datos al backend y muestra la predicción
async function obtenerPrediccion() {
    const predictionOutput = document.getElementById('prediction-output');
    predictionOutput.innerHTML = `<p class="text-info mb-0">Cargando predicción...</p>`;

    const datosEntrada = recolectarDatos();
    
    // El backend de Python espera una lista de objetos, incluso si solo es uno
    const datosParaEnvio = [datosEntrada];

    try {
        const respuesta = await fetch(ENDPOINT_PREDICT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosParaEnvio),
        });

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: ${respuesta.statusText}`);
        }

        const resultado = await respuesta.json();
        
        // El resultado debe ser un array de predicciones [1, 2, 3]
        const grade = resultado.predictions[0];
        
        let colorClass = 'text-success';
        let description = 'Daño bajo';
        if (grade === 2) {
            colorClass = 'text-warning';
            description = 'Daño medio';
        } else if (grade === 3) {
            colorClass = 'text-danger';
            description = 'Destrucción casi completa';
        }

        predictionOutput.innerHTML = `
            <p class="mb-0 ${colorClass} h2">
                <strong>GRADO DE DAÑO ${grade}</strong>
                <span class="d-block text-muted">(${description})</span>
            </p>
        `;

    } catch (error) {
        console.error("Error al obtener la predicción:", error);
        predictionOutput.innerHTML = `<p class="text-danger mb-0">Error de conexión: Asegúrate de que el backend de Python esté ejecutándose.</p>`;
    }
}

// Llama a la función de inicialización al cargar el script
inicializar();