document.addEventListener('htmx:configRequest', () => {
  document.getElementById('loading-spinner').classList.remove('hidden');
});

document.addEventListener('htmx:afterRequest', () => {
  document.getElementById('loading-spinner').classList.add('hidden');
});