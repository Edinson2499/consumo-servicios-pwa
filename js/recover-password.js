function openRecoverPasswordModal() {
  const modalEl = document.getElementById('recoverPasswordModal');
  if (!modalEl) return;

  const emailInput = document.getElementById('recoverEmail');
  if (emailInput) {
    emailInput.value = document.getElementById('email')?.value.trim() || '';
    setTimeout(() => emailInput.focus(), 50);
  }

  if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  }
}

function closeRecoverPasswordModal() {
  const modalEl = document.getElementById('recoverPasswordModal');
  if (!modalEl) return;

  if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
    const instance = window.bootstrap.Modal.getInstance(modalEl);
    if (instance) {
      instance.hide();
      return;
    }
  }

  modalEl.classList.remove('show');
  modalEl.setAttribute('aria-hidden', 'true');
}

async function recoverPassword(event) {
  if (event) event.preventDefault();

  const emailInput = document.getElementById('recoverEmail');
  const email = (emailInput?.value || '').trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    showToast('Ingresa un correo válido para recuperar la contraseña', { type: 'warning' });
    return;
  }

  const fbAuthInstance = typeof fbAuth === 'function' ? fbAuth() : null;
  if (window.FIREBASE_CONFIGURED && fbAuthInstance) {
    try {
      await fbAuthInstance.sendPasswordResetEmail(email);
      showToast('Te enviamos un enlace para restablecer tu contraseña.', { type: 'success', delay: 4000 });
      closeRecoverPasswordModal();
      return;
    } catch (err) {
      const code = err && err.code ? err.code : '';
      if (code === 'auth/user-not-found') {
        showToast('Si este correo está registrado, recibirás un enlace de recuperación.', { type: 'info', delay: 4000 });
      } else {
        showToast('No se pudo enviar el enlace de recuperación.', { type: 'error' });
      }
      closeRecoverPasswordModal();
      return;
    }
  }

  const usuarios = safeParse(localStorage.getItem('usuarios'), []);
  const usuario = usuarios.find((u) => String(u.email || '').toLowerCase() === email);

  if (!usuario) {
    showToast('Si este correo está registrado, recibirás un enlace de recuperación.', { type: 'info', delay: 4000 });
    closeRecoverPasswordModal();
    return;
  }

  localStorage.setItem('resetPasswordRequest', JSON.stringify({
    email,
    createdAt: new Date().toISOString(),
    userId: usuario.id || null
  }));

  showToast('Se envió un enlace de recuperación al correo registrado.', { type: 'success', delay: 4000 });
  closeRecoverPasswordModal();
}

document.addEventListener('DOMContentLoaded', function () {
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', openRecoverPasswordModal);
  }

  const recoverPasswordSubmit = document.getElementById('recoverPasswordSubmit');
  if (recoverPasswordSubmit) {
    recoverPasswordSubmit.addEventListener('click', recoverPassword);
  }

  const recoverEmailInput = document.getElementById('recoverEmail');
  if (recoverEmailInput) {
    recoverEmailInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        recoverPassword(event);
      }
    });
  }
});
