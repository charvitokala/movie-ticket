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


// ==========================================
// DOWNLOAD TICKET WITH TRANSPARENT CUTOUTS
// ==========================================

const downloadButton = document.getElementById("downloadButton");

if (downloadButton) {

    downloadButton.addEventListener("click", async () => {

        const ticketWrapper = document.querySelector(".ticket-wrapper");

        if (!ticketWrapper) {
            console.error("Ticket wrapper not found.");
            return;
        }

        try {

            // Create canvas
            const canvas = await html2canvas(ticketWrapper, {
                scale: 3,
                backgroundColor: null,
                useCORS: true
            });

            const ctx = canvas.getContext("2d");

            /*
             * The semicircles are transparent cut-outs.
             *
             * We calculate their positions based on the
             * ticket wrapper dimensions and erase them
             * from the downloaded canvas.
             */

            const wrapperRect = ticketWrapper.getBoundingClientRect();

            const scaleX = canvas.width / wrapperRect.width;
            const scaleY = canvas.height / wrapperRect.height;

            // Position of the cutouts
            const cutoutSize = 76;

            const cutoutY = 139;

            const leftX = -38;
            const rightX = wrapperRect.width - 38;

            // Convert to canvas coordinates
            const leftCenterX =
                (leftX + cutoutSize / 2) * scaleX;

            const rightCenterX =
                (rightX + cutoutSize / 2) * scaleX;

            const centerY =
                (cutoutY + cutoutSize / 2) * scaleY;

            const radius =
                (cutoutSize / 2) * Math.min(scaleX, scaleY);

            // Erase the semicircle areas
            ctx.globalCompositeOperation = "destination-out";

            ctx.beginPath();
            ctx.arc(
                leftCenterX,
                centerY,
                radius,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
                rightCenterX,
                centerY,
                radius,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Reset canvas mode
            ctx.globalCompositeOperation = "source-over";


            // Download
            const link = document.createElement("a");

            link.download = "my-movie-ticket.png";

            link.href = canvas.toDataURL("image/png");

            link.click();

        } catch (error) {

            console.error(
                "Could not create ticket:",
                error
            );

            alert("Something went wrong while downloading.");

        }

    });

}