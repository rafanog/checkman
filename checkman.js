var cheerio = require('cheerio'); //jquery easy implementation
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; //module for http calls
var env = require('dotenv').config();
var term = require('terminal-kit').terminal;
var xhr = new XMLHttpRequest();
/////////////////////////////////////
//Exec///////////////////////////////
/////////////////////////////////////
console.log('Checking: ' + process.argv[2]);
checkAllLinks(process.argv[2]);
/////////////////////////////////////
//Function Zone//////////////////////
/////////////////////////////////////
function captureBody(link){//returns the body of the specified url
	xhr.open('GET', link, false);
	xhr.send(null);
	return xhr.responseText;
}

function checkUrl(link){//returns the response of making a get call to a url
	xhr.open('Get', link, false);
	xhr.send(null);
	return xhr.status;
}

function checkAllLinks(address){
	var pageStatus = checkUrl(address);
	if(!(pageStatus==200)){
		//print error code
		term.red('Error: ' + pageStatus);
	}else{
		term.green('Extracting body...\n');
		//load the body through http call to request it and jquery to load it on a variable
		var $ = cheerio.load(captureBody(address));

		term.green('Filtering links...\n');
		var count = 0;
		var errList = new Array();
		var progressBar, progress = 0;

		progressBar = term.progressBar({
			width: 80 ,
			title: 'Checking every link:' ,
			percent: true
		});
		progressBar.update(progress);

		$(process.env.SCRAPED_SECTION).each(function() {
			var text, link, status, target;
			
			text = $(this).text();
			link = $(this).attr('href');
			status = checkUrl(link);
			target = $(this).attr('target');
			
			count++;
			progress += (count*100)/$(process.env.SCRAPED_SECTION).length
			progressBar.update(progress);
			
			if (status == 404){
				term.red(text +' ===> Error: 404\n');
			}else if (target == '_blank'){
				term.red(text +' ===> Will open on a wrong way');
			}else{
				term.green(text + ' ===> OK!\n');
			}
		});
	}

}