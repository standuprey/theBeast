- Add the js files in your HTML's head: 
  `
&nbsp;&nbsp;&lt;script type=&quot;text/javascript&quot; src=&quot;http://code.jquery.com/jquery-1.7.min.js&quot;&gt;&lt;/script&gt;<br/>
&nbsp;&nbsp;&lt;script src=&quot;/theBeast.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;<br/>
  `

- The basic syntax to add a modules is the following:
  `<br/>
&nbsp;&nbsp;theBeast.add({<br/>
&nbsp;&nbsp;&nbsp;&nbsp;_moduleName_: function(){<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// do something here<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br/>
&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
&nbsp;&nbsp;});<br/>
  `

- If you then have a DOM element with the attribute data-theBeast="_moduleName_", the module will be loaded.

- Tutorial and more features: [here](http://theBeast.heroku.com/).
