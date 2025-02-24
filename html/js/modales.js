document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.modal);
      modal.classList.add('show');
    });
  });
  
  document.querySelectorAll('.close-modal').forEach(close => {
    close.addEventListener('click', () => {
      close.closest('.modal').classList.remove('show');
    });
  });
  