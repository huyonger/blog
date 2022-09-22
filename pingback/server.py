import xmlrpc.server
import requests
import re

blogCommentServer = 'https://comment.imyoyo.xyz/comment?lang=zh-CN'
host = ('localhost', 8362)


def extractTitle(url):
    r = requests.get(url, verify=False).text
    return re.findall(r"<title>(.*)</title>", r)[0]


def pingback(pagelinkedfrom, pagelinkedto):
    #1.提取pagelinkedfrom标题
    title = extractTitle(pagelinkedfrom)
    #2.添加评论
    data = {
        "comment": "博客引文 ：[{}]({})".format(title, pagelinkedfrom),
        "nick": "引用助手",
        "mail": "huyong@bupt.edu.cn",
        "link": "https://imyoyo.xyz/",
        "ua":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        "url": pagelinkedto[pagelinkedto.find("/post"):]
    }
    headers = {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Authorization':
        'Bearer eyJhbGciOiJIUzI1NiJ9.aHV5b25nQGJ1cHQuZWR1LmNu.OVohWHAUiFekik-BbWs8ZU3vTpa-JqI0Ra7dsGjy9mI',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Origin': 'https://imyoyo.xyz',
        'Pragma': 'no-cache',
        'Referer': 'https://imyoyo.xyz/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
    }
    r = requests.post(blogCommentServer,
                      headers=headers,
                      json=data,
                      verify=False).json()
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