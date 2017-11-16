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
		term.progressBar();
		var linkList = new Array();

		$(process.env.SCRAPED_SECTION).each(function() {
			var link = {
				"text": "",
				"url": "",
				"status": "",
				"target": "",
				"result": ""
			};
			
			link.text = $(this).text();
			link.url = $(this).attr('href');
			link.status = checkUrl(link.url);
			link.target = $(this).attr('target');
			
			if (link.status == 404){
				link.result = 'Error: 404';
			}else if (link.target == '_blank'){
				link.result = 'Wrong value for target attribute';
			}else{
				link.result = 'OK';
			}
			linkList.push(link);

			count++;
			progress += (count*100)/$(process.env.SCRAPED_SECTION).length
			progressBar.update(progress);
			
		});
		console.log('Results:');

		for (i = 0; i < linkList.length; i++){
			var message = linkList[i].text + ' ===> ' + linkList[i].result + '\n';
			if(!linkList[i].result == 'OK'){
				term.red(message);
			}else{
				term.green(message);
			}
		}


		
	}

}