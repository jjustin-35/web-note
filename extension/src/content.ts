// content script can only use dynamic import
(async () => {
  const { default: App } = await import('./components/App.svelte');

const target = document.createElement('div');
target.id = 'web-note-app';
document.body.appendChild(target);

new App({
  target,
});
})();