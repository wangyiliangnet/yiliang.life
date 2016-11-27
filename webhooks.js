var http = require('http')
var exec = require('child_process').exec

http.createServer(function(req, res) {
    if (req.url === '/webhooks/push') {
        console.log('deploying')
        exec('sh deploy.sh')
    }
    res.end()
}).listen(3000)

