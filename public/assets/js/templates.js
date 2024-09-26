var clicked_id = "",
    template_id = "";
function listTemplates() {
    $.ajax({
        url: "/api/listtemplate",
        type: "GET",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                "content"
            ),
        },
        success: function (e) {
            $("#listTemplates").html(e.template);
            //console.log('hello');
            //$("#listTemplates").text('hello');
        },
    });
}
function action(e) {
    (clicked_id = $(e).attr("id")),
        (template = clicked_id.split("_")),
        (template_id = template[2]),
        callAction(template[0], template_id);
}
function viewTemplate() {
    $("#viewTemplateTitle").html(
        '<i class="fas fa-circle-notch fa-spin"></i> Loading'
    ),
        $("#viewTemplateBody").html(
            '<i class="fas fa-circle-notch fa-spin"></i> Loading'
        ),
        $("#viewTemplate").modal(),
        $.ajax({
            url: routes.view_template,
            data: { data: template_id },
            type: "POST",
            success: function (e) {
                "success" == e.status
                    ? ($("#viewTemplateTitle").html(e.template_name),
                        $("#viewTemplateBody").html(e.template),
                        $("#viewTemplateAddLink").click(function (t) {
                            t.preventDefault(), (location.href = e.addlink);
                        }))
                    : "error" == e.status && console.log(e.message);
            },
            error: function (e) {
                console.log(e);
            },
        });
}
function deleteTemplate() {
    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: !0,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    })
        .then((e) => {
            e &&
                $.ajax({
                    url: routes.delete_template,
                    data: { data: template_id },
                    type: "POST",
                    success: function (e) {
                        "deleted" == e.status
                            ? ($("#form_template_" + e.data).remove(),
                                $.notify(
                                    {
                                        icon: "fa fa-check",
                                        message:
                                            "Template has been deleted successfully",
                                    },
                                    {
                                        type: "success",
                                        duration: 2e3,
                                        placement: {
                                            from: "top",
                                            align: "center",
                                        },
                                    }
                                ))
                            : "exists" == e.status &&
                            $.notify(
                                { message: e.message },
                                {
                                    type: "danger",
                                    duration: 2e3,
                                    placement: {
                                        from: "top",
                                        align: "center",
                                    },
                                }
                            );
                    },
                    error: function (e) {
                        console.log(e),
                            swal(
                                "Error",
                                "Your template cannot be deleted, please contact support",
                                "error"
                            );
                    },
                });
        })
        .catch(swal.noop);
}
function add_form_template() {
    swal({
        title: "Create Template",
        input: "text",
        inputAttributes: { autocapitalize: "off" },
        showCancelButton: !0,
        confirmButtonText: "Create",
        showLoaderOnConfirm: !0,
        preConfirm: (e) =>
            fetch(`/api/createtemplate?data=${e}`, {
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                method: "post",
            })
                .then((e) => {
                    if (!e.ok) throw new Error(e.statusText);
                    return e.json();
                })
                .catch(swal.noop),
        allowOutsideClick: () => !swal.isLoading(),
    }).then((e) => {
        "created" == e.status
            ? ((location.href = e.redirect), listTemplates())
            : "error" == e.status &&
            $.notify(
                { icon: "fa fa-exclamation-triangle", message: e.message },
                {
                    type: "danger",
                    duration: 2e3,
                    placement: { from: "top", align: "center" },
                }
            );
    });
}
function deleteQuestion() {
    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: !0,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    })
        .then((e) => {
            e &&
                $.ajax({
                    url: routes.delete_question,
                    type: "POST",
                    data: { data: template_id },
                    success: function (e) {
                        "success" == e.status &&
                            ($.notify(
                                { icon: "fa fa-check", message: e.message },
                                {
                                    type: "success",
                                    duration: 2e3,
                                    placement: { from: "top", align: "center" },
                                }
                            ),
                                $("#question_" + e.data).remove(),
                                listTemplates());
                    },
                    error: function (e) {
                        console.log(e);
                    },
                });
        })
        .catch(swal.noop);
}
function callAction(e, t) {
    "view" == e
        ? viewTemplate()
        : "delete" == e
            ? deleteTemplate()
            : "deleteQ" == e && deleteQuestion();
}
$(document).ready(function () {
    listTemplates();
});
