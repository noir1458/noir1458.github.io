if ("serviceWorker" in navigator && import.meta.env.PROD) {
  const registerServiceWorker = async () => {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none"
    });
    if (!registration.installing) await registration.update();
  };

  const startRegistration = () => {
    registerServiceWorker().catch((error) =>
      console.warn("Unable to register the service worker.", error)
    );
  };

  if (document.readyState === "complete") startRegistration();
  else window.addEventListener("load", startRegistration, { once: true });
}
