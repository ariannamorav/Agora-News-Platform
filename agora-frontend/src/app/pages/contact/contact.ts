import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  formData: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  sending = false;
  successMessage = '';
  errorMessage = '';

  submitForm(form: NgForm): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.errorMessage = 'Revisa los campos e introduce los datos correctamente.';
      return;
    }

    const name = this.formData.name.trim();
    const email = this.formData.email.trim();
    const message = this.formData.message.trim();

    if (name.length < 3 || message.length < 10) {
      this.errorMessage = 'Comprueba el nombre y la longitud del mensaje.';
      return;
    }

    this.sending = true;

    try {
      const storedMessages = JSON.parse(
        localStorage.getItem('agora-contact-messages') ?? '[]'
      );

      const messages = Array.isArray(storedMessages)
        ? storedMessages
        : [];

      messages.push({
        id: Date.now(),
        name,
        email,
        subject: this.formData.subject,
        message,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem(
        'agora-contact-messages',
        JSON.stringify(messages)
      );

      this.successMessage =
        '¡Gracias por escribirnos! Tu mensaje se ha guardado en este navegador.';

      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };

      form.resetForm(this.formData);
    } catch {
      this.errorMessage =
        'No fue posible guardar el mensaje. Comprueba el almacenamiento del navegador.';
    } finally {
      this.sending = false;
    }
  }
}