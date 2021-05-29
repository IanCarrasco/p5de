export const loadScript = async rel_path => {
    const response = await fetch(rel_path)
    const text = await response.text()
    return text
}


export const codegen = (script) => {
    return `
            <!DOCTYPE HTML>
            <html>
                <head>
                    <script src="https://cdn.jsdelivr.net/npm/p5@1.3.1/lib/p5.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/p5.recorder@0.0.7/dist/p5.recorder.js"></script>
                    <script id="script-base">${script}</script>
                    <script>
                        var rec = new p5.Recorder(false)
                        var toggle = false
                    </script>
                </head>
                <body>
                    <main></main>
                </body>
            </html>
    `
}