JSMODULES.add({
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
    function loader(link, mainEl) {
      var $mainEl, callback;
      $mainEl = $(mainEl);
      $mainEl.html("<div class='part-loader'></div>");
      callback = arguments[2];
      $mainEl.load(link + " " + mainEl + ">*", function() {
        $mainEl.fadeIn(500);
        JSMODULES.load();
        JSMODULES.publish("loaded");
      });
    }
    if (history && history.pushState) {
      $("a[data-remote]").live("click", function(e) {
        JSMODULES.modules.history.load(this.href, $(this).attr("data-remote"));
        return false;
      });
      $(window).bind("popstate", function(e) {
        console.log(e.originalEvent);
        if (e.originalEvent.state && e.originalEvent.state.ajax) {
          link = checkLinkHasDomain(location.href);
          loader(link, "#content");
        }
      });
    }
    return {
      getCurrentPage: function() {
        return getCurrentPage(location.href);
      },
      load: function(link, mainEl) {
        link = checkLinkHasDomain(link);
        if (history && history.pushState) {
          history.pushState({
            ajax: true
          }, link, link);
          return loader(link, mainEl);
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
