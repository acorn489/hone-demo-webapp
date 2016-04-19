import authorize from "oauth2-implicit"

let INPUT_IDS = ["honeUrl", "clientId", "skillId"];

$(() => {
  let token = getParameterByName("access_token");
  let $authenticate = $(".authenticate");
  let $completeSkill = $(".complete_skill");
  restoreInputValues();
  showButton(token, $completeSkill, $authenticate);
  $("#defaultHoneUrl").click(handleDefaultHoneUrlClick());
  $authenticate.click(handleAuthenticateClick());
  $completeSkill.click(handleCompleteSkillClick(token));
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[#&]" + name + "(=([^&#]*)|&|#|$)", "i"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function showButton(token, $completeSkill, $authenticate) {
  if (token) {
    $completeSkill.show().siblings().hide();
  } else {
    $authenticate.show().siblings().hide();
  }
}

function restoreInputValues() {
  INPUT_IDS.forEach(id => $("#" + id).val(localStorage.getItem(id)));
}

function storeInputValues() {
  INPUT_IDS.forEach(id => localStorage.setItem(id, $("#" + id).val()));
}

function handleDefaultHoneUrlClick() {
  return () => $("#honeUrl").val("https://hone-kids.herokuapp.com/");
}

function handleAuthenticateClick() {
  return () => {
    storeInputValues();
    authorize({
      auth_uri: $("#honeUrl").val() + '/oauth/authorize',
      client_id: $("#clientId").val(),
      scope: [],
      state: {location: window.location}
    }).run();
  }
}

function handleCompleteSkillClick(token) {
  return function (e) {
    var el = $(this);
    var l = Ladda.create(this);
    l.start();
    var data = new FormData();
    data.append("skill_id", $("#skillId").val());
    data.append("access_token", token);
    fetch($("#honeUrl").val() + "/api/v1/complete_skill", {method: "post", body: data})
      .then(() => new Promise((resolve, reject) => setTimeout(resolve, 1000)))
      .then(() => {
        l.stop();
        el.css("background-color", "green");
      })
      .catch(() => {
        console.log("error");
        console.log(e);
      });
  }
}
