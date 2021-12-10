"use strict";

const header = document.querySelector(".header");
const sections = document.querySelectorAll(".section");

const lazyImgs = document.querySelectorAll("img[data-src]");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");
const navlinkContainer = document.querySelector(".nav__links");

const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabContents = document.querySelectorAll(".operations__content");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

const navLinkHover = function (opacity, e) {
  if (e.target.classList.contains("nav__link")) {
    const logo = nav.querySelector(".nav__logo");
    const clickedLink = e.target;
    const siblings = clickedLink
      .closest(".nav__links")
      .querySelectorAll(".nav__link");
    siblings.forEach((node) => {
      if (node !== clickedLink) node.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener("mouseover", navLinkHover.bind(null, 0.5));
nav.addEventListener("mouseout", navLinkHover.bind(null, 1));

const headerCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerOptions = {
  root: null,
  threshold: 0,
  rootMargin: "-90px",
};

const headerObserver = new IntersectionObserver(headerCallback, headerOptions);
headerObserver.observe(header);

const sectionCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  sectionCallback,
  sectionOptions
);
sections.forEach((sec) => {
  sec.classList.add("section--hidden");
  sectionObserver.observe(sec);
});

const lazyCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = `${entry.target.getAttribute("data-src")}`;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
    observer.unobserve(entry.target);
  });
};

const lazyOptions = {
  root: null,
  threshold: 0,
  rootMargin: "200px",
};

const lazyObserver = new IntersectionObserver(lazyCallback, lazyOptions);
lazyImgs.forEach((img) => lazyObserver.observe(img));

navlinkContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    const sec = document.querySelector(id);
    sec.scrollIntoView({ behavior: "smooth" });
  }
});

tabContainer.addEventListener("click", function (e) {
  const clickedTab = e.target.closest(".operations__tab");
  if (!clickedTab) return;

  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clickedTab.classList.add("operations__tab--active");

  const clickedContent = document.querySelector(
    `.operations__content--${clickedTab.getAttribute("data-tab")}`
  );

  tabContents.forEach((tc) =>
    tc.classList.remove("operations__content--active")
  );
  clickedContent.classList.add("operations__content--active");
});

const slider = document.querySelector(".slider");
const slides = slider.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

let currSlide = 0;
const maxSlideLen = slides.length;

const creatdeDots = function () {
  slides.forEach((_, i) => {
    const htmlString = `<button class="dots__dot" data-dot="${i}"></button>`;
    dotsContainer.insertAdjacentHTML("beforeend", htmlString);
  });
};

const activateDots = function (currSlide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-dot="${currSlide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (currSlide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - currSlide)}%)`;
  });
};

const init = function () {
  goToSlide(currSlide);
  creatdeDots();
  activateDots(currSlide);
};

init();

const nextSlide = function () {
  if (currSlide === maxSlideLen - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDots(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlideLen - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDots(currSlide);
};

btnLeft.addEventListener("click", prevSlide);
btnRight.addEventListener("click", nextSlide);
