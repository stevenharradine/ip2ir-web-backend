/*
 * wire-server.js
 * © 2018 Steven Harradine
 */
var http = require('http')
const { exec } = require('child_process')
const wirePath = "~/Repositories/wire/"
const wireExec = wirePath + "wircmd"

http.createServer(function (req, res) {
	html = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'></head><body>"
	buttons = sanitize_buttons (req.url.split("=")[1])

	exec(wireExec + ' -i 192.168.2.91 -c 3 -b "' + buttons + '"', (error, stdout, stderr) => {
		if (error) {
			html += `exec error: ${error}`;

			res.write(html); //write a response to the client
			res.end(); //end the response
			return;
		}
		html += `stdout: ${stdout}`;
		html += `stderr: ${stderr}`;

		res.write(html); //write a response to the client
		res.end(); //end the response
	});
}).listen(8080);

function sanitize_buttons (unsanitize_string) {
	var VALID_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,"
	var sanitize_string = ""
	for (var i = 0; i < unsanitize_string.length; i++) {
		curTestChar = unsanitize_string.charAt(i)
		sanitize_string += VALID_CHAR.indexOf(curTestChar) >= 0 ? curTestChar : ''
	}
	return sanitize_string
}
