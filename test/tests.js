reset = function(){
  $("#testModule1, #testModule2, #testModule3").empty();
  theBeast.reset();
  // test fixture
  theBeast.add({
    testModule: function(){
      theBeast.publish("callTestModule3", "callTestModule3");
      $("#testModule1").append("<div class='test'>");
      return {
        instance: function() {
          this.append("<div class='test-instance'>");
          return {
            onInstanceTestTopic: function(){
              this.append("<div class='test-instance-topic-"+arguments[0]+"'>");
            }
          }
        },
        onTestTopic: function(){
          $("#testModule1").append("<div class='"+arguments[0]+"-"+arguments[1]+"'>");
        },
        onCallTestModule: function(){
          $("#testModule1").append("<div class='"+arguments[0]+"'>");
        }
      }
    },
    testModule3: function(){
      theBeast.publish("callTestModule", "callTestModule");
      return {
        onCallTestModule: function(){
          $("#testModule3").append("<div class='"+arguments[0]+"'>");
        },
        onCallTestModule3: function(){
          $("#testModule3").append("<div class='"+arguments[0]+"'>");
        }
      }
    }
  });
  theBeast.load();
};

$(function(){
    test("adding and loading modules", function(){
      reset();
      equal($("#testModule1").find(".test").length, 1, "the module has been loaded");
      equal($("#testModule1").find(".test-instance").length, 1, "the module instance has been called");
      equal($("#testModule2").find(".test-instance").length, 1, "the module instance has been called");
      ok(theBeast.modules.testModule.instance, "theBeast has stored the returned methods");
      ok(theBeast.modules.testModule.onTestTopic, "theBeast has stored the returned methods");
    });
    test("publishing topics", function(){
      reset();
      theBeast.publish("testTopic", "test", "topic");
      equal($("#testModule1").find(".test-topic").length, 1, "a topic has been published with 2 arguments");
      equal($("#testModule1").find(".callTestModule").length, 1, "a topic has been published from another module");
      equal($("#testModule3").find(".callTestModule").length, 1, "a topic has been published from another module");
      equal($("#testModule3").find(".callTestModule3").length, 1, "2 modules published topic targetting each other");
    });
    test("remove module", function(){
      reset();
      var result = 0;
      theBeast.add({toto: function(){ 
        return {
          onTest: function(){result += 1;}
        }
      }});
      $("#testModule1").html("<div data-theBeast='toto'>");
      theBeast.load();
      equal(result, 0, "a module has been added, event not published");
      theBeast.publish("test");
      equal(result, 1, "a module has been added, event published");
      ok(theBeast.modules.toto, "the module is stored");
      theBeast.remove("toto");
      theBeast.load();
      theBeast.publish("test");
      equal(result, 1, "a module has been removed, topic is unregistered");
      ok(!theBeast.modules.toto, "the module is not inside theBeast anymore");
    });
    test("instance subscriptions", function(){
      reset();
      theBeast.publish("instanceTestTopic", "toto");
      equal($("#testModule1").find(".test-instance-topic-toto").length, 1, "a topic has been published with 1 argument");
      equal($("#testModule2").find(".test-instance-topic-toto").length, 1, "a topic has been published with 1 argument");
    });
    test("removing module also unsubscribe its instances", function(){
      reset();
      theBeast.remove("testModule");
      theBeast.publish("instanceTestTopic", "toto");
      equal($("#testModule1").find(".test-instance-topic-toto").length, 0, "instance #testModule1 has been unsubscribed");
      equal($("#testModule2").find(".test-instance-topic-toto").length, 0, "instance #testModule2 has been unsubscribed");
    });
});