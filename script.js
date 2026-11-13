/* =========================================================
   HUELLITAS EN CASA | script.js
   PDF 1: interacción del carrusel manual y lienzo canvas.
   PDF 2: fecha dinámica y manipulación del contenido.
   PDF 3: validación y respuesta del formulario HTML5.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // PDF 2: fecha dinámica dentro del pie de página usando la etiqueta <time>.
  const dateElement = document.getElementById("currentDate");
  if (dateElement) {
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("es-MX", {
      day: "numeric", month: "long", year: "numeric"
    });
    dateElement.dateTime = today.toISOString().slice(0, 10);
  }

  // PDF 1: carrusel manual. Los botones desplazan la galería horizontalmente.
  const track = document.getElementById("petTrack");
  const prevButton = document.querySelector(".carousel-arrow.prev");
  const nextButton = document.querySelector(".carousel-arrow.next");
  const dotsContainer = document.getElementById("petDots");

  if (track && prevButton && nextButton && dotsContainer) {
    const cards = Array.from(track.querySelectorAll(".pet-card"));
    cards.forEach((card, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar mascota ${index + 1}`);
      dot.addEventListener("click", () => {
        track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll("button"));
    const updateDots = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let activeIndex = 0;
      let minDistance = Infinity;
      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < minDistance) { minDistance = distance; activeIndex = index; }
      });
      dots.forEach((dot, index) => dot.classList.toggle("active", index === activeIndex));
    };
    prevButton.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * .8, behavior: "smooth" }));
    nextButton.addEventListener("click", () => track.scrollBy({ left: track.clientWidth * .8, behavior: "smooth" }));
    track.addEventListener("scroll", updateDots, { passive: true });
    window.addEventListener("resize", updateDots);
    updateDots();
  }

  // PDF 1: canvas interactivo. Cada clic agrega una huellita decorativa.
  const canvas = document.getElementById("pawCanvas");
  const pawButton = document.getElementById("pawButton");
  if (canvas && pawButton) {
    const ctx = canvas.getContext("2d");
    const paws = [];
    const drawPaw = (x, y, scale) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#e78e78";
      ctx.beginPath(); ctx.ellipse(0, 8, 13, 10, 0, 0, Math.PI * 2); ctx.fill();
      [[-13,-7],[-5,-15],[6,-15],[14,-7]].forEach(([px,py]) => {
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    };
    const paint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fffaf1";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      paws.forEach(paw => drawPaw(paw.x, paw.y, paw.scale));
      ctx.fillStyle = "#718c73";
      ctx.font = "16px Trebuchet MS";
      ctx.fillText("Cada huellita merece un hogar ♡", 18, 238);
    };
    pawButton.addEventListener("click", () => {
      paws.push({
        x: 35 + Math.random() * (canvas.width - 70),
        y: 35 + Math.random() * 145,
        scale: .65 + Math.random() * .55
      });
      paint();
    });
    paint();
  }

  // PDF 3: formulario. El navegador valida required, type, minlength y pattern.
  // Esta práctica solo muestra una confirmación; no almacena datos personales.
  const form = document.getElementById("adoptForm");
  const status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const applicant = document.getElementById("fullName").value.trim();
      const pet = document.getElementById("petChoice").value;
      status.textContent = `¡Gracias, ${applicant}! Tu solicitud de prueba para conocer a ${pet} está completa.`;
      form.reset();
    });
  }
});
