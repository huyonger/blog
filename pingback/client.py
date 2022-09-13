from http.server import HTTPServer, SimpleHTTPRequestHandler
import xmlrpc.client
import json
host = ('localhost', 8361)

class Resquest(SimpleHTTPRequestHandler):
    
    def do_POST(self):
        post = self.rfile.read(int(self.headers['content-length']))   
        post = json.loads(post.decode("utf-8", 'ignore'))
        pingbackServer = post['pingbackServer']
        try:
            with xmlrpc.client.ServerProxy(pingbackServer) as proxy:
                res = proxy.pingback(post["pagelinkedfrom"],post["pagelinkedto"])
                if res == "success":
                    self.send_response(200)
                    self.send_header("Content-type","text/plain")    
                    self.end_headers()
                    self.wfile.write(res.encode()) 
                else:
                    self.send_error(code=500,message="fail")
        except Exception:
            print(Exception)
            self.send_error(code=500,message="fail")


 
if __name__ == '__main__':
    server = HTTPServer(host, Resquest)
    print("pingback client, listen at: %s:%s" % host)
    server.serve_forever()
