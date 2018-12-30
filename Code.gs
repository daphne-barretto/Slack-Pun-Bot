/*
MARS 2614
Programming Bot

Created by: Daphne Barretto
*/

////////////////////////////////////*Global Variables*///////////////////////////////////////////

    var sheetId = "1a2TRESpZbbcYj2L_sXHKZPuYUaZgxuugPI_sesZ5Dnw";
    var logSpreadsheet = SpreadsheetApp.openById(sheetId);
    var punSheet = logSpreadsheet.getSheetByName("Puns");
    var logSheet = logSpreadsheet.getSheetByName("Log");

//////////////////////////////////////////////////doGet//////////////////////////////////////////////////

var userName = "";

//Runs on HTTP GET -> Need to implement if statments to check command names
function doGet(e){
  
  botLog(e.parameter.command, e.parameter.user_name, e.parameter.text);    //logs the slash command, inputted parameters/text user, and time of usage into a separate spreadsheet
  
  userName = e.parameter.user_name;
  
  if (e.parameter.command == "/pun"){
    makePun();
  }
  else if (e.parameter.command == "/addpun"){
    addPun(userName, e.parameter.text);
  }
  
  return ContentService.createTextOutput("");
}

////////////////////////////////////////////////// /pun //////////////////////////////////////////////////


//Makes Puns
function makePun(){

    var punAmount = punSheet.getMaxRows()
    var randomNumber = Math.random() * punAmount;    //Multiply by array size value
    var roundedRandomNumber = Math.round(randomNumber);//Round to an integer
    
    var pun = punSheet.getRange("A" + roundedRandomNumber).getValue();
  
  Logger.log(pun);
  
    //postToSlack("A good pun is its own reword",pun,'good');   //posts randomly chosen pun
    
    var payload= {
	"fallback": "A good pun is its own reword", //Smartphone Notification Message
	"color": 'good', // Can either be one of 'good', 'warning', 'danger', or any hex color code
    //"pretext": "You can now add to the available puns using /addpun",
    "fields": [{
      "title": "A good pun is its own reword", // Message Header
      "value": pun, // Message to be displayed
      "short": false // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
		      }]
    };  
    
    Logger.log(payload);
  
  var options = {
            'method' : 'post',
            'payload' : JSON.stringify(payload),
        };
  
  var webhookUrl = 'https://hooks.slack.com/services/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';
  UrlFetchApp.fetch(webhookUrl, options);
  
}


////////////////////////////////////////////////// /addPun //////////////////////////////////////////////////


//Adds Puns to an external spreadsheet
function addPun(user_name, pun){
    
    punSheet.insertRowBefore(1); 
    punSheet.getRange("A1").setValue(pun); //Log pun
    punSheet.getRange("B1").setValue(user_name); //Log user
    punSheet.getRange("C1").setValue(Date()); //Log time
    
}


////////////////////////////////////*Utility Functions*///////////////////////////////////////////


//Utility function to simplify sending messages to slack
function postToSlack(title, message, color){
  
  var payload= {
	"fallback": title, //Smartphone Notification Message
	"color": color, // Can either be one of 'good', 'warning', 'danger', or any hex color code
	"fields": [{
			"title": title, // Message Header
			"value": message, // Message to be displayed
			"short": false // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
		      }]
    };  
  
  var options = {
            'method' : 'post',
            'payload' : JSON.stringify(payload),
        };
  
  var webhookUrl = 'https://hooks.slack.com/services/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';
  UrlFetchApp.fetch(webhookUrl, options);
  
}

//Utility function to simplify sending messages to Biff's slack
function postToSlackBiff(title, message, color){
  
  var payload= {
	"fallback": title, //Smartphone Notification Message
	"color": color, // Can either be one of 'good', 'warning', 'danger', or any hex color code
	"fields": [{
			"title": title, // Message Header
			"value": message, // Message to be displayed
			"short": false // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
		      }]
    };  
  
  var options = {
            'method' : 'post',
            'payload' : JSON.stringify(payload),
        };
  
  var webhookUrl = 'https://hooks.slack.com/services/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';
  UrlFetchApp.fetch(webhookUrl, options);  
  
}

////////////////////////////////////*Utility Functions*///////////////////////////////////////////

//logging information to spreadsheet since GAS can't log Web Apps
function botLog(command, user_name, text){
  logSheet.insertRowBefore(1); 
  logSheet.getRange("A1").setValue(command); //Log command
  logSheet.getRange("B1").setValue(text); //Log inputted text/parameters
  logSheet.getRange("C1").setValue(user_name); //Log user
  logSheet.getRange("D1").setValue(Date()); //Log time
}

/* ########### Sample Webhook Request - Includes how to make Hyperlinks ############

payload={"text": "A very important thing has occurred! <https://alert-system.com/alerts/1234|Click here> for details!"}
{
	"fallback": "Required text summary of the attachment that is shown by clients that understand attachments but choose not to show them.",

	"text": "Optional text that should appear within the attachment",
	"pretext": "Optional text that should appear above the formatted data",

	"color": "#36a64f", // Can either be one of 'good', 'warning', 'danger', or any hex color code

	// Fields are displayed in a table on the message
	"fields": [
		{
			"title": "Required Field Title", // The title may not contain markup and will be escaped for you
			"value": "Text value of the field. May contain standard message markup and must be escaped as normal. May be multi-line.",
			"short": false // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
		}
	]
}				

*/