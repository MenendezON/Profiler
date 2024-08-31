@push('styles')
<link rel="stylesheet" href="{{ URL::asset('assets/js/jquery-ui/jquery-ui.min.css') }}">
<style type="text/css">
    .nowrap {
        white-space: nowrap;
    }
</style>
<style>
    .offer-btn {
        background-color: aliceblue;
        color: #434343;
        text-transform: none;
    }
</style>
<style>
    .nav-shortcuts li {
        margin-top: -15px;
        margin-left: 5px;

    }

    .btn-black {
        background-color: #161616;
    }

    .btn-darkblue {
        background-color: #233c63;
    }

    .btn-darkblue:hover !important {
        background-color: #135b8e;
    }

    .dropdown-menu .dropdown-item:hover,
    .dropdown-menu .dropdown-item:focus {
        background-color: #2c7db7;
    }

    .navbar.navbar-absolute {
        padding-top: 7px;
        padding-bottom: 7px;
    }
</style>
@endpush
<div class="content">
    <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{route('dashboard')}}">Dashboard</a></li>
            <li class="breadcrumb-item"><a href="{{route('settings')}}">Settings</a></li>
            <li class="breadcrumb-item"><a href="{{route('settings.screenquestion')}}">Screening Question Templates</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{$screeningquestion->data}}</li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col">
                            <h4 class="card-title">{{$screeningquestion->data}}</h4>
                        </div>
                        <div class="col">
                            <a href="https://dash.recooty.com/settings/form-templates/028ee724157b05d04e7bdcf237d12e60/add">
                                <button class="btn btn-sm btn-primary pull-right">
                                    Add Question
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card card-plain">
                        <div class="table-responsive">
                            <table class="table nowrap" id="form_template_questions">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Question Title</th>
                                        <th>Type</th>
                                        <th>Predefined Answers</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="question_6e839dd93911f945cd02c9b15da23db0">
                                        <td><a href="#" class="handle" id="6e839dd93911f945cd02c9b15da23db0"><i class="fas fa-grip-vertical" style="color:gray"></i></a></td> </a></td>
                                        <td>How many langage do you speak?
                                            <span class="text-danger">*</span>
                                        </td>
                                        <td>
                                            Checkbox
                                        </td>
                                        <td>
                                        </td>
                                        <td class="text-right">
                                            <a href="https://dash.recooty.com/settings/form-templates/028ee724157b05d04e7bdcf237d12e60/6e839dd93911f945cd02c9b15da23db0/edit">
                                                <button type="button" rel="tooltip" class="btn btn-success btn-icon btn-sm mb-2 mr-2">
                                                    <i class="fa fa-edit"></i>
                                                </button>
                                            </a>
                                            <button type="button" rel="tooltip" class="btn btn-danger btn-icon btn-sm mb-2 mr-2" id="deleteQ_view_6e839dd93911f945cd02c9b15da23db0" onclick="action(this)">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr id="question_0cb5ebb1b34ec343dfe135db691e4a85">
                                        <td><a href="#" class="handle" id="0cb5ebb1b34ec343dfe135db691e4a85"><i class="fas fa-grip-vertical" style="color:gray"></i></a></td> </a></td>
                                        <td>Do you have any previous any experience in this field you&#039;re applying for?
                                            <span class="text-danger">*</span>
                                        </td>
                                        <td>
                                            Dropdown
                                        </td>
                                        <td>
                                            <select>
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </td>
                                        <td class="text-right">
                                            <a href="https://dash.recooty.com/settings/form-templates/028ee724157b05d04e7bdcf237d12e60/0cb5ebb1b34ec343dfe135db691e4a85/edit">
                                                <button type="button" rel="tooltip" class="btn btn-success btn-icon btn-sm mb-2 mr-2">
                                                    <i class="fa fa-edit"></i>
                                                </button>
                                            </a>
                                            <button type="button" rel="tooltip" class="btn btn-danger btn-icon btn-sm mb-2 mr-2" id="deleteQ_view_0cb5ebb1b34ec343dfe135db691e4a85" onclick="action(this)">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-center">Application Form Preview</h4>
                    <div class="card card-plain">
                        <div class="card-body" id="form_preview">
                            <label for="company_website">Name <span class="text-danger">*</span></label>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <input type="text" class="form-control" placeholder="First Name">
                                </div>
                                <div class="form-group col-md-6">
                                    <input type="text" class="form-control" placeholder="Last Name">
                                </div>
                            </div>
                            <label>Email <span class="text-danger">*</span></label>
                            <div class="form-group">
                                <input type="text" name="company_name" class="form-control">
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <label>Mobile<span class="text-danger">*</span></label>
                                    </div>
                                    <div class="col text-right">
                                        <input class="bootstrap-switch user_toggle" id="028ee724157b05d04e7bdcf237d12e60_mobile" checked type="checkbox" data-toggle="switch" data-on-label="<i class='nc-icon nc-check-2'></i>" data-off-label="<i class='nc-icon nc-simple-remove'></i>" data-on-color="success" data-off-color="success" />
                                    </div>
                                </div>
                                <input type="text" name="company_name" class="form-control">
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <label>Current City<span class="text-danger">*</span></label>
                                    </div>
                                    <div class="col text-right">
                                        <input class="bootstrap-switch user_toggle" id="028ee724157b05d04e7bdcf237d12e60_city" checked type="checkbox" data-toggle="switch" data-on-label="<i class='nc-icon nc-check-2'></i>" data-off-label="<i class='nc-icon nc-simple-remove'></i>" data-on-color="success" data-off-color="success" />
                                    </div>
                                </div>
                                <input type="text" name="company_name" class="form-control">
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <label>Experience<span class="text-danger">*</span></label>
                                    </div>
                                    <div class="col text-right">
                                        <input class="bootstrap-switch user_toggle" id="028ee724157b05d04e7bdcf237d12e60_exp" checked type="checkbox" data-toggle="switch" data-on-label="<i class='nc-icon nc-check-2'></i>" data-off-label="<i class='nc-icon nc-simple-remove'></i>" data-on-color="success" data-off-color="success" />
                                    </div>
                                </div>
                                <Select class="form-control">
                                    <option selected="true" value disabled="true">- Select -</option>
                                    <option value="0">Fresher</option>
                                    <option value="0-1">0-1 Years</option>
                                    <option value="1-2">1-2 Years</option>
                                    <option value="2-3">2-3 Years</option>
                                    <option value="3-4">3-4 Years</option>
                                    <option value="4-5">4-5 Years</option>
                                    <option value="5-6">5-6 Years</option>
                                    <option value="6-7">6-7 Years</option>
                                    <option value="7-8">7-8 Years</option>
                                    <option value="8-9">8-9 Years</option>
                                    <option value="9-10">9-10 Years</option>
                                    <option value="10+">10+ Years</option>
                                </Select>
                            </div>
                            <div class="form-group">
                                <input type="checkbox" class="switch" checked>
                                <label>How many langage do you speak?
                                    <span style="color:red">*</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="ftq_question[8972]">
                                    Do you have any previous any experience in this field you&#039;re applying for?
                                    <span style="color:red">*</span>
                                </label>
                                <select class="form-control">
                                    <span style="color:red">*</span>
                                    <option value selected>- Select -</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <label>Resume<span class="text-danger">*</span></label>
                                </div>
                                <div class="col text-right">
                                    <input class="bootstrap-switch user_toggle" id="028ee724157b05d04e7bdcf237d12e60_resume" checked type="checkbox" data-toggle="switch" data-on-label="<i class='nc-icon nc-check-2'></i>" data-off-label="<i class='nc-icon nc-simple-remove'></i>" data-on-color="success" data-off-color="success" />
                                </div>
                            </div>
                            <div class>
                                <input type="file" name="company_name" class>
                            </div>
                            <button class="btn btn-primary btn-block">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@push('scripts')
<script type="text/javascript">
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(document).ajaxStart(function() {
        Pace.restart();
    });
</script>
<script src="{{ URL::asset('assets/js/templates.js?id=24fd005bc6653566e7e8') }}"></script>
<script>
    function refresh_form() {
        $.ajax({
            url: routes.form_preview,
            method: "POST",
            data: {
                "ft_id": "028ee724157b05d04e7bdcf237d12e60"
            },
            success: function(data) {
                $('#form_preview').html(data.render);
                $('.bootstrap-switch').each(function() {
                    $this = $(this);
                    data_on_label = $this.data('on-label') || '';
                    data_off_label = $this.data('off-label') || '';

                    $this.bootstrapSwitch({
                        onText: data_on_label,
                        offText: data_off_label
                    });
                    $this.on('switchChange.bootstrapSwitch', function(event, state) {
                        toggle_field($(this), state);
                    })
                });
            }
        });
    }
    $('table#form_template_questions tbody').sortable({
        'containment': 'parent',
        'revert': true,
        helper: function(e, tr) {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function(index) {
                $(this).width($originals.eq(index).width());
            });
            return $helper;
        },
        'handle': '.handle',
        update: function(event, ui) {
            $.post('https://dash.recooty.com/settings/form-templates/028ee724157b05d04e7bdcf237d12e60/reorder', $(this).sortable('serialize'), function(data) {
                refresh_form();
            }, 'json');
        }
    });
    $(window).resize(function() {
        $('table#form_template_questions tr').css('min-width', $('table#form_template_questions').width());
    });

    // Optional elements code start
    $('.user_toggle').on('switchChange.bootstrapSwitch', function(event, state) {
        toggle_field($(this), state);
    });

    function toggle_field(el, state) {
        el = $(el);
        id = el.attr('id');
        ft_id = id.split("_")[0];
        ft_field = id.split("_")[1];
        xhr_data = {
            ft_id: ft_id,
            ft_field: ft_field,
            ft_state: state
        }
        $.ajax({
            url: "https://dash.recooty.com/ajax/toggle_field",
            type: "POST",
            data: xhr_data,
            success: function(data) {
                if (data.status == 'success') {
                    $.notify({
                        icon: 'fa fa-check',
                        message: data.message
                    }, {
                        type: 'success',
                        duration: 2000,
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
                    refresh_form();
                }
            },
            error: function(err) {
                console.error(err);
            }
        });
    }
</script>
@endpush