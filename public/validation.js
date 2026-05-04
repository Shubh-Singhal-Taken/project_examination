// Bootstrap client-side validation + date range check
(function () {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            // Date range validation
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

        // Clear custom validity on change so re-validation works
        const departure = form.querySelector('#departureDate');
        if (departure) {
            departure.addEventListener('change', function () {
                departure.setCustomValidity('');
            });
        }
    });
})();
