function validateCancellationForm(cancellationData) {
    var errors = {
        firstName: document.getElementById("firstNameError"),
        lastName: document.getElementById("lastNameError"),
        email: document.getElementById("emailError"),
        phoneNumber: document.getElementById("phoneNumberError"),
        speakers: document.getElementById("speakersError")
    };

    Object.keys(errors).forEach(function (field) {
        errors[field].textContent = "";
    });

    var isValid = true;
    var email = (cancellationData.email || "").trim();
    var phoneDigits = (cancellationData.phoneNumber || "").replace(/\D/g, "");

    if (!(cancellationData.firstName || "").trim()) {
        errors.firstName.textContent = "This field is required.";
        isValid = false;
    }

    if (!(cancellationData.lastName || "").trim()) {
        errors.lastName.textContent = "This field is required.";
        isValid = false;
    }

    if (!email) {
        errors.email.textContent = "This field is required.";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email.textContent = "Please enter a valid email address.";
        isValid = false;
    }

    if (!phoneDigits) {
        errors.phoneNumber.textContent = "This field is required.";
        isValid = false;
    } else if (phoneDigits.length !== 10) {
        errors.phoneNumber.textContent = "Please enter a valid 10-digit phone number.";
        isValid = false;
    }

    if (!Array.isArray(cancellationData.speakers) || cancellationData.speakers.length === 0) {
        errors.speakers.textContent = "Select at least one speaker.";
        isValid = false;
    }

    return isValid;
}
