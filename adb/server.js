var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
port = process.argv[2] || 8888;
var exec = require('child_process').exec,
    child;
    var KB=0;
http.createServer(function(request, response) {
    var param = url.parse(request.url, true);
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    if (filename.indexOf('adb.tap') > 0) {
        console.log('adb shell input tap ' + param.query.x + ' ' + param.query.y);
        child = exec('adb shell input tap ' + param.query.x + ' ' + param.query.y,
            function(error, stdout, stderr) {

            });

        response.end();
    } else
    if (filename.indexOf('adb.type') > 0) {
        console.log('adb shell input text ' + param.query.key);
        child = exec('adb shell input text ' + param.query.key,
            function(error, stdout, stderr) {

            });

        response.end();
    } else
    if (filename.indexOf('adb.key') > 0) {
        console.log('adb shell input keyevent ' + param.query.key);
        child = exec('adb shell input keyevent ' + param.query.key,
            function(error, stdout, stderr) {

            });

        response.end();
    }

    path.exists(filename, function(exists) {


        if (!exists) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });

            response.write(filename + " FUCK 404 Not Found\n");
            response.end();
            return;
        }

        var stat=fs.statSync(filename);
        if (stat.isDirectory()) filename += '/index.html';
                if (filename.indexOf('screen.png') > 0) {

        } 
        var fileSizeInBytes = stat["size"];
        var kb = fileSizeInBytes / 1000;    
        var mtime = stat.mtime;
        var headers = {};
        
        if(kb==KB && kb!=0 && kb=='12'){
            
            response.writeHead(304, {
                   "Last-Modified": mtime.toUTCString()
               });

               response.end();
        }else{
            console.log('no cache');
        fs.readFile(filename, function(err, file) {
            

            if (filename.indexOf('.js') > 0) {
                headers["Content-Type"] = "text/javascript";
            } else
            if (filename.indexOf('.html') > 0) {

                headers["Content-Type"] = "text/html";
            } else
            if (filename.indexOf('.css') > 0) {
                headers["Content-Type"] = "text/css";
            } else
            if (filename.indexOf('.png') > 0) {
                headers["Content-Type"] = "image/png";
            } else
            if (filename.indexOf('.jpg') > 0) {

                headers["Content-Type"] = "image/jpeg";
            }
            headers["Last-Modified"]= mtime.toUTCString();

            response.writeHead(200, headers);

            response.end(file, 'binary');
        });
        KB=kb;
    }
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
