// theBeast v0.1 - Stanislas Duprey - sduprey@hugeinc.com
var theBeast = theBeast || (function(){
  // pubsub ala theBeast:
  // it's not a function that subscribes, but a module.
  // every function the module is returning that starts with "on"
  // is recognized as a subscription for the topic corresponding to
  // the name of the function without the leading "on"
  // example: onDisplay corresponds to the topic "display" (case insensitive)
  //          i.e. the method onDisplay of each module will be called when the
  //          command theBeast.publish("display") will be executed
  var cache = {};
  function subscribe(module){
    for (topic in module){
      if (topic.indexOf("on") == 0) {
        if (!cache[topic]) cache[topic] = [];
        cache[topic].push(module);
      }
    }
  };
  
  // unsubscribe is called when we unload modules
  function unsubscribe(module){
    for (topic in module) {
      var topicArray = cache[topic]
      for (var i = 0, len = topicArray.length; i<len; i++)
        if (topicArray[i] == module) topicArray[i].splice(i, 1);
    }
  };

  // this will be populated when theBeast.add function will be called
  modules = {};
  
  return {
    // stores the result of the execution of each module, and is accessible from the outside
    modules: {},
    // call a topic, see the comment above for example
    publish: function(topic){
      topic = topic.replace(/\s/, "");
      topic = "on"+topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
      if (cache[topic]) {
        for (var i = 0, len = cache[topic].length; i<len; i++) {
          var module = cache[topic][i];
          module[topic].call(module, arguments[1]);
        }
      }
    },
    // adds a module to the framework. All modules must be added before theBeast.load is called.
    // i.e. don't wait for $(document).ready to add your modules!
    add: function(newModules){
      for (moduleName in newModules) {
        var moduleFn = newModules[moduleName]
        if (typeof moduleFn == "function") modules[moduleName]=moduleFn;
      }
    },
    // remove a module
    remove: function(moduleName){
      if (typeof modules[moduleName] == "object") {
        unsubscribe(modules[moduleName])
        delete modules[moduleName];
      }
    },
    // main load function, called on $document.ready:
    // - check for every element with attribute data-theBeast
    // - for each of this attribute get the modules it contains (comma separated list of modules)
    // - for each module, if it has not been loaded yet, we need to load it by simply calling the module
    //   and saving the result in the public object modules.
    // - for each module and even if it has been already loaded, we try to execute the method executeAnyway of this module
    //   with the element passed as parameter
    load: function(){
      $("[data-theBeast]").each(function(){
        var $this = $(this);
        var moduleNames = $this.attr("data-theBeast").split(",");
        for(var i=0, len = moduleNames.length; i<len; i++) {
          var moduleName = moduleNames[i].replace(/^\s+|\s+$/g, ''); 
          if (theBeast.modules[moduleName] === undefined && modules[moduleName] != undefined) {
            theBeast.modules[moduleName] = modules[moduleName]() || true;
            subscribe(theBeast.modules[moduleName]);
          }
          var currentModule = theBeast.modules[moduleName];
          if (typeof currentModule === "object" && typeof currentModule.executeAnyway === "function")
            currentModule.executeAnyway.call($this);
        }
      });
    },
  }
})()

// our "main" function...
$(document).ready(function(){
  theBeast.load();
});