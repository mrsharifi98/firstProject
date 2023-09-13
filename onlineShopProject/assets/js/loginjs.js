$(document).ready(function () {

    $('.img__btn').click(function () {
        $('.cont').toggleClass('s--signup');
    });
    var isPasswordVisible = false;
    $(".forgot-pass").click(function () {
        $(".password-input").slideToggle(1000, function () {
            $(".password-input").toggleClass("hidden");
            isPasswordVisible = !isPasswordVisible;
            if (isPasswordVisible) {
                $("#signIn").text("Recovery");
                $("#signIn").attr("id", "recoveryButton");
            } else {
                $("#recoveryButton").text("Sign In");
                $("#recoveryButton").attr("id", "signIn");
            }
        });
    });

    $("#nameSignUp").blur(function () {

        if (checkName() == false) {

            $('#nameSignUpValid').text("نام باید بین 3 الی 20 حرف باشد");
        }
        else {
            $('#nameSignUpValid').text("");
        }

    })

    $("#familySignUp").blur(function () {

        if (checkFamily() == false) {

            $('#familySignUpValid').text("نام خانوادگی باید بین 3 الی 20 حرف باشد");
        }
        else {
            $('#familySignUpValid').text("");
        }

    })

    $("#usernameSignUp").blur(function () {

        if (checkPhone() == false) {

            $('#phoneSignUpValid').text("لطفا شماره تلفن خود را به صورت صحیح وارد نمایید");
        }
        else {
            $('#phoneSignUpValid').text("");
        }

    })

    $("#passSignUp").blur(function () {

        if (checkPass() == false) {

            $('#passSignUpValid').text("رمز عبور انتخابی باید بین 6 تا 20 کاراکتر باشد");
        }
        else {
            $('#passSignUpValid').text("");
        }

    })


    $(document).on("click", "#signIn", function () {
        signIn();
    });

    $(document).on("click", "#signUp", function () {
        SignUp();
    });

    $(document).on("click", "#verificationCode", function () {
        verificationCodeServer();
    });


});



////////////////////////////////////inner functions\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function signIn() {

    var username = $("#loginUsername").val();
    var password = $("#loginPass").val();
    var token = $('input[name = "__RequestVerificationToken"]').val();
    $.post("/Home/signIn", { user: username, pass: password, __RequestVerificationToken: token })

        .done(function (res) {

            if (res == 1) {

                var newPageUrl = "checkOut";
                // Open the new page
                window.location.href = newPageUrl;


            }

            else if (res == 2) {

                Swal.fire('ورود ناموفق', 'لطفا از طریق کد فعالسازی نسبت به فعالسازی اقدام کنید', 'error');
            }

            else if (res == 3) {

                Swal.fire('ورود ناموفق', 'رمز عبور اشتباه است', 'error');
            }

            else if (res == 0) {

                Swal.fire('ورود ناموفق', 'رمز عبور یا نام کاربری اشتباه است', 'error');
            }

        })

        .fail(function () {

        })

        .always(function () {

        });

}

function SignUp() {


    var name = $("#nameSignUp").val();
    var family = $("#familySignUp").val();
    var username = $("#usernameSignUp").val();
    var password = $("#passSignUp").val();

    if (checkName() == 1 && checkFamily() == 1 && checkPhone() == 1 && checkPass() == 1) {

        var token = $('input[name = "__RequestVerificationToken"]').val();
        $.post("/Home/signUp", { name: name, family: family, username: username, password: password, __RequestVerificationToken: token })

            .done(function (res) {

                if (res == 1) {

                    verificationCodeClient();
                }

                else if (res == 2) {

                    Swal.fire('ثبت نام ناموفق', 'این شماره قبلا ثبت شده است', 'error');
                }

                else if (res == 0) {

                }


            })

            .fail(function () {

            })

            .always(function () {

            });

    }
}

function verificationCodeClient() {

    var isPasswordVisible = false;
    $(".S2H").slideToggle(1000, function () {
        $(".S2H").toggleClass("hidden");
        isPasswordVisible = !isPasswordVisible;
        if (isPasswordVisible) {
            $("#signUp").text("VERIFY");
            $("#nameSignUp").attr("type", "number");
            $("#signUp").attr("id", "verificationCode");
            $("#nameOrCode").text("verification code");
            $("#nameSignUp").val("");
        }
    });
}

function toggleBack() {
    var isPasswordVisible = false;
    $(".S2H").slideToggle(1000, function () {
        $(".S2H").toggleClass("hidden");
        isPasswordVisible = !isPasswordVisible;
        if (!isPasswordVisible) {
            $("#verificationCode").attr("id", "signUp");
            $("#nameOrCode").text("password");
            $("#nameSignUp").attr("type", "password");
            $("#signUp").text("SIGN UP");
            $(".sign-up input").val("");
        }
    });
}


function verificationCodeServer() {


    var username = $("#usernameSignUp").val();
    var code = $("#nameSignUp").val();
    var token = $('input[name = "__RequestVerificationToken"]').val();
    $.post("/Home/verification", { username: username, code: code, __RequestVerificationToken: token })

        .done(function (result) {

            if (result == 1) {

                $('.cont').toggleClass('s--signup');
                Swal.fire('تایید شماره تلفن با موفقیت انجام شد', 'از قسمت ورود به حساب کاربری خود وارد شوید', 'succes');
                toggleBack();
            }

            else {
                Swal.fire('کد اشتباه است', '', 'error');
            }

        })

        .fail(function () {

        })

        .always(function () {

        });

}


///////////////////////check forms functions\\\\\\\\\\\\\\\\\\\\\\\\\\\
function checkName() {

    var flag = 1;
    var name = $("#nameSignUp").val();

    if (20 < name.length || name.length < 3) {
        flag = 0;
    }
    return flag;
}

function checkFamily() {

    var flag = 1;
    var family = $("#familySignUp").val();

    if (20 < family.length || family.length < 3) {
        flag = 0;
    }

    return flag;
}

function checkPhone() {

    var flag = 1;
    var number = $("#usernameSignUp").val();

    if (number.length != 11) {
        flag = 0;
    }

    return flag;
}

function checkPass() {

    var flag = 1;
    var name = $("#passSignUp").val();

    if (20 < name.length || name.length < 6) {
        flag = 0;
    }

    return flag;
}

//////////////////////check forms functions\\\\\\\\\\\\\\\\\\\\\
