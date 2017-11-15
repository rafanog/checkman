var cheerio = require('cheerio'); //jquery easy implementation
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; //module for http calls
var xhr = new XMLHttpRequest();
//////////////////////////////////////
//Data variables /////////////////////
//////////////////////////////////////
const baseUrl = 'https://auth0.com/docs/quickstart/';
const linksLocation = '.docs-content .quickstart-docs-content a';

var caseD = {
	"name": "Vue.js",
	"type": "spa",
	"url": "vuejs",
	"sections": ['01-login'],
	"title": "Auth0 Vue SDK Quickstarts: Login"
};
/////////////////////////////////////
//Exec///////////////////////////////
/////////////////////////////////////
var url = createURL(caseD);
console.log('Checking all links inside: ' + caseD.name);
checkAllLinks(url);
/////////////////////////////////////
//Function Zone//////////////////////
/////////////////////////////////////
function createURL(qs){
	return baseUrl + qs.type + '/' + qs.url;
};

function checkAllLinks(address){
	console.log('Extracting links...');
	var pageStatus = checkUrl(address);
	if(!(pageStatus==200)){
		//print error code
		console.log('Error: ' + pageStatus);
	}else{
		var $ = cheerio.load(captureBody(address));
		var linkList = new Array();
		var errCount = 0;

		$(linksLocation).each(function() {
			var link = {"text": "", "url":"", "status": "", "target": ""}
			link.text = $(this).text();
			link.url = $(this).attr('href');
			link.status = checkUrl(link.url);
			link.target = $(this).attr('target');
			linkList.push(link);
			
			/*if(link.status == 404){
				console.log(link.text + ' ' + link.url +  ' ' + link.status);
				errCount++;
			}*/

		});
		
		var errList = new Array();

		for(i = 0; i < linkList.length; i++){
			console.log('Testing in progress: ' + Math.round((i*100)/linkList.length) + '%');
			linkList[i].status = checkUrl(linkList[i].url);
			if(linkList[i].status != 200 || linkList[i].status != 301){
				console.log('Text: ' + linkList[i].text);
				console.log('URL: ' + linkList[i].url + ' Error: ' + linkList[i].status);
				var error = {

				}
			}


		}
	}

}

function captureBody(link){
	xhr.open('GET', link, false);
	xhr.send(null);
	return xhr.responseText;
}

function checkUrl(link){
	//returns the response of making a get 
	//call to a url
	xhr.open('Get', link, false);
	xhr.send(null);
	return xhr.status;
}