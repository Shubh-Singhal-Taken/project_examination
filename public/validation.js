(function () {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            const arrival = form.querySelector('#arrivalDate');
            const departure = form.querySelector('#departureDate');

            if (arrival && departure && arrival.value && departure.value) {
                if (new Date(departure.value) <= new Date(arrival.value)) {
                    departure.setCustomValidity('Departure date must be after arrival date.');
                } else {
                    departure.setCustomValidity('');
                }
            }

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);

        const departure = form.querySelector('#departureDate');
        if (departure) {
            departure.addEventListener('change', function () {
                departure.setCustomValidity('');
            });
        }
    });
})();
