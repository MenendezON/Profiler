$(function() {
    // preventing page from redirecting
    $("html").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".drag-text").text("Drag here");
    });

    $("html").on("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // Drag enter
    $(".upload-area").on("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(".drag-text").text("Drop here");
    });

    // Drag over
    $(".upload-area").on("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(".drag-text").text("Drop here");
    });

    // Drop
    $(".upload-area").on("drop", function(e) {
        e.stopPropagation();
        e.preventDefault();

        $(".drag-text").text("Uploading and Processing...");

        var file = e.originalEvent.dataTransfer.files;
        var fd = new FormData();
        fd.append("application_resume", file[0]);

        uploadData(fd);
    });

    // Open file selector on div click
    $("#uploadfile").on("click", function() {
        $("#file").trigger("click");
    });

    // file selected
    $("#file").on("change", function() {
        $(".drag-text").text("Uploading and Processing...");

        var fd = new FormData();

        var files = $("#file")[0].files[0];

        fd.append("application_resume", files);

        uploadData(fd);
    });
});

// Sending AJAX request and upload file
function uploadData(formdata) {
    $.ajax({
        url: routes.add_candidate,
        type: "POST",
        data: formdata,
        contentType: false,
        processData: false,
        dataType: "json",
        beforeSend: function() {
            $(".drag-text").text("Uploading and Processing...");
        },
        success: function(response) {
            if (response.status == "error") {
                swal("Error", response.error, "error");
                $(".drag-text").html(
                    "<strong>Drag and Drop Resume</strong><br>Or<br><strong>Click here to select file</strong><br><br><small>(Must be less than 2MB. Only PDF, Doc and Docx are allowed)</small>"
                );
            }
            if (response.status == "success") {
                // disable another upload
                $("#file").remove();
                // show resume
                var filename = response.filename;
                var resume_path = response.url;
                var type = response.type;
                if (response.plan == 3 || response.plan == 4) {
                    try {
                        var data = response.data;

                        // var first_name = data.ResumeParserData.FirstName ?? "";
                        // var last_name = data.ResumeParserData.LastName ?? "";
                        // var email = data.ResumeParserData.Email ?? "";
                        // var phone = data.ResumeParserData.Phone ?? "";
                        // var city = data.ResumeParserData.City ?? "";

                        var first_name = data.data.first_name ?? "";
                        var last_name = data.data.last_name ?? "";
                        var email = data.data.email ?? "";
                        var phone = data.data.mobile_number ?? "";
                        var city = "";

                        $("input[name='application_fname']").val(first_name);
                        $("input[name='application_lname'").val(last_name);
                        $("input[name='application_email']").val(email);
                        $("input[name='application_mobile']").val(phone);
                        $("input[name='application_localtion']").val(city);
                    } catch (error) {
                        console.group("Parser");
                        console.log(error);
                        console.groupEnd();
                    }
                }
                //Default is for docs
                var html = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=` + resume_path + `" width="100%" height="530"></iframe>`;
                if (type == "pdf" || type == "PDF") {
                    //different viewer for pdf
                    html = `<div id="resumepdf"></div><script>PDFObject.embed("` + resume_path + `#toolbar=0", "#resumepdf");</script><style>.pdfobject-container { height: 30rem; border: 0; padding-left: 5%; padding-right: 5% }</style>`;
                }
                $(".upload-area")
                    .css("border-width", "0px")
                    .css("border-radius", "0px")
                    .html(html);
                $('input[name="application_resume"]')
                    .attr("type", "hidden")
                    .val(filename);
                $(".drag_resume_name").html(filename);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}
