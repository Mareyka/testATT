(function () {
    'use strict';

    /*бургер-меню */
    (function initBurger() {
        var burger = document.getElementById('burger');
        var mobileMenu = document.getElementById('mobileMenu');
        if (!burger || !mobileMenu) return;

        burger.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.toggle('header__mobile-menu--open');
            burger.classList.toggle('header__burger--active', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('no-scroll', isOpen);
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('header__mobile-menu--open');
                burger.classList.remove('header__burger--active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) {
                mobileMenu.classList.remove('header__mobile-menu--open');
                burger.classList.remove('header__burger--active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    })();

    (function initSmoothScroll() {
        // Функция для очень плавного скролла
        function smoothScrollTo(targetPosition, duration) {
            duration = duration || 800;
            var startPosition = window.pageYOffset;
            var distance = targetPosition - startPosition;
            var startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                var timeElapsed = currentTime - startTime;
                var progress = Math.min(timeElapsed / duration, 1);


                var ease = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }

        var triggers = document.querySelectorAll('[data-scroll]');

        triggers.forEach(function (el) {
            el.addEventListener('click', function (event) {
                event.preventDefault();

                var targetSelector = el.dataset.target || el.getAttribute('href');
                if (!targetSelector || targetSelector.charAt(0) !== '#') return;

                var target = document.querySelector(targetSelector);
                if (!target) return;

                // Вычисляем высоту шапки
                var header = document.querySelector('.header');
                var headerHeight = header ? header.offsetHeight : 0;


                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;


                smoothScrollTo(targetPosition, 900);
            });
        });
    })();

    /*слайдер */
    (function initReviewsSlider() {
        var track = document.getElementById('reviewsTrack');
        var prevBtn = document.getElementById('reviewsPrev');
        var nextBtn = document.getElementById('reviewsNext');
        if (!track || !prevBtn || !nextBtn) return;

        function getStep() {
            var card = track.querySelector('.reviews__card');
            if (!card) return track.clientWidth;
            var gap = parseFloat(getComputedStyle(track).gap) || 0;
            return card.getBoundingClientRect().width + gap;
        }

        prevBtn.addEventListener('click', function () {
            track.scrollBy({ left: -getStep(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', function () {
            track.scrollBy({ left: getStep(), behavior: 'smooth' });
        });
    })();

    /* календарь */
    function formatDate(date) {
        var day = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var year = date.getFullYear();
        return day + '.' + month + '.' + year;
    }

    function parseDate(value) {
        if (!value) return null;
        var parts = value.split('.');
        if (parts.length !== 3) return null;
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var year = parseInt(parts[2], 10);
        var date = new Date(year, month, day);
        return isNaN(date.getTime()) ? null : date;
    }

    (function initDatePickers() {
        var dateFromInput = document.getElementById('dateFrom');
        var dateToInput = document.getElementById('dateTo');
        if (!dateFromInput || !dateToInput || typeof Pikaday === 'undefined') return;

        var pickerFrom = new Pikaday({
            field: dateFromInput,
            firstDay: 1,
            toString: formatDate,
            parse: parseDate,
            onSelect: function (date) {
                pickerTo.setMinDate(date);
            }
        });

        var pickerTo = new Pikaday({
            field: dateToInput,
            firstDay: 1,
            toString: formatDate,
            parse: parseDate,
            onSelect: function (date) {
                pickerFrom.setMaxDate(date);
            }
        });
    })();

    /* поиск */
    (function initScheduleForm() {
        var form = document.getElementById('scheduleForm');
        var resultText = document.getElementById('scheduleResult');
        var grid = document.getElementById('scheduleGrid');
        if (!form || !grid) return;

        var cards = Array.from(grid.querySelectorAll('.schedule__card'));

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var dateFromValue = document.getElementById('dateFrom').value.trim();
            var dateToValue = document.getElementById('dateTo').value.trim();
            var dateFrom = parseDate(dateFromValue);
            var dateTo = parseDate(dateToValue);

            var visibleCount = 0;

            cards.forEach(function (card) {
                var cardDate = new Date(card.dataset.date);
                var isVisible = true;

                if (dateFrom && cardDate < dateFrom) isVisible = false;
                if (dateTo && cardDate > dateTo) isVisible = false;

                card.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount += 1;
            });

            if (resultText) {
                resultText.textContent = visibleCount > 0 ?
                    'Найдено вариантов: ' + visibleCount :
                    'По заданным датам экскурсий не найдено. Попробуйте изменить диапазон дат.';
            }
        });
    })();

    /* бронировать */
    (function initReserveButtons() {
        var buttons = document.querySelectorAll('.schedule__card-btn');

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                button.textContent = 'Забронировано ✓';
                button.disabled = true;
            });
        });
    })();


    (function initCurrencyDropdown() {
        var toggle = document.getElementById('currencyToggle');
        var menu = document.getElementById('currencyMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('dropdown__menu--open');
        });

        document.addEventListener('click', function () {
            menu.classList.remove('dropdown__menu--open');
        });

        menu.querySelectorAll('.dropdown__item').forEach(function (item) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                var currency = this.dataset.currency || this.textContent.trim();
                var langSpan = toggle.querySelector('.header__lang');
                if (langSpan) {
                    langSpan.textContent = currency;
                }
                menu.classList.remove('dropdown__menu--open');
            });
        });
    })();


    (function initContactsDropdown() {
        var toggle = document.getElementById('contactsToggle');
        var menu = document.getElementById('contactsMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('dropdown__menu--open');
        });

        document.addEventListener('click', function () {
            menu.classList.remove('dropdown__menu--open');
        });
    })();

})();

/* список валют */
(function initCurrencyDropdownMobile() {
    var toggle = document.getElementById('currencyToggleMobile');
    var menu = document.getElementById('currencyMenuMobile');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('dropdown__menu--open');
    });

    document.addEventListener('click', function () {
        menu.classList.remove('dropdown__menu--open');
    });

    menu.querySelectorAll('.dropdown__item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            var currency = this.dataset.currency || this.textContent.trim();
            var langSpan = toggle.querySelector('.header__lang');
            if (langSpan) {
                langSpan.textContent = currency;
            }
            menu.classList.remove('dropdown__menu--open');
        });
    });
})();

/* список контактов */
(function initContactsDropdownMobile() {
    var toggle = document.getElementById('contactsToggleMobile');
    var menu = document.getElementById('contactsMenuMobile');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('dropdown__menu--open');
    });

    document.addEventListener('click', function () {
        menu.classList.remove('dropdown__menu--open');
    });
})();


document.addEventListener('DOMContentLoaded', function () {
    const toggleButtons = document.querySelectorAll('.reviews__toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.dataset.target;
            const textElement = document.getElementById(targetId);

            if (!textElement) return;

            // Переключаем классы
            if (textElement.classList.contains('reviews__text--collapsed')) {
                textElement.classList.remove('reviews__text--collapsed');
                textElement.classList.add('reviews__text--expanded');
                this.querySelector('.reviews__toggle-text').textContent = 'свернуть';
            } else {
                textElement.classList.remove('reviews__text--expanded');
                textElement.classList.add('reviews__text--collapsed');
                this.querySelector('.reviews__toggle-text').textContent = 'далее...';
            }
        });
    });
});