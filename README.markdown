- Add the js files in your HTML's head: 

&nbsp;&nbsp;`<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.min.js"></script>`
&nbsp;&nbsp;`<script src="/theBeast.js" type="text/javascript"></script>`

- The basic syntax to add a modules is the following:

&nbsp;&nbsp;`theBeast.add({`
&nbsp;&nbsp;&nbsp;&nbsp;`_moduleName_: function(){`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`// do something here`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`});`
&nbsp;&nbsp;&nbsp;&nbsp;`}`
&nbsp;&nbsp;`});`
  `

- If you then have a DOM element with the attribute data-theBeast="_moduleName_", the module will be loaded.

- Tutorial and more features: [here](http://theBeast.heroku.com/).
