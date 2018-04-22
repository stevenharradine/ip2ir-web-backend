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
	unsanitized_command = req.url.split("=")[1]

	exec(wireExec + ' -i 192.168.2.91 -c 3 -b "' + unsanitized_command + '"', (error, stdout, stderr) => {
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
