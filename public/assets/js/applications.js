function initPlugins() {
  if (
    ((status = !1),
    0 != $(".tagsinput").length && $(".tagsinput").tagsinput(),
    0 != $(".datetimepicker").length &&
      ($(".datetimepicker").datetimepicker({
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-chevron-up",
          down: "fa fa-chevron-down",
          previous: "fa fa-chevron-left",
          next: "fa fa-chevron-right",
          today: "fa fa-screenshot",
          clear: "fa fa-trash",
          close: "fa fa-remove",
        },
      }),
      (status = !0)),
    0 != $(".datepicker").length)
  ) {
    var e = new Date();
    e.setDate(e.getDate() + 30),
      $(".datepicker").datetimepicker({
        format: "DD-MM-YYYY",
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-chevron-up",
          down: "fa fa-chevron-down",
          previous: "fa fa-chevron-left",
          next: "fa fa-chevron-right",
          today: "fa fa-screenshot",
          clear: "fa fa-trash",
          close: "fa fa-remove",
        },
        minDate: new Date(),
        maxDate: e,
      }),
      (status = !0);
  }
  return (
    0 != $(".timepicker").length &&
      ($(".timepicker").datetimepicker({
        format: "h:mm A",
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-chevron-up",
          down: "fa fa-chevron-down",
          previous: "fa fa-chevron-left",
          next: "fa fa-chevron-right",
          today: "fa fa-screenshot",
          clear: "fa fa-trash",
          close: "fa fa-remove",
        },
        stepping: 15,
      }),
      (status = !0)),
    0 != $(".selectpicker").length &&
      (($sp = $(".selectpicker").selectpicker()),
      (status = !0),
      $sp.on("changed.bs.select", function (e, t, a, o) {
        var n = $(this).children("option:selected").val();
        move_stages($(this).attr("id"), n);
      })),
    0 != $('[data-toggle="tooltip"]').length &&
      ($('[data-toggle="tooltip"]').tooltip(), (status = !0)),
    $(document).on("click", ".remove", function (e) {
      e.preventDefault(), delete_application($(this)), (status = !0);
    }),
    0 != $(".name_rating").length &&
      $(".name_rating").on("change", function () {
        var e = $(this).val();
        $.ajax({
          url: routes.set_rating,
          method: "POST",
          data: { application_id: applicant_id, rating: e },
          success: function (e) {
            "success" == e.status &&
              ($.notify(
                { icon: "fa fa-check", message: e.message },
                {
                  type: "success",
                  duration: 2e3,
                  placement: { from: "top", align: "left" },
                }
              ),
              refresh_table());
          },
        });
      }),
    status
  );
}
function set_session(e) {
  ("dashboard" != pageType && "interviews_only" != pageType) ||
    (e = "interviews"),
    $.ajax({ url: routes.set_session, method: "POST", data: { tab: e } });
}
function edit_profile(e) {
  ($formData = new FormData(document.querySelector("#edit_profile"))),
    $.ajax({
      url: routes.update_application,
      method: "POST",
      data: $formData,
      processData: !1,
      contentType: !1,
      success: function (t) {
        "success" == t.status
          ? ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ),
            view_application(e, initPlugins))
          : $.notify(
              { message: t.message },
              {
                type: "danger",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            );
      },
      error: function (e) {
        console.log(e);
      },
    });
}
function schedule_interview(e) {
  ($formData = new FormData(document.querySelector("#schedule_interview"))),
    $.ajax({
      url: routes.schedule_interview,
      method: "POST",
      data: $formData,
      processData: !1,
      contentType: !1,
      success: function (t) {
        "success" == t.status
          ? ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ),
            view_application(e, initPlugins))
          : $.notify(
              { message: t.message },
              {
                type: "danger",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            );
      },
      error: function (e) {
        console.log(e);
      },
    });
}
function reschedule_interview(e) {
  ($formData = new FormData(document.querySelector("#reschedule_interview"))),
    $.ajax({
      url: routes.reschedule_interview,
      method: "POST",
      data: $formData,
      processData: !1,
      contentType: !1,
      success: function (t) {
        "success" == t.status
          ? ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ),
            view_application(e, initPlugins))
          : $.notify(
              { message: t.message },
              {
                type: "danger",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            );
      },
      error: function (e) {
        console.log(e);
      },
    });
}
function interview_feedback(e, t = !1) {
  ($formData = t
    ? new FormData(document.querySelector("#interview_feedback_2"))
    : new FormData(document.querySelector("#interview_feedback"))),
    $.ajax({
      url: routes.interview_feedback,
      method: "POST",
      data: $formData,
      processData: !1,
      contentType: !1,
      success: function (t) {
        "success" == t.status
          ? ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ),
            view_application(e, initPlugins))
          : $.notify(
              { message: t.message },
              {
                type: "danger",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            );
      },
      error: function (e) {
        console.log(e);
      },
    });
}
function application_comment(e, t = !1) {
  t
    ? (($formData = new FormData(
        document.querySelector("#application_comment_2")
      )),
      $formData.append("edit", "yes"))
    : (($formData = new FormData(
        document.querySelector("#application_comment")
      )),
      $formData.append("edit", "no")),
    $.ajax({
      url: routes.application_comment,
      method: "POST",
      data: $formData,
      processData: !1,
      contentType: !1,
      success: function (e) {
        "success" == e.status
          ? ($.notify(
              { icon: "fa fa-check", message: e.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ),
            view_application(applicant_id, initPlugins))
          : (console.log(e),
            $.notify(
              { message: e.message },
              {
                type: "danger",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ));
      },
      error: function (e) {
        console.log(e);
      },
    });
}
function populateEditComment(e) {
  (msg = $("#comment_msg_" + e).html()),
    $("#comment_id").val(e),
    $("#comment_msg").html(msg),
    $("#edit_comment_btn").attr(
      "onclick",
      "application_comment('" + e + "', true)"
    );
}
function deleteComment(e) {
  swal({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    type: "warning",
    showCancelButton: !0,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  })
    .then((t) => {
      t &&
        $.ajax({
          url: routes.delete_comment,
          data: { comment_id: e },
          type: "POST",
          success: function (e) {
            "deleted" == e.status &&
              ($.notify(
                { icon: "fa fa-check", message: e.message },
                {
                  type: "success",
                  duration: 2e3,
                  placement: { from: "top", align: "left" },
                }
              ),
              view_application(applicant_id, initPlugins));
          },
          error: function (e) {
            console.log(e),
              swal(
                "Error",
                "Comment cannot be deleted, please contact support",
                "error"
              );
          },
        });
    })
    .catch(swal.noop);
}
function move_stages(e, t) {
  "2" != t
    ? (($formData = new FormData()),
      $formData.append("application_id", e),
      $formData.append("moved_to_stage", t),
      $.ajax({
        url: routes.move_stages,
        method: "POST",
        data: $formData,
        processData: !1,
        contentType: !1,
        success: function (t) {
          "success" == t.status
            ? ($.notify(
                { icon: "fa fa-check", message: t.message },
                {
                  type: "success",
                  duration: 2e3,
                  placement: { from: "top", align: "center" },
                }
              ),
              view_application(e, initPlugins))
            : $.notify(
                { message: t.message },
                {
                  type: "danger",
                  duration: 2e3,
                  placement: { from: "top", align: "center" },
                }
              );
        },
        error: function (e) {
          console.log(e);
        },
      }))
    : $("#RejectCandidate").modal("show");
}
function refresh_table() {}
function delete_application(e) {
  sibc(e, !1),
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
            url: routes.delete_application,
            data: { application_id: applicant_id },
            type: "POST",
            success: function (e) {
              "deleted" == e.status &&
                ($("#applicant_details_" + applicant_id).remove(),
                $.notify(
                  { icon: "fa fa-check", message: e.message },
                  {
                    type: "success",
                    duration: 2e3,
                    placement: { from: "top", align: "left" },
                  }
                )),
                $("#ApplicantModal").hide(),
                $("body").removeClass("modal-open"),
                $(".modal-backdrop.fade").remove();
            },
            error: function (e) {
              console.log(e),
                swal(
                  "Error",
                  "Application cannot be deleted, please contact support",
                  "error"
                );
            },
          });
      })
      .catch(swal.noop);
}
function move_to_talent(e) {
  sibc(e, !1),
    swal({
      title: "Are you sure?",
      text: "Application will be moved to talent pool",
      type: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Move",
    })
      .then((e) => {
        e &&
          $.ajax({
            url: routes.move_to_talent,
            method: "POST",
            data: { application_id: applicant_id },
            success: function (e) {
              "success" == e.status &&
                ($.notify(
                  { icon: "fa fa-check", message: e.message },
                  {
                    type: "success",
                    duration: 2e3,
                    placement: { from: "top", align: "left" },
                  }
                ),
                view_application(applicant_id, initPlugins));
            },
            error: function (e) {
              console.log(e);
            },
          });
      })
      .catch(swal.noop);
}
function move_to_another(e) {
  ($formData = new FormData(document.querySelector("#move_to_another"))),
    $.ajax({
      url: routes.move_to_another,
      method: "POST",
      data: $formData,
      processData: !1,
      contentType: !1,
      success: function (t) {
        "success" == t.status &&
          ($.notify(
            { icon: "fa fa-check", message: t.message },
            {
              type: "success",
              duration: 2e3,
              placement: { from: "top", align: "center" },
            }
          ),
          view_application(e, initPlugins));
      },
      error: function (e) {
        console.log(e);
      },
    });
}
var reload_count = 0,
  clicked_id = "",
  applicant_id = "",
  applicant_name = "",
  applicant_email = "",
  applicant_mobile = "",
  applicant_rating = "",
  iFrame = $("iframe#app_details");

function sibc(e, t = !0) {
  "string" == typeof e
    ? (applicant_id = e)
    : ((clicked_id = $(e).attr("id")),
      (applicant_id = (applicant_id = clicked_id.split("_"))[2])),
    t && view_application(applicant_id, initPlugins);
}
function refreshFrame() {
  var e = document.getElementById("_resumeFrame"),
    t = e.src;
  return (
    setTimeout(function () {
      e.src = t;
    }, 500),
    reload_count++
  );
}
function view_application(e, t) {
   (reload_count = 10),
    console.group("view_application - " + e),
    console.log("Initiating cursor."),
    $("body").css("cursor", "progress"),
    console.log("Hide modal"),
    $("#ApplicantModal").modal("hide"),
    console.log("Initiate Promise"),
    $.when(viewXHR(e, t)).done(function () {
      console.log("Promise Resolved"),
        console.log("Show modal"),
        $("#ApplicantModal").modal("show"),
        console.log("Disabling cursor"),
        $("body").css("cursor", "default");
    }),
    console.log("Setting Timeout"),
    setTimeout(function () {
      refreshFrame(), refresh_table();
    }, 2e3),
    console.log("All ok."),
    console.groupEnd();
}
function viewXHR(e, t) {
  $("#applicant_modal").html(modal(e));
  // return (
  //   console.log("Promise Created"),
  //   $.ajax({
  //     url: "https://cors-anywhere.herokuapp.com/https://dash.recooty.com/ajax/view_application",
  //     type: "POST",
  //     data: { id: e },
  //     success: function (e) {
  //       //console.log("Data Received"), $("#applicant_modal").html(e.modal), t();

  //       console.log("Data Received:", e); // Log the entire response object
  //       console.log("Modal HTML:", e.modal); // Log only the `modal` property
  //       $("#applicant_modal").html(e.modal); // Insert the modal HTML into the DOM
  //       t(); // Call the callback function
  //     },
  //     error: function (e) {
  //       $("body").css("cursor", "default"), console.error(e);
  //     },
  //   })
  // );
}

function modal(e){
 const div = document.createElement('div');
  div.setAttribute('class', 'modal fade show');
  div.setAttribute('id', 'ApplicantModal');
  div.setAttribute('role', 'dialog');
  div.setAttribute('aria-labelledby', 'ApplicantModalLabel');
  div.setAttribute('style', 'z-index: 1040; padding-right: 17px; display: block;');

  const div1 = document.createElement('div');
  div1.setAttribute('class', 'modal-dialog modal-dialog-slideout modal-lg');
  div1.setAttribute('role', 'document');

  const div2 = document.createElement('div');
  div2.setAttribute('class', 'modal-content modal-content-applicant');

  const navigation = document.createElement('div');
  navigation.setAttribute('class', 'modal-navigation');
  navigation.setAttribute('id', 'buttons_a');
  const navigation_div = document.createElement('div');
  navigation_div.setAttribute('class', 'buttons');
  const button = document.createElement('button');
  button.setAttribute('class', 'btn btn-icon');
  button.setAttribute('data-dismiss', 'modal');
  button.setAttribute('aria-label', 'Close');
  const icon = document.createElement('i');
  icon.setAttribute('class', 'fas fa-times');


  navigation.appendChild(navigation_div);
  navigation_div.appendChild(button)
  button.appendChild(icon);

  //navigation.textContent = '<div class="buttons"><button class="btn btn-icon" data-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button></div><div class="buttons"><button class="btn btn-icon" onclick="go_next()"><i class="fas fa-chevron-right"></i></button></div><div class="buttons"><button class="btn btn-icon" onclick="go_previous()"><i class="fas fa-chevron-left"></i></button></div>';

  const header = document.createElement('div');
  header.setAttribute('class', 'modal-header');

  const body = document.createElement('div');
  body.setAttribute('class', 'modal-body modal-dark-bg');

  const footer = document.createElement('div');
  footer.setAttribute('class', 'modal-footer');

  div.appendChild(div1);
  div1.appendChild(div2);
  div2.appendChild(navigation);
  div2.appendChild(header);
  div2.appendChild(body);
  div2.appendChild(footer);
  return div;

}

var actions = {
  shortlist_candidate: function (e) {
    ($formData = new FormData()),
      $formData.append("action", "shortlist"),
      $formData.append("application_id", e),
      $.ajax({
        url: routes.application_action,
        method: "POST",
        data: $formData,
        processData: !1,
        contentType: !1,
        success: function (t) {
          "success" == t.status &&
            ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "left" },
              }
            ),
            view_application(e, initPlugins));
        },
        error: function (e) {
          console.log(e);
        },
      });
  },
  offer_candidate: function (e) {
    ($formData = new FormData()),
      $formData.append("action", "offer"),
      $formData.append("application_id", e),
      $.ajax({
        url: routes.application_action,
        method: "POST",
        data: $formData,
        processData: !1,
        contentType: !1,
        success: function (t) {
          "success" == t.status &&
            ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ),
            view_application(e, initPlugins));
        },
        error: function (e) {
          console.log(e);
        },
      });
  },
  hire_candidate: function (e) {
    ($formData = new FormData()),
      $formData.append("action", "hire"),
      $formData.append("application_id", e),
      $.ajax({
        url: routes.application_action,
        method: "POST",
        data: $formData,
        processData: !1,
        contentType: !1,
        success: function (t) {
          "success" == t.status &&
            ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "left" },
              }
            ),
            view_application(e, initPlugins));
        },
        error: function (e) {
          console.log(e);
        },
      });
  },
  reject_candidate: function (e) {
    ($formData = new FormData(document.querySelector("#reject_candidate"))),
      $formData.append("action", "reject"),
      $("#candidate_reject_btn")
        .attr("disabled", !0)
        .html('<i class="fas fa-spinner fa-spin"></i>'),
      $.ajax({
        url: routes.application_action,
        method: "POST",
        data: $formData,
        processData: !1,
        contentType: !1,
        success: function (t) {
          "success" == t.status &&
            ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "left" },
              }
            ),
            view_application(e, initPlugins));
        },
        error: function (e) {
          console.log(e);
        },
      });
  },
  cancel_interview: function (e) {
    ($formData = new FormData(document.querySelector("#cancel_interview"))),
      $.ajax({
        url: routes.interview_cancel,
        method: "POST",
        data: $formData,
        processData: !1,
        contentType: !1,
        success: function (t) {
          "success" == t.status &&
            ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "left" },
              }
            ),
            view_application(e, initPlugins));
        },
        error: function (e) {
          console.log(e);
        },
      });
  },
  move_to_interview: function (e) {
    ($formData = new FormData()),
      $formData.append("action", "interview"),
      $formData.append("application_id", e),
      $.ajax({
        url: routes.application_action,
        method: "POST",
        data: $formData,
        processData: !1,
        contentType: !1,
        success: function (t) {
          "success" == t.status &&
            ($.notify(
              { icon: "fa fa-check", message: t.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "left" },
              }
            ),
            view_application(e, initPlugins));
        },
        error: function (e) {
          console.log(e);
        },
      });
  },
};
function populateInterviewFeedback(e) {
  $("#interview_id_feedback").val(e);
}
function populateEditFeedback(e) {
  $("#interview_rating_" + e).val();
  var t = $("#interview_decision_" + e).val(),
    a = $("#interview_feedback_" + e).val();
  $("#interview_id_edit_feedback").val(e),
    $("#edit_interview_feedback").html(a),
    "0" == t
      ? ($("#edit_interview_decision_nohire").prop("checked", !0),
        $("#edit_interview_decision_hire").prop("checked", !1))
      : ($("#edit_interview_decision_hire").prop("checked", !0),
        $("#edit_interview_decision_nohire").prop("checked", !1));
}
function populateCancelInterview(e) {
  $("#interview_id").val(e);
}
function populateReschedule(e) {
  $("#res_interview_id").val(e);
}
function go_previous() {
  var e = md5_ids.indexOf(applicant_id);
  0 != e && view_application((applicant_id = md5_ids[e - 1]), initPlugins);
}
function go_next() {
  var e = md5_ids.indexOf(applicant_id);
  e != md5_ids.length - 1 &&
    view_application((applicant_id = md5_ids[e + 1]), initPlugins);
}
function update_resume() {
  ($formData = new FormData(document.querySelector("#update_resume"))),
    $.ajax({
      url: routes.update_resume,
      method: "POST",
      data: $formData,
      processData: !1,
      contentType: !1,
      success: function (e) {
        "success" == e.status
          ? ($.notify(
              { icon: "fa fa-check", message: e.message },
              {
                type: "success",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            ),
            view_application(applicant_id, initPlugins))
          : $.notify(
              { message: e.message },
              {
                type: "danger",
                duration: 2e3,
                placement: { from: "top", align: "center" },
              }
            );
      },
      error: function (e) {
        console.error(e);
      },
    });
}
function click_copy(e) {
  navigator.clipboard.writeText(e);
}
$(function () {
  var e = new URLSearchParams(window.location.search),
    t = e.has("showNum") ? e.get("showNum") : 10;
  function a(e) {
    e
      ? $("#bulkActionsComamands").hide("slow")
      : $("#bulkActionsComamands").show("slow");
  }
  $("#paginationCount option[value='" + t + "']").length > 0 &&
    $("#paginationCount option[value='" + t + "']").prop("selected", !0),
    $("#paginationCount").on("change", function () {
      var e = this.value,
        t = new URLSearchParams(window.location.search);
      t.set("showNum", e),
        (new_data = t.toString()),
        (new_url = location.origin + location.pathname + "?" + new_data),
        (location.href = new_url);
    });
  var o = !1;
  $("#selectAll").click(function (e) {
    o
      ? ($(".applicant_checkbox").prop("checked", !1), a(o), (o = !o))
      : ($(".applicant_checkbox").prop("checked", !0), a(o), (o = !o));
  }),
    $(".applicant_checkbox").on("change", function () {
      this.checked
        ? a(!1)
        : this.checked || 0 != $(".applicant_checkbox:checked").length || a(!0);
    }),
    $("#bulkRejectBtn").click(function () {
      $("#bulkRejectCandidate").modal("show");
    }),
    $("#bulk_reject_btn").click(function () {
      var e = $("#bulk_application_rejection_reason").val(),
        t = $("#bulk_application_rejection_notify").is(":checked");
      $("#bulk_hidden_reject_reason").val(e),
        $("#bulk_hidden_send_mail").val(t),
        $("#bulkRejectCandidate").modal("hide"),
        $("#bulkRejectSubmit").click();
    }),
    $("form#filters input#talentpool").on("change", function () {
      this.checked
        ? $("form#filters input,select")
            .not("form#filters input#talentpool")
            .not("form#filters input#search_name")
            .not("form#filters select#rating")
            .not("form#filters input#tags")
            .not("form#filters input.not-disabled")
            .attr("disabled", !0)
        : $("form#filters input,select")
            .not("form#filters input#talentpool")
            .not("form#filters input#search_name")
            .not("form#filters select#rating")
            .not("form#filters input#tags")
            .not("form#filters input.not-disabled")
            .attr("disabled", !1);
    }),
    $(document).on("click", ".remove", function (e) {
      e.preventDefault(), delete_application($(this));
    }),
    $("#opening_state").on("change", function () {
      (state = $(this).val()),
        (htmlBasic = '<option value="all">All</option>'),
        (htmlT = '<option value="[[job_id]]">[[job_title]]</option>'),
        $.ajax({
          url: routes.get_openings_from_state,
          method: "POST",
          data: { state: state },
          success: function (e) {
            $("#openings").html(htmlBasic);
            for (var t = 0; t < e.length; t++) {
              var a = e[t];
              (htmlToInsert = htmlT.replace("[[job_id]]", a.jid)),
                (htmlToInsert = htmlToInsert.replace(
                  "[[job_title]]",
                  a.job_title
                )),
                $("#openings").append(htmlToInsert);
            }
          },
          error: function (e) {
            console.log(e);
          },
        });
    });
});
