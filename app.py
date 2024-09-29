from backend.modules.filemanager.filemanager import FileManager
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
import webbrowser
import json

HostName = "localhost"
HostPort = 8080

class ServerController(SimpleHTTPRequestHandler):
    # Helper to organize routes
    def router(self, ctx, mode):    
        get_routes = {
                None: self.invalidEndpoint,
                '/getEndpointExample': self.endpointExample_GET,  
            }

        post_routes = {
                None: self.invalidEndpoint,
                '/postEndpointExample': self.endpointExample_POST,
                '/getDefaultSettings': self.epDefaultAppSettings,
            }
        
        def getRouteFunc(path, routeDict):
            return routeDict.get(path, routeDict[None])
        
        routes = None
        if mode == "GET":
            routes = get_routes
        elif mode == "POST":
            routes = post_routes
            
        routeFunc = getRouteFunc(ctx.path, routes)        
        routeFunc(ctx,None)     
              
    # Set default GET to our router
    def do_GET(self):
        # Redirect to filelike server
        if self.path.startswith('/web/'):
            return SimpleHTTPRequestHandler.do_GET(self)
        
        # Redirect to endpoint router
        self.router(self, "GET")

    # Set default POST to our router        
    def do_POST(self):
        self.router(self, "POST")
   
    # Handshake Options for CORs Setup        
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        
    # Checks if the received POST payload is a JSON type
    def _isPostPayloadJson(self, ctx):
        if ctx.headers.get("Content-Type") != 'application/json':
            ctx.send_response(400)
            ctx.end_headers()
            return False
        
        return True        
        
    # Get the payload in Python data structure (dicts, lists and primitives)
    def _getPayload(self, ctx, opts):
        contentLength = int(ctx.headers['Content-Length'])
        postDataBytes = ctx.rfile.read(contentLength)
        postDataStr = postDataBytes.decode('utf-8')
        payload = json.loads(postDataStr)
        return payload
    
    # Sets a default response to the ctx
    def _setsDefaultResponseHeaders(self, ctx, response = 200, contentType = 'application/json'):
        ctx.send_response(response)
        ctx.send_header("Content-type", contentType)
        ctx.send_header('Access-Control-Allow-Origin', '*')
        ctx.end_headers()   
        return True

    # Writes JSON response to body
    def _writeJsonResponse(self, ctx, jsonObj, encoding = 'utf_8'):
        ctx.wfile.write(json.dumps(jsonObj).encode(encoding=encoding)) 
        return True
    
    # Writes a TEXT response to body
    # The function will attempt to cast each element of outputList as string and write it
    def _writeTextResponse(self, ctx, outputList, encoding = 'utf_8'):
        for outputObj in outputList:
            ctx.wfile.write(bytes(str(outputObj), encoding))
        return True

    
    # Fallback for invalid endpoints    
    def invalidEndpoint(self, ctx, opts):
        self._setsDefaultResponseHeaders(ctx, 200, "text/html")
        
        responseBody = [
            "<html><head><title>Page Title</title></head>",
            "<p>Request: %s</p>" % self.path,
            "<body>",
            "<p>Invalid Endpoint.</p>",
            "</body></html>",
        ]
        self._writeTextResponse(ctx, responseBody)
        
    # GET type endpoint with a JSON response        
    def endpointExample_GET(self, ctx, opts):        
        # Response - Headers      
        self._setsDefaultResponseHeaders(ctx, 200)
        
        # Response - Data
        responseData = {"response": True}
        self._writeJsonResponse(ctx, responseData)

    # POST type endpoint with a JSON response equals its payload
    def endpointExample_POST(self, ctx, opts):
        # Request - Check Datatype
        if not self._isPostPayloadJson(ctx):
            return
        
        # Request - Get Payload
        payload = self._getPayload(ctx, opts)

        # Response - Headers      
        self._setsDefaultResponseHeaders(ctx, 200) 
        
        # Response - Data
        self._writeJsonResponse(ctx, payload)

    # -----------------------------------------------------------
    # -----------------------------------------------------------
    # -----------------------------------------------------------

    # POST: get default settings
    def epDefaultAppSettings(self, ctx, opts):
        if not self._isPostPayloadJson(ctx):
            return
        payload = self._getPayload(ctx, opts)

        # TODO still not sure what to put here
        responseJson = {
            "config1": "value1"
        }

        self._setsDefaultResponseHeaders(ctx, 200) 
        self._writeJsonResponse(ctx, responseJson)

    # POST: get projects list
    def epGetProjectsList(self, ctx, opts):
        if not self._isPostPayloadJson(ctx):
            return
        payload = self._getPayload(ctx, opts)

        # TODO
        responseJson = {
            "config1": "value1"
        }

        self._setsDefaultResponseHeaders(ctx, 200) 
        self._writeJsonResponse(ctx, responseJson)

    


# Saves a JS with basic backend definifions
# These definitions may serve as a starting point to simplify frontend configuration
backendDefinitionsObj = {
    "host": HostName,
    "port": HostPort
}
backendDefinitions = "export const definitions = " + json.dumps(backendDefinitionsObj) + ";"
FileManager.saveTextFile(backendDefinitions, "backend.js", ["web","modules","definitions"])


# Start APP
HostHandler = TCPServer((HostName, HostPort), ServerController)

try:
    serverAdress = "http://%s:%s" % (HostName, HostPort)
    print("Server started:")
    print(serverAdress)
    webbrowser.open(serverAdress) 
    HostHandler.serve_forever()    
    
except KeyboardInterrupt:
    pass

HostHandler.server_close()

print("Server stopped.")