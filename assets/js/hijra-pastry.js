const whatsappBaseUrl = "https://wa.me/6281293933271";

const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const orderForm = document.getElementById("order-form");
const revealEls = document.querySelectorAll(".reveal");
const testimonialTrack = document.querySelector("[data-testimonial-track]");
const testimonialPrev = document.querySelector("[data-testimonial-prev]");
const testimonialNext = document.querySelector("[data-testimonial-next]");
const testimonialDots = [
  ...document.querySelectorAll("[data-testimonial-dot]"),
];
const resellerCarousel = document.querySelector("[data-reseller-carousel]");
const resellerTrack = document.querySelector("[data-reseller-track]");
const resellerDotsContainer = document.querySelector("[data-reseller-dots]");

const closeMenu = () => {
  if (!navbar || !hamburger) {
    return;
  }

  navbar.classList.remove("open");
  document.body.classList.remove("menu-open");
  hamburger.setAttribute("aria-expanded", "false");
};

if (navbar && hamburger) {
  hamburger.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node) || navbar.contains(target)) {
      return;
    }

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const desktopMediaQuery = window.matchMedia("(min-width: 921px)");
  const handleViewportChange = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (typeof desktopMediaQuery.addEventListener === "function") {
    desktopMediaQuery.addEventListener("change", handleViewportChange);
  } else {
    desktopMediaQuery.addListener(handleViewportChange);
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealEls.forEach((element) => observer.observe(element));
} else {
  revealEls.forEach((element) => element.classList.add("visible"));
}

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(orderForm);
    const name = String(formData.get("name") || "").trim();
    const product = String(formData.get("product") || "").trim();
    const qty = String(formData.get("qty") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!name || !product) {
      alert("Mohon isi Nama dan Produk terlebih dahulu 🙏");
      (name
        ? document.getElementById("f-product")
        : document.getElementById("f-name")
      )?.focus();
      return;
    }

    let message = "Halo Hijra Pastry! Saya ingin memesan:\n\n";
    message += `👤 Nama: ${name}\n`;
    message += `🛒 Produk: ${product}\n`;

    if (qty) {
      message += `📦 Jumlah: ${qty}\n`;
    }

    if (notes) {
      message += `📝 Catatan: ${notes}\n`;
    }

    message += "\nMohon informasi ketersediaan dan harga. Terima kasih! 🙏";

    const url = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
    const orderWindow = window.open(url, "_blank", "noopener,noreferrer");

    if (!orderWindow) {
      window.location.href = url;
    }
  });
}

if (testimonialTrack && testimonialDots.length) {
  const slides = [...testimonialTrack.querySelectorAll(".testimonial-card")];
  let currentSlide = 0;

  const renderTestimonial = (index) => {
    const normalizedIndex = (index + slides.length) % slides.length;
    currentSlide = normalizedIndex;
    testimonialTrack.style.transform = `translateX(-${normalizedIndex * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === normalizedIndex);
      slide.setAttribute("aria-hidden", String(slideIndex !== normalizedIndex));
    });

    testimonialDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === normalizedIndex);
      dot.setAttribute("aria-pressed", String(dotIndex === normalizedIndex));
    });
  };

  testimonialPrev?.addEventListener("click", () => {
    renderTestimonial(currentSlide - 1);
  });

  testimonialNext?.addEventListener("click", () => {
    renderTestimonial(currentSlide + 1);
  });

  testimonialDots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      renderTestimonial(dotIndex);
    });
  });

  renderTestimonial(0);
}

if (resellerCarousel && resellerTrack && resellerDotsContainer) {
  const cards = [...resellerTrack.querySelectorAll(".reseller-store-card")];
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  let resellerDots = [];
  let currentStoreIndex = 0;
  let autoAdvanceId = 0;

  const getVisibleStoreCount = () => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      return 1;
    }

    if (window.matchMedia("(max-width: 920px)").matches) {
      return 2;
    }

    return 4;
  };

  const getMaxStoreIndex = () =>
    Math.max(0, cards.length - getVisibleStoreCount());

  const stopAutoAdvance = () => {
    if (!autoAdvanceId) {
      return;
    }

    window.clearInterval(autoAdvanceId);
    autoAdvanceId = 0;
  };

  const renderResellerDots = () => {
    const stepCount = getMaxStoreIndex() + 1;

    if (resellerDots.length === stepCount) {
      return;
    }

    resellerDotsContainer.innerHTML = "";
    resellerDots = Array.from({ length: stepCount }, (_, stepIndex) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "reseller-store-dot";
      dot.setAttribute(
        "aria-label",
        `Lihat slide mitra reseller ${stepIndex + 1}`,
      );
      dot.addEventListener("click", () => {
        renderReseller(stepIndex);
        startAutoAdvance();
      });
      resellerDotsContainer.appendChild(dot);

      return dot;
    });
  };

  const renderReseller = (index) => {
    renderResellerDots();

    const visibleStoreCount = getVisibleStoreCount();
    const maxStoreIndex = getMaxStoreIndex();
    const normalizedIndex =
      maxStoreIndex === 0 ? 0 : Math.min(Math.max(index, 0), maxStoreIndex);
    const targetCard = cards[normalizedIndex];

    currentStoreIndex = normalizedIndex;
    resellerTrack.style.transform = `translateX(-${targetCard?.offsetLeft ?? 0}px)`;

    cards.forEach((card, cardIndex) => {
      const isVisible =
        cardIndex >= normalizedIndex &&
        cardIndex < normalizedIndex + visibleStoreCount;

      card.classList.toggle("is-active", isVisible);
      card.setAttribute("aria-hidden", String(!isVisible));
    });

    resellerDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === normalizedIndex;

      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    resellerDotsContainer.hidden = resellerDots.length < 2;
  };

  const startAutoAdvance = () => {
    stopAutoAdvance();

    if (reducedMotionQuery.matches || getMaxStoreIndex() === 0) {
      return;
    }

    autoAdvanceId = window.setInterval(() => {
      const maxStoreIndex = getMaxStoreIndex();
      const nextIndex =
        currentStoreIndex >= maxStoreIndex ? 0 : currentStoreIndex + 1;

      renderReseller(nextIndex);
    }, 2800);
  };

  const handleResellerResize = () => {
    currentStoreIndex = Math.min(currentStoreIndex, getMaxStoreIndex());
    renderReseller(currentStoreIndex);
    startAutoAdvance();
  };

  resellerCarousel.classList.add("is-ready");
  resellerCarousel.addEventListener("mouseenter", stopAutoAdvance);
  resellerCarousel.addEventListener("mouseleave", startAutoAdvance);
  resellerCarousel.addEventListener("focusin", stopAutoAdvance);
  resellerCarousel.addEventListener("focusout", (event) => {
    const nextFocusTarget = event.relatedTarget;

    if (
      !(nextFocusTarget instanceof Node) ||
      !resellerCarousel.contains(nextFocusTarget)
    ) {
      startAutoAdvance();
    }
  });
  window.addEventListener("resize", handleResellerResize);

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleResellerResize);
  } else {
    reducedMotionQuery.addListener(handleResellerResize);
  }

  renderReseller(0);
  startAutoAdvance();
}
