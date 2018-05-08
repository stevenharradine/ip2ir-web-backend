var request = require('sync-request');

var stats_total_tests = 0
var stats_total_pass = 0
var stats_total_fail = 0

var tests = Array ()
tests[0] = buttonTest ("can;cel", "cancel")
tests[1] = buttonTest ("guide,cancel", "guide,cancel")

runTests (tests)
displayAudit ()

function buttonTest (inputedButtons, expectedButtons) {
	var res = request('POST', 'http://localhost:8080?buttons=' + inputedButtons)
	var json = JSON.parse(res.getBody('utf8'))
	var hasPassed = expectedButtons == json.buttons
	
	console.log ("Testing button input: " + inputedButtons)
	console.log ("           Expecting: " + expectedButtons)
	console.log ("                 Got: " + json.buttons)
	console.log ("              Status: " + (hasPassed ? "Pass" : "Fail"))
	console.log ()

	return hasPassed
}

function runTests (tests) {
	for (var i = 0; i < tests.length; i++) {
		stats_total_tests++
		tests[i] ? stats_total_pass++ : stats_total_fail++
	}
}

function displayAudit () {
	console.log ("   Audit")
	console.log ("   *****")
	console.log ("Total Tests: " + stats_total_tests)
	console.log (" Total Pass: " + stats_total_pass)
	console.log (" Total Fail: " + stats_total_fail)
	console.log ("  Pass Rate: " + (stats_total_pass / (stats_total_tests * 1.0) * 100).toFixed(2) + "%")
}
