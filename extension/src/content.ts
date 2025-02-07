import App from './components/App.svelte';

const target = document.createElement('div');
target.id = 'web-note-app';
document.body.appendChild(target);

new App({
  target,
});
