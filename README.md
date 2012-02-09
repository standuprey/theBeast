Add the js files in your HTML's head: 

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.7.min.js"></script>
    <script src="/theBeast.js" type="text/javascript"></script>

The basic syntax to add a module is the following:

    theBeast.add({
      _moduleName_: function(){
        // do something here
      });
    });

If you then have a DOM element with the attribute `data-theBeast="_moduleName_"`, the module will be loaded.

Tutorial and more features: [here](http://theBeast.heroku.com/).
