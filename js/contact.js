// Obtener el formulario
const contactForm =
    document.getElementById("contact-form");


// Escuchar el envío
contactForm.addEventListener(
    "submit",
    function (event) {

        // Evitar que la página se recargue
        event.preventDefault();


        // Obtener los valores
        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        // Elementos de error
        const nameError =
            document.getElementById("name-error");

        const emailError =
            document.getElementById("email-error");

        const subjectError =
            document.getElementById("subject-error");

        const messageError =
            document.getElementById("message-error");

        const successMessage =
            document.getElementById("form-success");


        // Limpiar errores anteriores
        nameError.textContent = "";
        emailError.textContent = "";
        subjectError.textContent = "";
        messageError.textContent = "";
        successMessage.textContent = "";


        // Variable para controlar el formulario
        let isValid = true;


        // VALIDAR NOMBRE

        if (name === "") {

            nameError.textContent =
                "El nombre es obligatorio.";

            isValid = false;

        } else if (name.length < 3) {

            nameError.textContent =
                "El nombre debe tener al menos 3 caracteres.";

            isValid = false;
        }


        // VALIDAR CORREO

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (email === "") {

            emailError.textContent =
                "El correo electrónico es obligatorio.";

            isValid = false;

        } else if (!emailPattern.test(email)) {

            emailError.textContent =
                "Ingresa un correo electrónico válido.";

            isValid = false;
        }


        // VALIDAR ASUNTO

        if (subject === "") {

            subjectError.textContent =
                "El asunto es obligatorio.";

            isValid = false;

        } else if (subject.length < 3) {

            subjectError.textContent =
                "El asunto debe tener al menos 3 caracteres.";

            isValid = false;
        }


        // VALIDAR MENSAJE

        if (message === "") {

            messageError.textContent =
                "El mensaje es obligatorio.";

            isValid = false;

        } else if (message.length < 10) {

            messageError.textContent =
                "El mensaje debe tener al menos 10 caracteres.";

            isValid = false;
        }


        // RESULTADO

        if (!isValid) {

            return;
        }


        // Si todo es correcto
        successMessage.textContent =
            "¡Mensaje enviado correctamente! Gracias por contactarnos.";


        // Limpiar formulario
        contactForm.reset();

    }
);