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
