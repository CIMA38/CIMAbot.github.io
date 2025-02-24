const chatData = {  
    bienvenida: "Bienvenido a CIMA. Antes de iniciar, te pedimos que cuentes con los datos de tu vehículo.",
    servicios: [
        "Reparación o prueba de algún módulo automotriz.", 
        "Escaneo o servicio de diagnóstico de tu vehículo.", 
        "Servicio preventivo 'Afinación de motor'.", 
        "Programación de módulo automotriz.",
        "Compra de Computadora."
    ],
    respuestas: {
        "Reparación o prueba de algún módulo automotriz.": [
            "¿Qué problema presenta? (Selecciona una opción):\n1. No arranca\n2. No hay pulsos en inyectores\n3. No hay chispa en bobina\n4. Otro problema",
            "El costo de la prueba inicial puede variar dependiendo el sistema de tu auto. Posteriormente se notificará si procede a reparación y se tomará a cuenta el primer pago."
        ],
        "Escaneo o servicio de diagnóstico de tu vehículo.": [
            "¿Qué problema presenta? (Selecciona una opción):\n1. El vehículo no enciende\n2. El vehículo enciende y falla\n3. El vehículo enciende, pero NO falla\n4. Otro problema",
            "Comparte algunos antecedentes: ¿Cuánto tiempo lleva la falla?",
            "¿Después de que inició, se han cambiado algunas piezas?"
        ],
        "Servicio preventivo 'Afinación de motor'.": [
            "¿El vehículo presenta alguna falla? (Selecciona una opción):\n1. Sí\n2. No",
            "Antes del servicio de afinación, te sugerimos agendar un escaneo previo."
        ],
        "Programación de módulo automotriz.": [
            "¿Qué deseas programar? (Selecciona una opción):\n1. Computadora\n2. Llave\n3. Otro módulo"
        ],
        "Compra de Computadora.": [
            "Revisaremos la disponibilidad del equipo. Gracias por tu preferencia. Confirma OK"
        ]
    }
};

const chatbotContainer = document.querySelector('.chatbot-container');
const messagesDiv = document.querySelector('.chatbox-messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

let step = 0;
let selectedService = null;
let subStep = 0;
let vehicleData = { servicio:'', marca: '', modelo: '', anio: '', motor: '', tiempoFalla: '', piezasCambiadas: '', problema: '', afinacionfalla: '', moduloprog:''};

function displayMessage(message, fromUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', fromUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function nextStep(input = '') {
    if (step === 0) {
        displayMessage(chatData.bienvenida);
        chatData.servicios.forEach((servicio, index) => {
            displayMessage(`${index + 1}. ${servicio}`);
        });
        displayMessage("¿Qué servicio deseas? (Escribe el número)");
        step++;
    } else if (step === 1) {
        const servicioIndex = parseInt(input) - 1;
        if (servicioIndex >= 0 && servicioIndex < chatData.servicios.length) {
            selectedService = chatData.servicios[servicioIndex];
            vehicleData.servicio = selectedService;
            displayMessage("Por favor ingresa la MARCA de tu vehículo. POR EJEMPLO: FORD  (solo letras):");
            step++;
            subStep = 1;
        } else {
            displayMessage("Por favor selecciona una opción válida.");
        }
    } else if (step === 2) {
        switch (subStep) {
            case 1:
                if (/^[a-zA-Z\s]+$/.test(input)) {
                    vehicleData.marca = input.trim();
                    displayMessage("Por favor ingresa el MODELO de tu vehículo. POR EJEMPLO: MUSTANG GT(solo letras): ");
                    subStep++;
                } else {
                    displayMessage("Por favor ingresa un valor válido para la marca. (solo letras).");
                }
                break;
            case 2:
                if (/^[a-zA-Z\s]+$/.test(input)) {
                    vehicleData.modelo = input.trim();
                    displayMessage("Por favor ingresa el AÑO DEL MODELO de tu vehículo. POR EJEMPLO: 2020 (4 dígitos):");
                    subStep++;
                } else {
                    displayMessage("Por favor ingresa un valor válido para el modelo (solo números).");
                }
                break;
            case 3:
                if (/^\d{4}$/.test(input)) {
                    vehicleData.anio = input.trim();
                    displayMessage("Por favor ingresa el MOTOR de tu vehículo. EJEMPLO: 4,6 U 8 CILINDROS (letras y números permitidos):");
                    subStep++;
                } else {
                    displayMessage("Por favor ingresa un año válido (4 dígitos).");
                }
                break;
            case 4:
                if (/^[a-zA-Z0-9\s]+$/.test(input)) { 
                    vehicleData.motor = input.trim();
                    displayMessage(chatData.respuestas[selectedService][0]);
                    subStep++;
                } else {
                    displayMessage("Por favor ingresa un valor válido para el motor (letras y números permitidos).");
                }
                break;
            case 5:
                if (selectedService === "Reparación o prueba de algún módulo automotriz.") {
                    const selectedOption = parseInt(input.trim());
                    if (selectedOption >= 1 && selectedOption <= 3) {
                        // Extraer la lista de problemas desde la pregunta
                        const problemasTexto = chatData.respuestas[selectedService][0]
                        .split("\n") // Dividir por líneas
                        .slice(1, 4) 
                        .map(linea => linea.substring(3)); // Eliminar el número y punto al inicio

                        // Guardar el nombre del problema
                        vehicleData.problema = problemasTexto[selectedOption - 1];

                        displayMessage(chatData.respuestas[selectedService][1]);
                        displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                        telefono(input);
                    } else if (selectedOption === 4) {
                        // Solicitar el problema solo si se ha elegido la opción "4"
                        displayMessage("Por favor escribe el problema que presenta tu vehículo:");
                        subStep= 10;
                    } else {
                        displayMessage("Gracias por tu información. Un asesor se pondrá en contacto contigo.");
                        displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                        telefono(input);
                    }
                }
            
                else if (selectedService === "Escaneo o servicio de diagnóstico de tu vehículo.") {
                    const selectedOption = parseInt(input.trim());

                    if (selectedOption >= 1 && selectedOption <= 3) {
                        // Extraer la lista de problemas desde la pregunta
                        const problemasTexto = chatData.respuestas[selectedService][0]
                        .split("\n") // Dividir por líneas
                        .slice(1, 4) // Tomar solo las opciones (1-3)
                        .map(linea => linea.substring(3)); // Eliminar el número y punto al inicio

                        // Guardar el nombre del problema
                        vehicleData.problema = problemasTexto[selectedOption - 1];

                        displayMessage(chatData.respuestas[selectedService][1]);
                        subStep= 7; 
                    } else if (selectedOption === 4) {
                        // Solicitar el problema solo si se ha elegido la opción "4"
                        displayMessage("Por favor escribe el problema o falla que presenta tu vehículo:");
                        subStep= 12;
                    } else {
                        displayMessage("Gracias por tu información. Un asesor se pondrá en contacto contigo.");
                        displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                        telefono(input);
                    }
                    
                } else if (selectedService === "Servicio preventivo 'Afinación de motor'."){
                    const userInputLower = parseInt(input.trim());
                    if (userInputLower === 1) {  // Solo acepta '1' como opción para 'Sí'
                        vehicleData.afinacionfalla = "Sí";  // Guardamos la respuesta
                        displayMessage("Antes del servicio de afinación, te sugerimos agendar un escaneo previo.");
                        displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                        subStep=9;  // Pasamos input correctamente
                    } else if (userInputLower === 2) {  // Solo acepta '2' como opción para 'No'
                        vehicleData.afinacionfalla = "No";  // Guardamos la respuesta
                        displayMessage("Gracias por tu información. Un asesor se pondrá en contacto contigo.");
                        displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                        subStep=9;  // Pasamos input correctamente
                    } else {
                        displayMessage("Por favor selecciona una opción válida: 1 o 2.");
                    }
                         
                } else if (selectedService === "Programación de módulo automotriz."){
                    const selectedOption = parseInt(input.trim());

                    if (selectedOption >= 1 && selectedOption <= 3) {
                        const articulosTexto = chatData.respuestas[selectedService][0]
                            .split("\n")
                            .slice(1, 4)
                            .map(linea => linea.substring(3));
                
                        vehicleData.moduloprog = articulosTexto[selectedOption - 1];
                
                        displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                        subStep=9;
                    }
                } else if (selectedService === "Compra de Computadora."){
                    displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                    telefono(input);  // Pasamos input correctamente
                }
                break;
            case 6: // Capturar problema personalizado
                
                break;
            case 7: // ¿Cuánto tiempo lleva la falla?
                vehicleData.tiempoFalla = input.trim();
                displayMessage(chatData.respuestas[selectedService][2]); // "¿Se han cambiado algunas piezas?"
                subStep++;
                break;
            case 8: // ¿Se han cambiado algunas piezas?
                console.log("Valor de input antes de asignar:", input.trim());
                vehicleData.piezasCambiadas = input.trim();
                console.log("Valor guardado en vehicleData.piezasCambiadas:", vehicleData.piezasCambiadas);
                displayMessage("Gracias por tu respuesta. Ahora necesitamos tu número de teléfono para continuar."); // Pasamos input correctamente
                subStep++;
                break;
            case 9:
                telefono(input);
                break;

            case 10: 
                if (input.trim()) {
                    vehicleData.problema = input.trim();  // Guardar el problema en vehicleData
                    displayMessage(`Gracias por compartir el problema`);
                    displayMessage("Por favor, ingresa tu número de teléfono para continuar:");
                    subStep++;
                } else if (!input.trim()) {
                    displayMessage("Por favor escribe el problema para continuar.");
                }
                break;

            case 11:
                telefono(input);  // Llamar a la función telefono
                break;

            case 12: 
                if (input.trim()) {
                    vehicleData.problema = input.trim();  // Guardar el problema en vehicleData
                    displayMessage(`Gracias por compartir el problema`);
                    displayMessage(`Después de que inició la falla, ¿Cuánto tiempo lleva?`);
                    subStep++;
                } else if (!input.trim()) {
                    displayMessage("Por favor escribe el problema para continuar.");
                }
                break;

            case 13:
                vehicleData.tiempoFalla = input.trim();
                displayMessage("Gracias por tu respuesta. Ahora necesitamos tu número de teléfono para continuar."); // Pasamos input correctamente
                subStep++;
                break;

            case 14:
                telefono(input);
                break;
        }
    }
}


let phoneRequested = false;  // Variable global para controlar si ya se ha solicitado el teléfono
function telefono(input) {
    // Validar número de teléfono
    const phoneRegex = /^[0-9]{10}$/; 
    if (phoneRegex.test(input.trim())) {
        vehicleData.telefono = input.trim();
        displayMessage("Gracias, tu número de teléfono ha sido registrado.");
        displayMessage("Gracias por tu información. Un asesor se pondrá en contacto contigo.");
        console.log(vehicleData);  
        resetChat(); 
    } else if (phoneRequested) {
        displayMessage("Por favor, ingresa un número de teléfono válido (10 dígitos).");
    }
}

function resetChat() {
    step = 0;
    subStep = 0;
    selectedService = null;
    sendEmail(vehicleData);
    vehicleData = {servicio:'', marca: '', modelo: '', anio: '', motor: '', tiempoFalla: '', piezasCambiadas: '', problema: '', afinacionfalla: '', moduloprog: '' };
    setTimeout(() => nextStep(), 2000); // Reiniciar con un pequeño retraso
}

function sendEmail(data) {
    emailjs.init('6KZhcD5-IfAMvqBm_'); 

    const emailParams = {
        servicio: data.servicio,
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio,
        motor: data.motor,
        tiempoFalla: data.tiempoFalla || 'N/A',
        piezasCambiadas: data.piezasCambiadas || 'N/A',
        problema: data.problema || 'N/A',
        afinacionfalla: data.afinacionfalla || 'N/A',
        telefono: data.telefono,
        moduloprog: data.moduloprog || 'N/A'
    };

    emailjs.send("service_owwpmvg", "template_1c65z79", emailParams)
        .then((response) => {
            console.log("Correo enviado exitosamente", response);
            displayMessage("Tu información ha sido enviada exitosamente a un asesor.");
        })
        .catch((error) => {
            console.error("Error al enviar el correo", error);
            displayMessage("Hubo un problema al enviar tu información. Por favor, intenta nuevamente.");
        });
}

sendButton.addEventListener('click', () => {
    const userText = userInput.value.trim();
    if (userText) {
        displayMessage(userText, true);
        userInput.value = '';
        nextStep(userText);
    }
});

// Inicia el chatbot
nextStep();


