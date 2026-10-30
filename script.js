/* ==========================================================
   script.js - Portfolio Dea Ayu Riska Amalia
   Fitur: Dark Mode, Menu Mobile, Menu Aktif, Progress Bar Skill,
          Validasi Form, Pesan Berhasil, Tampilan Data Form
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------------------------------------------------------
     1. DARK MODE (disimpan di localStorage)
     --------------------------------------------------------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var themeIcon = document.getElementById("themeIcon");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var isDark = theme === "dark";
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap",
    );
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem("tema");
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("tema", theme);
    } catch (e) {
      /* abaikan jika penyimpanan tidak tersedia */
    }
  }

  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(getSavedTheme() || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });

  /* ---------------------------------------------------------
     2. FOTO PROFIL CADANGAN (jika foto-profil.jpg belum ada)
     --------------------------------------------------------- */
  var foto = document.getElementById("fotoProfil");

  function pasangFotoCadangan() {
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='360' height='420' viewBox='0 0 360 420'>" +
      "<rect width='360' height='420' fill='#3555e0'/>" +
      "<text x='50%' y='54%' text-anchor='middle' font-family='Arial, sans-serif' " +
      "font-size='120' font-weight='700' fill='#ffffff'>DA</text></svg>";
    foto.onerror = null;
    foto.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  foto.addEventListener("error", pasangFotoCadangan);
  if (foto.complete && foto.naturalWidth === 0) {
    pasangFotoCadangan();
  }

  /* ---------------------------------------------------------
     3. MENU MOBILE (hamburger)
     --------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var navWrap = document.querySelector(".nav-wrap");
  var menuLinks = document.querySelectorAll(".menu-link");

  function setMenu(open) {
    navWrap.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }

  menuToggle.addEventListener("click", function () {
    setMenu(!navWrap.classList.contains("open"));
  });

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setMenu(false);
    }
  });

  /* ---------------------------------------------------------
     4. BAYANGAN NAVBAR SAAT SCROLL
     --------------------------------------------------------- */
  var navbar = document.getElementById("navbar");

  function cekScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", cekScroll, { passive: true });
  cekScroll();

  /* ---------------------------------------------------------
     5. MENU AKTIF MENGIKUTI SECTION
     --------------------------------------------------------- */
  var sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    var menuObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            menuLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + entry.target.id,
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach(function (sec) {
      menuObserver.observe(sec);
    });
  }

  /* ---------------------------------------------------------
     6. PROGRESS BAR SKILL (animasi saat terlihat)
     --------------------------------------------------------- */
  var skillSection = document.getElementById("skill");
  var fills = document.querySelectorAll(".progress-fill");
  var skillAnimated = false;

  function animasiSkill() {
    if (skillAnimated) return;
    skillAnimated = true;

    fills.forEach(function (fill) {
      var level = parseInt(fill.getAttribute("data-level"), 10);
      var label = fill.closest(".skill-item").querySelector(".skill-percent");
      fill.style.width = level + "%";

      var angka = 0;
      var timer = setInterval(function () {
        angka += 1;
        if (angka >= level) {
          angka = level;
          clearInterval(timer);
        }
        label.textContent = angka + "%";
      }, 14);
    });
  }

  if ("IntersectionObserver" in window) {
    var skillObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          animasiSkill();
          skillObserver.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    skillObserver.observe(skillSection);
  } else {
    animasiSkill();
  }

  /* ---------------------------------------------------------
     7. VALIDASI FORM KONTAK
     --------------------------------------------------------- */
  var form = document.getElementById("formKontak");
  var inputNama = document.getElementById("nama");
  var inputEmail = document.getElementById("email");
  var inputPesan = document.getElementById("pesan");

  var errNama = document.getElementById("errNama");
  var errEmail = document.getElementById("errEmail");
  var errPesan = document.getElementById("errPesan");

  var pesanBerhasil = document.getElementById("pesanBerhasil");
  var hasilKirim = document.getElementById("hasilKirim");

  var polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function tampilkanError(input, elemenError, teks) {
    elemenError.textContent = teks;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function hapusError(input, elemenError) {
    elemenError.textContent = "";
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  }

  function validasiNama() {
    if (inputNama.value.trim() === "") {
      tampilkanError(inputNama, errNama, "Nama tidak boleh kosong.");
      return false;
    }
    hapusError(inputNama, errNama);
    return true;
  }

  function validasiEmail() {
    var nilai = inputEmail.value.trim();
    if (nilai === "") {
      tampilkanError(inputEmail, errEmail, "Email tidak boleh kosong.");
      return false;
    }
    if (!polaEmail.test(nilai)) {
      tampilkanError(
        inputEmail,
        errEmail,
        "Format email tidak valid. Contoh: nama@email.com",
      );
      return false;
    }
    hapusError(inputEmail, errEmail);
    return true;
  }

  function validasiPesan() {
    if (inputPesan.value.trim() === "") {
      tampilkanError(inputPesan, errPesan, "Pesan tidak boleh kosong.");
      return false;
    }
    hapusError(inputPesan, errPesan);
    return true;
  }

  /* Validasi langsung saat pengguna mengetik / meninggalkan kolom */
  inputNama.addEventListener("input", function () {
    if (inputNama.classList.contains("invalid")) validasiNama();
  });
  inputEmail.addEventListener("input", function () {
    if (inputEmail.classList.contains("invalid")) validasiEmail();
  });
  inputPesan.addEventListener("input", function () {
    if (inputPesan.classList.contains("invalid")) validasiPesan();
  });
  inputEmail.addEventListener("blur", function () {
    if (inputEmail.value.trim() !== "") validasiEmail();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    /* jalankan semua validasi agar semua pesan error muncul sekaligus */
    var namaOk = validasiNama();
    var emailOk = validasiEmail();
    var pesanOk = validasiPesan();

    if (!(namaOk && emailOk && pesanOk)) {
      pesanBerhasil.hidden = true;
      hasilKirim.hidden = true;

      var pertama = form.querySelector(".invalid");
      if (pertama) pertama.focus();
      return;
    }

    /* Ambil data lebih dulu sebelum form dikosongkan */
    var nama = inputNama.value.trim();
    var email = inputEmail.value.trim();
    var pesan = inputPesan.value.trim();

    /* Pesan berhasil */
    pesanBerhasil.textContent =
      "Terima kasih, " + nama + "! Pesan Anda berhasil dikirim.";
    pesanBerhasil.hidden = false;

    /* Tampilkan data form di bawah form (textContent = aman dari injeksi HTML) */
    document.getElementById("hasilNama").textContent = nama;
    document.getElementById("hasilEmail").textContent = email;
    document.getElementById("hasilPesan").textContent = pesan;
    hasilKirim.hidden = false;

    form.reset();
  });

  /* ---------------------------------------------------------
     8. TAHUN OTOMATIS DI FOOTER
     --------------------------------------------------------- */
  var tahun = document.getElementById("tahun");
  if (tahun) tahun.textContent = new Date().getFullYear();
});
