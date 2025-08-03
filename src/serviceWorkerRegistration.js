// serviceWorkerRegistration.js

export function register() {
  // PWA 機能を使わないので空関数
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
