theBeast.add({
  history: function() {
    function mergeParams(currentParams, newParams) {
      for (var i=0, len=newParams.length; i<len; i++) {
        var keyValue = newParams[i].split("=");
        var found = false;
        for (var j=0, lenj=currentParams.length; j<lenj; j++) {
          if (currentParams[j].indexOf(keyValue[0]+"=")===0) {
            found = true;
            currentParams[j] = newParams[i];
            break;
          }
        }
        if (!found) currentParams.push(newParams[i]);
      }
      return currentParams;
    };
    function getCurrentPage(link) {
      return link.replace(/(^http:\/\/)?[^\/]*/, "").replace(/\?.*/, "").replace(/#.*/, "");
    }
    function checkLinkHasDomain(link) {
      if (link.indexOf("?") == 0 || (link.indexOf("?") >= 0 && link.indexOf(location.href.replace(/\?.*/, "").replace(/#.*/, "")) === 0)) {
        var newLink = link.split("?")[1].split("&");
        var params = document.location.search.substr(1).split("&");
        return getCurrentPage(location.href) + "?" + mergeParams(params, newLink).join("&");
      } else {
        return link;
      }
    }
    function loader(link, element) {
      var $element, callback;
      $element = $(element);
      $element.html("<div class='part-loader'></div>");
      callback = arguments[2];
      $element.load(link + " " + element + ">*", function() {
        $element.fadeIn(500);
        theBeast.load();
        theBeast.publish("loaded");
      });
    }
    if (history && history.pushState) {
      $("a[data-remote]").live("click", function(e) {
        theBeast.modules.history.load(this.href, $(this).attr("data-remote"));
        return false;
      });
      $(window).bind("popstate", function(e) {
        if (e.originalEvent.state) {
          if (e.originalEvent.state.ajax) {
            link = checkLinkHasDomain(location.href);
            loader(link, "#content");
          } else if (e.originalEvent.state.reload) {
            window.location.reload();
          }
        }
      });
      history.replaceState({
        reload: true
      }, document.title, location.href);
    }
    return {
      getCurrentPage: function() {
        return getCurrentPage(location.href);
      },
      load: function(link, element, title) {
        if (!typeof link === "string") {
          console.error("theBeast.load: link parameter is not a string");
          return;
        }
        if (!typeof title === "string") title = link;
        link = checkLinkHasDomain(link);
        if (history && history.pushState) {
          history.pushState({
            ajax: true
          }, title, link);
          return loader(link, element);
        } else {
          return window.location.href = link;
        }
      },
      reload: function(mainEl) {
        return loader(location.href, mainEl);
      }
    };
  }
});
