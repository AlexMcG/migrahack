var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

//setup
var root = "/home/alex/Desktop/git/migrahack";
var head = root + "/head.html";
var nav = root + "/nav.html";
var canvas = root + "/canvas.html";
var cache = [];
    
http.createServer(function(request, response) {  
  //finds the path of bash and the process
  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);
    
  path.exists(filename, function(exists) {
    //error check
    if(exists) {
        //write header
        response.writeHead(200);
        
        if (filename == root + "/") { filename += "index.html"; }
        //console.log(filename);
        var files = [filename, head, nav, canvas];
     
      if (filename.indexOf(".html") > -1) {
        if (cache[filename] && cache[nav] && cache[canvas] && cache[head]) { writer(filename, response); console.log("CACHED:", filename); }
        for (i in files) {
            if (!cache[files[i]]) { cacher(files[i], filename, response); console.log("NOT:", files[i]); }
        }
      } else {
        rest(filename, response);
      }
    }
  });
//listen on port
}).listen(8080);
//prints to show its working
console.log("working...");

function cacher(file, filename, response) {
    fs.readFile(file, function(err, data) {
        if (err) { console.log(err); return; }
        cache[file] = data;
        if (cache[filename] && cache[nav] && cache[canvas] && cache[head]) {
            writer(filename, response); console.log("NOT:", filename);
        }
    });
}

function writer(filename, response) {
    if (filename.indexOf("index.html") > -1) {
        response.write(cache[head] + cache[filename] + cache[nav] + cache[canvas]);
    } else if (filename.indexOf("about.html") > -1) {
        response.write(cache[head] + "        </head>" + cache[nav] + cache[filename]);
    } else if (filename.indexOf("region") > -1) {
        response.write(cache[head] + cache[filename] + cache[nav] + cache[canvas]);
    } else { console.log("error"); }
    response.end();
}

function rest(filename, response) {
    if (!cache[filename]) {
        console.log("NOT:", filename);
        fs.readFile(filename, function(err, data) {
            if (err) { console.log(err); return; }
            cache[filename] = data;
            response.write(cache[filename]);
            response.end();
        });
    } else {
        console.log("CACHED:", filename);
        response.write(cache[filename]);
        response.end();
    }
}