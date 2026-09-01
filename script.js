/* =========================================================
   HAILE — MODERN AFRICAN LUXURY
   Main interaction script
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Small helpers ---------- */
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  /* ---------- Page loader ----------
     Does NOT wait for images or external resources.
     This prevents the website from getting stuck on the H screen.
  */
  function hideLoader() {
    const loader = $("#pageLoader");
    if (!loader) return;

    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.setAttribute("aria-hidden", "true");
    }, 900);
  }

  // Hide the loader when the page finishes loading.
  window.addEventListener("load", hideLoader, { once: true });

  // Safety fallback: the loader can never remain forever.
  window.setTimeout(hideLoader, 1800);


  /* ---------- Header on scroll ---------- */
  const header = $("#siteHeader");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* ---------- Mobile menu ---------- */
  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const mobileMenu = $("#mobileMenu");

  function openMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close menu");
    }

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }

    document.body.classList.remove("menu-open");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (mobileMenu && mobileMenu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  // Close the menu when a navigation link is selected.
  $$(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });


  /* ---------- Keyboard controls ---------- */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });


  /* ---------- Scroll reveal animations ---------- */
  const revealItems = $$(".reveal, .reveal-image");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }


  /* ---------- Custom cursor ---------- */
  const cursorDot = $("#cursorDot");
  const cursorRing = $("#cursorRing");

  if (
    cursorDot &&
    cursorRing &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    $$(
      "a, button, .stage-card, .gallery-item"
    ).forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorRing.classList.add("hover");
      });

      element.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("hover");
      });
    });
  }


  /* ---------- Magnetic buttons ---------- */
  if (window.matchMedia("(pointer: fine)").matches) {
    $$(".magnetic").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();

        const x =
          event.clientX -
          (rect.left + rect.width / 2);

        const y =
          event.clientY -
          (rect.top + rect.height / 2);

        element.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });
    });
  }


  /* ---------- Gallery lightbox ---------- */
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxCloseButton = $("#lightboxClose");

  function openLightbox(image, caption) {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src =
      image.currentSrc || image.src;

    lightboxImage.alt =
      image.alt || "";

    if (lightboxCaption) {
      lightboxCaption.textContent =
        caption || image.alt || "";
    }

    lightbox.classList.add("open");

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("menu-open");
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove("menu-open");

    window.setTimeout(() => {
      if (
        !lightbox.classList.contains("open") &&
        lightboxImage
      ) {
        lightboxImage.removeAttribute("src");
      }
    }, 500);
  }

  $$(".gallery-item").forEach((item) => {
    const image = $("img", item);

    if (!image) return;

    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute(
      "aria-label",
      "Open gallery image"
    );

    const caption =
      $("figcaption", item)?.textContent?.trim() ||
      image.alt;

    item.addEventListener("click", () => {
      openLightbox(image, caption);
    });

    item.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        openLightbox(image, caption);
      }
    });
  });

  if (lightboxCloseButton) {
    lightboxCloseButton.addEventListener(
      "click",
      closeLightbox
    );
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }


  /* ---------- Destination stage ---------- */
  const stageTrack = $("#destinationStageTrack");

  const stageCards = $$(
    ".stage-card",
    stageTrack || document
  );

  function updateStageCard() {
    if (
      !stageTrack ||
      !stageCards.length
    ) {
      return;
    }

    const trackRect =
      stageTrack.getBoundingClientRect();

    const trackCenter =
      trackRect.left +
      trackRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    stageCards.forEach((card) => {
      const rect =
        card.getBoundingClientRect();

      const cardCenter =
        rect.left +
        rect.width / 2;

      const distance =
        Math.abs(cardCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    stageCards.forEach((card) => {
      card.classList.toggle(
        "active",
        card === closestCard
      );
    });
  }

  if (
    stageTrack &&
    stageCards.length
  ) {
    stageTrack.addEventListener(
      "scroll",
      updateStageCard,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateStageCard
    );

    window.setTimeout(
      updateStageCard,
      100
    );
  }


  /* ---------- Smooth anchor scrolling ---------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id =
        link.getAttribute("href");

      if (!id || id === "#") return;

      const target = $(id);

      if (!target) return;

      event.preventDefault();

      closeMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });


  /* ---------- Footer year ---------- */
  const year = $("#year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* ---------- Image error handling ---------- */
  $$("img").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.classList.add(
          "image-load-error"
        );

        image.style.background =
          "#20201d";
      },
      { once: true }
    );
  });

})();
