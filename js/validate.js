/* ============================================================
   用户注册页面  validate.js
   功能：表单验证（用户名 / 密码 / 邮箱 / 手机号 / 协议）
   知识点：DOM 获取元素、事件绑定、正则表达式、字符串方法
   ============================================================ */

// ---------- 1. 先把要用的元素都拿到手 ----------
var regForm = document.getElementById("regForm");

var username = document.getElementById("username");
var password = document.getElementById("password");
var repassword = document.getElementById("repassword");
var email = document.getElementById("email");
var phone = document.getElementById("phone");
var agree = document.getElementById("agree");

// ---------- 2. 几个通用的小工具 ----------

/* 显示提示信息
   box   —— 要显示在哪一行
   text  —— 提示文字
   ok    —— true 表示正确（绿色），false 表示错误（红色） */
function showTip(box, text, ok) {
    box.innerHTML = text;
    box.className = ok ? "tip ok" : "tip";
}

/* 给输入框加 / 去红边，同时返回是否通过 */
function mark(input, pass) {
    if (pass) {
        input.className = "ok";
        input.classList.remove("error");
    } else {
        input.classList.add("error");
    }
    return pass;
}

/* 把输入框两边的空格去掉（用户容易多打空格） */
function val(input) {
    return input.value.trim();
}

// ---------- 3. 各个字段的校验函数（返回 true / false） ----------

/* 用户名：4-16 位，只能字母、数字、下划线 */
function checkUsername() {
    var v = val(username);
    var re = /^[a-zA-Z0-9_]{4,16}$/;
    var box = document.getElementById("tipUsername");

    if (v === "") {
        showTip(box, "用户名不能为空", false);
        return mark(username, false);
    }
    if (!re.test(v)) {
        showTip(box, "只能填 4-16 位字母、数字或下划线", false);
        return mark(username, false);
    }
    showTip(box, "可以使用", true);
    return mark(username, true);
}

/* 密码：6-16 位，不能全是数字，也不能全是字母 */
function checkPassword() {
    var v = password.value;
    var box = document.getElementById("tipPassword");

    if (v === "") {
        showTip(box, "密码不能为空", false);
        return mark(password, false);
    }
    if (v.length < 6 || v.length > 16) {
        showTip(box, "密码长度要在 6-16 位之间", false);
        return mark(password, false);
    }
    if (/^\d+$/.test(v)) {
        showTip(box, "密码不能全是数字", false);
        return mark(password, false);
    }
    if (/^[a-zA-Z]+$/.test(v)) {
        showTip(box, "密码不能全是字母", false);
        return mark(password, false);
    }
    showTip(box, "密码强度合格", true);
    return mark(password, true);
}

/* 确认密码：必须和上面填的一模一样 */
function checkRepassword() {
    var v = repassword.value;
    var box = document.getElementById("tipRepassword");

    if (v === "") {
        showTip(box, "请再输入一次密码", false);
        return mark(repassword, false);
    }
    if (v !== password.value) {
        showTip(box, "两次输入的密码不一样", false);
        return mark(repassword, false);
    }
    showTip(box, "两次输入一致", true);
    return mark(repassword, true);
}

/* 邮箱：用正则判断 用户名@域名.后缀 */
function checkEmail() {
    var v = val(email);
    var re = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
    var box = document.getElementById("tipEmail");

    if (v === "") {
        showTip(box, "邮箱不能为空", false);
        return mark(email, false);
    }
    if (!re.test(v)) {
        showTip(box, "邮箱格式不对，例如 student@jou.edu.cn", false);
        return mark(email, false);
    }
    showTip(box, "邮箱格式正确", true);
    return mark(email, true);
}

/* 手机号：1 开头，第二位 3-9，后面 9 位数字，共 11 位 */
function checkPhone() {
    var v = val(phone);
    var re = /^1[3-9]\d{9}$/;
    var box = document.getElementById("tipPhone");

    if (v === "") {
        showTip(box, "手机号不能为空", false);
        return mark(phone, false);
    }
    if (!re.test(v)) {
        showTip(box, "请输入 11 位手机号", false);
        return mark(phone, false);
    }
    showTip(box, "手机号格式正确", true);
    return mark(phone, true);
}

/* 协议：必须勾上 */
function checkAgree() {
    var box = document.getElementById("tipAgree");

    if (!agree.checked) {
        showTip(box, "请先阅读并同意《用户服务协议》", false);
        return false;
    }
    showTip(box, "", true);
    return true;
}

// ---------- 4. 绑定事件：鼠标离开输入框就检查一次 ----------

username.onblur = checkUsername;
password.onblur = checkPassword;
repassword.onblur = checkRepassword;
email.onblur = checkEmail;
phone.onblur = checkPhone;

// 边打字边检查（密码和确认密码要一起检查，因为它们互相关联）
username.oninput = checkUsername;
email.oninput = checkEmail;
phone.oninput = checkPhone;

password.oninput = function () {
    // 密码改了，已填过的确认密码要重新比对
    if (repassword.value !== "") {
        checkRepassword();
    }
};
repassword.oninput = checkRepassword;

// ---------- 5. 点"立即注册"时的总检查 ----------

regForm.onsubmit = function () {
    // 用 & 而不是 && ，是为了让每个函数都执行一遍，把提示都显示出来
    var r1 = checkUsername();
    var r2 = checkPassword();
    var r3 = checkRepassword();
    var r4 = checkEmail();
    var r5 = checkPhone();
    var r6 = checkAgree();

    if (r1 && r2 && r3 && r4 && r5 && r6) {
        // 全部通过 —— 这里以后可以改成把数据发给后端
        alert("注册成功！\n\n用户名：" + val(username) +
              "\n邮箱：" + val(email) +
              "\n手机号：" + val(phone));

        // 阻止表单真的提交（现在还没有后端）
        return false;
    }

    // 有错就不让提交
    return false;
};

// ---------- 6. 点"重置"时，把提示和红边一起清掉 ----------

regForm.onreset = function () {
    var tips = document.querySelectorAll(".tip");
    for (var i = 0; i < tips.length; i++) {
        tips[i].innerHTML = "";
        tips[i].className = "tip";
    }

    var inputs = document.querySelectorAll(".error");
    for (var j = 0; j < inputs.length; j++) {
        inputs[j].classList.remove("error");
    }
};
