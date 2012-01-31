var JSMODULES = JSMODULES || (function(){
  // pubsub
  var cache = {};
  function subscribe(module){
    for (topic in module){
      if (!cache[topic]) cache[topic] = [];
      cache[topic].push(module);
    }
  };
  function unsubscribe(module){
    for (topic in module) {
      var topicArray = cache[topic]
      for (var i = 0, len = topicArray.length; i<len; i++)
        if (topicArray[i] == module) topicArray[i].splice(i, 1);
    }
  };

  modules = {};
  
  return {
    modules: {},
    publish: function(topic){
      topic = topic.replace(/\s/, "");
      topic = "on"+topic.charAt(0).toUpperCase() + topic.slice(1);
      if (cache[topic]) {
        for (var i = 0, len = cache[topic].length; i<len; i++) {
          var module = cache[topic][i];
          module[topic].call(module, arguments[1]);
        }
      }
    },
    add: function(newModules){
      for (moduleName in newModules) {
        var moduleFn = newModules[moduleName]
        if (typeof moduleFn == "function") modules[moduleName]=moduleFn;
      }
    },
    remove: function(moduleName){
      if (typeof modules[moduleName] == "object") {
        unsubscribe(modules[moduleName])
        delete modules[moduleName];
      }
    },
    load: function(){
      $("[data-jsmodules]").each(function(){
        var $this = $(this);
        var moduleNames = $this.attr("data-jsmodules").split(",");
        for(var i=0, len = moduleNames.length; i<len; i++) {
          var moduleName = moduleNames[i].replace(/^\s+|\s+$/g, ''); 
          if (JSMODULES.modules[moduleName] === undefined && modules[moduleName] != undefined) {
            JSMODULES.modules[moduleName] = modules[moduleName]() || true;
            subscribe(JSMODULES.modules[moduleName]);
          }
          var currentModule = JSMODULES.modules[moduleName];
          if (typeof currentModule === "object" && typeof currentModule.executeAnyway === "function")
            currentModule.executeAnyway.call($this);
        }
      });
    },
  }
})()

$(document).ready(function(){
  JSMODULES.load();
});