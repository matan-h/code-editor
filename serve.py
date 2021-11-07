with open("script.html") as io:
    html = io.read()

head = """<!doctype html>
<html lang="en">

<meta charset="utf-8">
<title>Monaco editor with pyodide (dev of https://www.matan-h.com/python-editor)</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>"""

body = """
<body>
  <div id="container" style="height:400px;border:1px solid black;"></div>
  <button id="run"> run </button>
  <div>Output:</div>
  <textarea id="output" style="width: 100%;" rows="6" disabled></textarea>
  <div id="code-error"></div>
"""


end = "</body></html>"
html = html.replace("<!--title+head-->",head)
html = html.replace("<!--body-->",body)
html = html.replace("<!--end-->",end)
with open("serve.html","w") as io:
    io.write(html)