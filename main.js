const output = document.getElementById("output");
    const code_error_elem = document.getElementById("code-error");
    var run_code = null


    $(() => output.value = "Initializing...\n")

    // init Pyodide
    function add_to_output(text) {
      output.value += text + "\n"
    }
    async function load_pyodide() {

      let pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
        stdin: window.prompt,
        stdout: add_to_output,
        stderr: add_to_output
      });
      output.value = "Load Packages ...";
      ////////////////////
      await pyodide.loadPackage("micropip").then(async function () {
        await pyodide.runPythonAsync(`
        import micropip
        await micropip.install("rich friendly-traceback markdown hebrew-python".split(' '))
      `);

      })
      //////////////
      fetch("https://cdn.jsdelivr.net/gh/matan-h/python-html-code-editor@main" + "/core.py").then(response =>
        response.text()).then(async function (data) {
        output.value = "Load Core ...";
        await pyodide.runPythonAsync(data)

        run_code = pyodide.globals.get("run_code")

        output.value = "Ready!";
      }).catch(console.error)
      //////////////
      return pyodide;

    }

    let pyodideReadyPromise = load_pyodide();

    async function run(code) {
      output.value = ''
      let hebrew_mode = ('hebrew_mode' in params) ? params["hebrew_mode"] : false
      let pyodide = await pyodideReadyPromise;
      try {
        //let output_string = pyodide.runPythonAsync(code);
        var output_map = run_code(code, hebrew_mode).toJs();

        if (output_map.size) {
          output_map = output_map

          code_error_elem.innerHTML = output_map.get("error")
        } else {
          code_error_elem.innerHTML = "" // clear error
        }

      } catch (err) {
        output.value += err;
      }
    }
    const params = Object.fromEntries(new URLSearchParams(window.location.search).entries())
    let code_string = ('code' in params) ? params["code"] : 'def main():\n\tprint("Hello world!")\nmain()'


    function main() {
      const editor = monaco.editor.create(document.getElementById('container'), {
        value: code_string,
        language: 'python',
        theme: 'vs-dark',
        readOnly: false,
      });


      document.getElementById("run").onclick = () => {
        run(editor.getValue())
      }
    }
    //$(main)
module.exports = main