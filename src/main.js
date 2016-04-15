import authorize from 'oauth2-implicit'

$(function() {
  var token;
  if (getParameterByName("access_token")) {
    token = getParameterByName("access_token");
    $(".authenticate").hide();
    $(".complete_skill").show();
  } else {
    $(".authenticate").show();
    $(".complete_skill").hide();
  }

  $(".authenticate").click(() => {
    let credentials = authorize({
      auth_uri: 'http://localhost:3000/oauth/authorize',
      client_id: '9b82f0ba722b4f31788cc8ec6f3ff0d2ef8c137ece63dfbe3290ad746f42033a',
      scope: [],
      state: {
        location: window.location
      }
    })
    credentials.run();
  });

  // Ladda.bind( 'button[type=submit]' );
  $(".complete_skill").click(function(e){
    var el = $(this);
    var l = Ladda.create(this);
    l.start();
    var data = new FormData();
    data.append("skill_id", 9);
    data.append("access_token", token);
    fetch("http://localhost:3000/api/v1/complete_skill", {method: "post", body: data})
      .then(function() {
        return new Promise(function(resolve, reject) {
          setTimeout(resolve, 1000);
        });
      })
      .then(function() {
        l.stop();
        el.css("background-color", "green");
      })
      .catch(function() {
        console.log("error");
        console.log(e);
      });
  });
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