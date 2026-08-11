/* =================================
   DOUBLE CLICK TO EDIT
================================= */

const editableElements = document.querySelectorAll(".editable");

editableElements.forEach((element) => {

    element.addEventListener("dblclick", function (event) {

        event.stopPropagation();

        this.contentEditable = "true";

        this.focus();

        // Put cursor at the end
        const range = document.createRange();
        range.selectNodeContents(this);
        range.collapse(false);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });


    // When user clicks away, stop editing
    element.addEventListener("blur", function () {
        this.contentEditable = "false";
    });


    // Press Enter = finish editing
    element.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            this.blur();
        }
    });

});


/* =================================
   POSTER UPLOAD
================================= */

const posterContainer = document.getElementById("posterContainer");
const posterInput = document.getElementById("posterInput");
const posterImage = document.getElementById("posterImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");


posterContainer.addEventListener("dblclick", function () {

    posterInput.click();

});


posterInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    const imageURL = URL.createObjectURL(file);

    posterImage.src = imageURL;

    posterImage.style.display = "block";

    uploadPlaceholder.style.display = "none";

});


/* =================================
   DOWNLOAD TICKET
================================= */

const downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", async function () {

    // Make sure editing is finished
    document.activeElement.blur();

    const ticket = document.querySelector(".ticket-wrapper");

    try {

        const canvas = await html2canvas(ticket, {

            scale: 3,

            backgroundColor: null,

            useCORS: true

        });


        const link = document.createElement("a");

        link.download = "my-movie-ticket.png";

        link.href = canvas.toDataURL("image/png");

        link.click();

    } catch (error) {

        console.error("Could not download ticket:", error);

        alert("Something went wrong while creating the ticket.");

    }

});