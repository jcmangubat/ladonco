(function (html) {
  "use strict";

  const cfg = {
    // Countdown Timer Final Date
    finalDate: "August 16, 2025 00:00:00",
  };

  /* Preloader
   * -------------------------------------------------- */
  const ssPreloader = function () {
    const body = document.querySelector("body");
    const preloader = document.querySelector("#preloader");
    const info = document.querySelector(".s-info");

    if (!(preloader && info)) return;

    html.classList.add("ss-preload");

    window.addEventListener("load", function () {
      html.classList.remove("ss-preload");
      html.classList.add("ss-loaded");

      // page scroll position to top
      preloader.addEventListener("transitionstart", function gotoTop(e) {
        if (e.target.matches("#preloader")) {
          window.scrollTo(0, 0);
          preloader.removeEventListener(e.type, gotoTop);
        }
      });

      preloader.addEventListener("transitionend", function afterTransition(e) {
        if (e.target.matches("#preloader")) {
          body.classList.add("ss-show");
          e.target.style.display = "none";
          preloader.removeEventListener(e.type, afterTransition);
        }
      });
    });

    window.addEventListener("beforeunload", function () {
      body.classList.remove("ss-show");
    });
  };

  /* Countdown Timer
   * ------------------------------------------------------ */
  const ssCountdown = function () {
    const finalDate = new Date(cfg.finalDate).getTime();
    const daysSpan = document.querySelector(".counter .ss-days");
    const hoursSpan = document.querySelector(".counter .ss-hours");
    const minutesSpan = document.querySelector(".counter .ss-minutes");
    const secondsSpan = document.querySelector(".counter .ss-seconds");
    let timeInterval;

    if (!(daysSpan && hoursSpan && minutesSpan && secondsSpan)) return;

    function timer() {
      const now = new Date().getTime();
      let diff = finalDate - now;

      if (diff <= 0) {
        if (timeInterval) {
          clearInterval(timeInterval);
        }
        return;
      }

      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((diff / 1000 / 60) % 60);
      let seconds = Math.floor((diff / 1000) % 60);

      if (days <= 99) {
        if (days <= 9) {
          days = "00" + days;
        } else {
          days = "0" + days;
        }
      }

      hours <= 9 ? (hours = "0" + hours) : hours;
      minutes <= 9 ? (minutes = "0" + minutes) : minutes;
      seconds <= 9 ? (seconds = "0" + seconds) : seconds;

      daysSpan.textContent = days;
      hoursSpan.textContent = hours;
      minutesSpan.textContent = minutes;
      secondsSpan.textContent = seconds;
    }

    timer();
    timeInterval = setInterval(timer, 1000);
  };

  /* Swiper
   * ------------------------------------------------------ */
  const ssSwiper = function () {
    const mySwiper = new Swiper(".swiper-container", {
      slidesPerView: 1,
      effect: "fade",
      speed: 2000,
      autoplay: {
        delay: 5000,
      },
    });
  };

  /* Tabs
   * ---------------------------------------------------- */
  const sstabs = function (nextTab = false) {
    const tabList = document.querySelector(".tab-nav__list");
    const tabPanels = document.querySelectorAll(".tab-content__item");
    const tabItems = document.querySelectorAll(".tab-nav__list li");
    const tabLinks = [];

    if (!(tabList && tabPanels)) return;

    const tabClickEvent = function (
      tabLink,
      tabLinks,
      tabPanels,
      linkIndex,
      e
    ) {
      // Reset all the tablinks
      tabLinks.forEach(function (link) {
        link.setAttribute("tabindex", "-1");
        link.setAttribute("aria-selected", "false");
        link.parentNode.removeAttribute("data-tab-active");
        link.removeAttribute("data-tab-active");
      });

      // set the active link attributes
      tabLink.setAttribute("tabindex", "0");
      tabLink.setAttribute("aria-selected", "true");
      tabLink.parentNode.setAttribute("data-tab-active", "");
      tabLink.setAttribute("data-tab-active", "");

      // Change tab panel visibility
      tabPanels.forEach(function (panel, index) {
        if (index != linkIndex) {
          panel.setAttribute("aria-hidden", "true");
          panel.removeAttribute("data-tab-active");
        } else {
          panel.setAttribute("aria-hidden", "false");
          panel.setAttribute("data-tab-active", "");
        }
      });

      window.dispatchEvent(new Event("resize"));
    };

    const keyboardEvent = function (
      tabLink,
      tabLinks,
      tabPanels,
      tabItems,
      index,
      e
    ) {
      let keyCode = e.keyCode;
      let currentTab = tabLinks[index];
      let previousTab = tabLinks[index - 1];
      let nextTab = tabLinks[index + 1];
      let firstTab = tabLinks[0];
      let lastTab = tabLinks[tabLinks.length - 1];

      // ArrowRight and ArrowLeft are the values when event.key is supported
      switch (keyCode) {
        case "ArrowLeft":
        case 37:
          e.preventDefault();

          if (!previousTab) {
            lastTab.focus();
          } else {
            previousTab.focus();
          }
          break;

        case "ArrowRight":
        case 39:
          e.preventDefault();

          if (!nextTab) {
            firstTab.focus();
          } else {
            nextTab.focus();
          }
          break;
      }
    };

    // Add accessibility roles and labels
    tabList.setAttribute("role", "tablist");
    tabItems.forEach(function (item, index) {
      let link = item.querySelector("a");

      // collect tab links
      tabLinks.push(link);
      item.setAttribute("role", "presentation");

      if (index == 0) {
        item.setAttribute("data-tab-active", "");
      }
    });

    // Set up tab links
    tabLinks.forEach(function (link, i) {
      let anchor = link.getAttribute("href").split("#")[1];
      let attributes = {
        id: "tab-link-" + i,
        role: "tab",
        tabIndex: "-1",
        "aria-selected": "false",
        "aria-controls": anchor,
      };

      // if it's the first element update the attributes
      if (i == 0) {
        attributes["aria-selected"] = "true";
        attributes.tabIndex = "0";
        link.setAttribute("data-tab-active", "");
      }

      // Add the various accessibility roles and labels to the links
      for (var key in attributes) {
        link.setAttribute(key, attributes[key]);
      }

      // Click Event Listener
      link.addEventListener("click", function (e) {
        e.preventDefault();
      });

      // Click Event Listener
      link.addEventListener("focus", function (e) {
        tabClickEvent(this, tabLinks, tabPanels, i, e);
      });

      // Keyboard event listener
      link.addEventListener("keydown", function (e) {
        keyboardEvent(link, tabLinks, tabPanels, tabItems, i, e);
      });
    });

    // Set up tab panels
    tabPanels.forEach(function (panel, i) {
      let attributes = {
        role: "tabpanel",
        "aria-hidden": "true",
        "aria-labelledby": "tab-link-" + i,
      };

      if (nextTab) {
        let nextTabLink = document.createElement("a");
        let nextTabLinkIndex = i < tabPanels.length - 1 ? i + 1 : 0;

        // set up next tab link
        nextTabLink.setAttribute("href", "#tab-link-" + nextTabLinkIndex);
        nextTabLink.textContent = "Next Tab";
        panel.appendChild(nextTabLink);
      }

      if (i == 0) {
        attributes["aria-hidden"] = "false";
        panel.setAttribute("data-tab-active", "");
      }

      for (let key in attributes) {
        panel.setAttribute(key, attributes[key]);
      }
    });
  };

  /* Alert Boxes
   * ------------------------------------------------------ */
  const ssAlertBoxes = function () {
    const boxes = document.querySelectorAll(".alert-box");

    boxes.forEach(function (box) {
      box.addEventListener("click", function (event) {
        if (event.target.matches(".alert-box__close")) {
          event.stopPropagation();
          event.target.parentElement.classList.add("hideit");

          setTimeout(function () {
            box.style.display = "none";
          }, 500);
        }
      });
    });
  };

  /* Smooth Scrolling
   * ------------------------------------------------------ */
  const ssMoveTo = function () {
    const easeFunctions = {
      easeInQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      },
      easeInOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      },
      easeInOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      },
    };

    const triggers = document.querySelectorAll(".smoothscroll");

    const moveTo = new MoveTo(
      {
        tolerance: 0,
        duration: 1200,
        easing: "easeInOutCubic",
        container: window,
      },
      easeFunctions
    );

    triggers.forEach(function (trigger) {
      moveTo.registerTrigger(trigger);
    });
  };

  /* Initialize
   * ------------------------------------------------------ */
  (function ssInit() {
    ssPreloader();
    ssCountdown();
    ssSwiper();
    sstabs();
    ssAlertBoxes();
    ssMoveTo();

    document.getElementById("mc-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const form = e.target;
      const email = form.querySelector('[name="EMAIL"]').value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate email format
      if (!emailRegex.test(email)) {
        document.querySelector(".mc-status").textContent =
          "❌ Please enter a valid email address.";
        return; // Stop the submission
      }

      const data = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: data,
      })
        .then((response) => response.text())
        .then((result) => {
          const status = document.querySelector(".mc-status");

          if (result === "Duplicate") {
            status.textContent = "⚠️ This email is already subscribed.";
          } else {
            status.textContent = "✅ Thank you for subscribing!";
            form.reset();
          }
        })
        .catch(() => {
          document.querySelector(".mc-status").textContent =
            "⚠️ Oops! Something went wrong.";
        });
    });
    
  })();
})(document.documentElement);
