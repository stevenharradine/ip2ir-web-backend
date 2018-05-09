/*
 * wire-server.js
 * © 2018 Steven Harradine
 */
var http = require('http')
const { exec } = require('child_process')
const wirePath = "~/Repositories/wire/"
const wireExec = wirePath + "wircmd"

http.createServer(function (req, res) {
	try {
		var html = "{"
		var connector = -1
		var buttons = null
		var queryString = req.url.split("?")[1]
		var queries = queryString.split("&")

		for (var i = 0; i < queries.length; i++) {
			var query = queries[i].split("=")
			var key = query[0]
			var value = query[1]
			
			if (key == "buttons") {
				buttons = sanitize_buttons (value)
			} else if (key == "connector") {
				connector = sanitize_connector (value)
			}
		}

		var buttons_error = buttons === null
		var connector_error = connector === -1
		var any_errors = buttons_error ||
		                 connector_error

		if (buttons_error) {
				html += '  "buttons_error": "buttons not defined in request",'
		}
		if (connector_error) {
				html += '  "connector_error": "connector not defined in request",'
		}
		if (any_errors) {
				html += '  "errors": "yes"'	// really used as a hack to keep well formed json wrt commas ,
				html += '}'

				res.write(html) //write a response to the client
				res.end() //end the response
				return
		} else {
			exec(wireExec + ' -i 192.168.2.91 -c ' + connector + ' -b "' + buttons + '"', (error, stdout, stderr) => {
				if (error) {
					html += '  "exec_error": "' + removeNewLines (error) + '"'
					html += '}'

					res.write(html) //write a response to the client
					res.end() //end the response
					return
				}

				html += '  "stdout": "' + removeNewLines (stdout) + '",'
				html += '  "stderr": "' + removeNewLines (stderr) + '",'
				html += '  "buttons": "' + buttons + '"'
				html += '}'

				res.write(html) //write a response to the client
				res.end() //end the response
			})
		}
	} catch (exception) {
		html  = '{'
		html += '  "error": "' + exception + '"'
		html += '}'

		res.write(html) //write a response to the client
		res.end() //end the response
	}
}).listen(8080)

function removeNewLines (str) {
	return str.replace(new RegExp('\r?\n','g'), '')
}

function sanitize_buttons (unsanitize_string) {
	var VALID_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,"
	var sanitize_string = ""
	for (var i = 0; i < unsanitize_string.length; i++) {
		curTestChar = unsanitize_string.charAt(i)
		sanitize_string += VALID_CHAR.indexOf(curTestChar) >= 0 ? curTestChar : ''
	}
	return sanitize_string
}

function sanitize_connector (unsanitize_connector) {
	return unsanitize_string >= 1 && unsanitize_string <= 3 ? unsanitize_connector : -1
}
