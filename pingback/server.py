import xmlrpc.server
import requests
import re

blogCommentServer = 'https://comment.imyoyo.xyz/comment'
host = ('localhost', 8362)
def extractTitle(url):
    r = requests.get(url, verify=False).text
    return re.findall(r"<title>(.*)</title>", r)[0]

def pingback(pagelinkedfrom , pagelinkedto):
    #1.提取pagelinkedfrom标题
    title = extractTitle(pagelinkedfrom)
    #2.添加评论
    data={
        "comment":"博客引文 ：[{}]({})".format(title,pagelinkedfrom),
        "nick":"引用助手",
        "mail":"huyong@bupt.edu.cn",
        "link":"https://imyoyo.xyz/",
        "url":pagelinkedto[pagelinkedto.find("/post"):]

    }
    headers={
        "content-type": "application/json",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.aHV5b25nQGJ1cHQuZWR1LmNu.ewHncTmRIUDh_hnZJ07WkZm4fNDQ51410VK4qDNpCkc"
    }
    r = requests.post(blogCommentServer,headers=headers,json=data,verify=False).json()
    print(r)
    if r["errno"] == 0:
        return "success"
    else:
        return "fail"

def main():
    with xmlrpc.server.SimpleXMLRPCServer(host) as server:
        server.register_introspection_functions()
        server.register_function(pingback)
        server.serve_forever()

if __name__ == "__main__":
    print("pingback server, listen at: %s:%s" % host)
    main()