var cheerio = require('cheerio'); //jquery easy implementation
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; //module for http calls
var env = require('dotenv').config();
var term = require('terminal-kit').terminal;
var progress = require('cli-progress');
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
		//implementation of progressbar
		var bar = new progress.Bar({
			stopOnComplete: true,
			clearOnComplete: true,
		    format: 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
		    hideCursor: true
		}, progress.Presets.shades_classic);
		bar.start($(process.env.SCRAPED_SECTION), 0);	

		var linkList = new Array();
		var count = 0;

		$(process.env.SCRAPED_SECTION).each(function() {
			count++;
			//term.green('Checking ' + count + '/' + $(process.env.SCRAPED_SECTION).length + '\n');
			var link = {
				text: "",
				url: "",
				status: "",
				target: "",
				result: ""
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
			//progress += (count*100)/$(process.env.SCRAPED_SECTION).length
			bar.update(Math.round(count*100/$(process.env.SCRAPED_SECTION).length));
		});

		bar.stop()
		
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