import React, { useState, useEffect } from "react";

// Main App component
const App = () => {
  // State for the original path data
  const [pathData, setPathData] = useState("M10 10 H90 V90 H10 Z");
  // State for the new, transformed path data.
  const [transformedPath, setTransformedPath] = useState("");
  // State for the x-axis offset.
  const [xOffset, setXOffset] = useState(10);
  // State for the y-axis offset.
  const [yOffset, setYOffset] = useState(10);
  // State for error messages.
  const [errorMessage, setErrorMessage] = useState("");
  // State for unit test results
  const [testResults, setTestResults] = useState<
    {
      transformed: string;
      passed: boolean;
      name: string;
      input: string;
      xOffset: number;
      yOffset: number;
      expected: string;
    }[]
  >([]);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  // Unit tests to verify the transformation logic
  const runTests = () => {
    const testCases = [
      {
        name: "Simple absolute square",
        input: "M10 10 H90 V90 H10 Z",
        xOffset: 10,
        yOffset: 10,
        expected: "M 20 20 H 100 V 100 H 20 Z",
      },
      {
        name: "Simple relative square",
        input: "m10 10 h80 v80 h-80 z",
        xOffset: 10,
        yOffset: 10,
        expected: "m 20 20 h 80 v 80 h -80 z",
      },
      {
        name: "Complex path with absolute and relative commands",
        input: "M10 10 L50 50 l20 0 Z",
        xOffset: 5,
        yOffset: 5,
        expected: "M 15 15 L 55 55 l 20 0 Z",
      },
      {
        name: "User-provided path (your specific case)",
        input:
          "m19.01 11.55-7.46 7.46c-.46.46-.46 1.19 0 1.65a1.16 1.16 0 0 0 1.64 0l7.46-7.46c.46-.46.46-1.19 0-1.65s-1.19-.46-1.65 0Zm.16-8.21c-.46-.46-1.19-.46-1.65 0L3.34 17.52c-.46.46-.46 1.19 0 1.65a1.16 1.16 0 0 0 1.64 0L19.16 4.99c.46-.46.46-1.19 0-1.65Z",
        xOffset: 10,
        yOffset: 10,
        expected:
          "m 29.01 21.55 -7.46 7.46 c -0.46 0.46 -0.46 1.19 0 1.65 a 1.16 1.16 0 0 0 1.64 0 l 7.46 -7.46 c 0.46 -0.46 0.46 -1.19 0 -1.65 s -1.19 -0.46 -1.65 0 Z m 0.16 -8.21 c -0.46 -0.46 -1.19 -0.46 -1.65 0 L 13.34 27.52 c -0.46 0.46 -0.46 1.19 0 1.65 a 1.16 1.16 0 0 0 1.64 0 L 29.16 14.99 c 0.46 -0.46 0.46 -1.19 0 -1.65 Z",
      },
      {
        name: "Absolute Line commands",
        input: "M10 10 L50 20 L30 40",
        xOffset: 5,
        yOffset: 5,
        expected: "M 15 15 L 55 25 L 35 45",
      },
      {
        name: "Relative Line commands",
        input: "m10 10 l40 10 l-20 20",
        xOffset: 5,
        yOffset: 5,
        expected: "m 15 15 l 40 10 l -20 20",
      },
      {
        name: "Absolute Curve commands",
        input: "M10 10 C20 40 40 40 50 10",
        xOffset: 10,
        yOffset: 10,
        expected: "M 20 20 C 30 50 50 50 60 20",
      },
      {
        name: "Relative Curve commands",
        input: "m10 10 c10 30 30 30 40 0",
        xOffset: 10,
        yOffset: 10,
        expected: "m 20 20 c 10 30 30 30 40 0",
      },
    ];

    const results = testCases.map((test) => {
      const transformed = handleTransformLogic(
        test.input,
        test.xOffset,
        test.yOffset
      );
      // Remove all whitespace for a robust comparison
      const passed =
        transformed.replace(/\s+/g, "") === test.expected.replace(/\s+/g, "");
      return { ...test, transformed, passed };
    });

    setTestResults(results);
  };

  // Function to apply the transformation logic
  const handleTransformLogic = (d: string, dx: number, dy: number) => {
    // Regex to split the path string into commands and their arguments as groups
    const commandRegex = /([a-zA-Z][^a-zA-Z]*)/g;
    const commands = d.match(commandRegex);
    if (!commands) return "";

    let newPath = "";
    let isFirstCommand = true;

    for (const cmdGroup of commands) {
      const command = cmdGroup[0]!;
      const paramsString = cmdGroup.substring(1);

      // Regex to extract all numbers, including decimals and negative signs
      const values = paramsString.match(/-?\d*\.?\d+/g) || [];
      const newValues = values.map(Number);

      let isRelativeCommand = command.toLowerCase() === command;
      let isAbsoluteCommand = !isRelativeCommand;

      let paramIndex = 0;
      let transformedValues = [];

      while (paramIndex < newValues.length) {
        let val = newValues[paramIndex]!;

        if (isAbsoluteCommand || (isFirstCommand && paramIndex < 2)) {
          if (command.toUpperCase() === "H") {
            transformedValues.push(val + dx);
          } else if (command.toUpperCase() === "V") {
            transformedValues.push(val + dy);
          } else if (
            command.toUpperCase() === "A" &&
            (paramIndex === 5 || paramIndex === 6)
          ) {
            // Arc command's last two parameters are coordinates
            transformedValues.push(val + (paramIndex === 5 ? dx : dy));
          } else if (paramIndex % 2 === 0) {
            transformedValues.push(val + dx);
          } else {
            transformedValues.push(val + dy);
          }
        } else {
          transformedValues.push(val);
        }
        paramIndex++;
      }

      // Rebuild the path string with proper spacing
      newPath += `${command} ${transformedValues.join(" ")} `;

      isFirstCommand = false;
    }

    return newPath.trim();
  };

  // Function to apply the transformation to the user input
  const handleTransform = () => {
    setErrorMessage("");
    try {
      if (!pathData.trim()) {
        setErrorMessage("Please enter a valid SVG path data string.");
        return;
      }
      const newPathData = handleTransformLogic(pathData, xOffset, yOffset);
      setTransformedPath(newPathData);
    } catch (error) {
      setErrorMessage(
        "An error occurred during transformation. Please check your input."
      );
      console.error(error);
    }
  };

  // Run tests on initial load
  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-indigo-400">
            SVG Path Transformer
          </h1>
          <p className="text-slate-400">
            Enter your SVG `d` attribute and specify the desired translation to
            get the new path data.
          </p>
        </header>

        <main className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 space-y-6">
          {/* Input section for original path data */}
          <div className="space-y-2">
            <label
              htmlFor="original-path"
              className="block text-lg font-medium text-slate-200"
            >
              Original `d` attribute
            </label>
            <textarea
              id="original-path"
              value={pathData}
              onChange={(e) => setPathData(e.target.value)}
              className="w-full h-24 p-4 text-slate-100 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              placeholder="e.g., M10 10 L50 90 L90 10 Z"
            />
          </div>

          {/* Input section for offsets */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label
                htmlFor="x-offset"
                className="block text-lg font-medium text-slate-200"
              >
                Move Right/Left (X)
              </label>
              <input
                id="x-offset"
                type="number"
                value={xOffset}
                onChange={(e) => setXOffset(parseFloat(e.target.value))}
                className="w-full p-3 text-slate-100 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label
                htmlFor="y-offset"
                className="block text-lg font-medium text-slate-200"
              >
                Move Up/Down (Y)
              </label>
              <input
                id="y-offset"
                type="number"
                value={yOffset}
                onChange={(e) => setYOffset(parseFloat(e.target.value))}
                className="w-full p-3 text-slate-100 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Transform button */}
          <button
            onClick={handleTransform}
            className="w-full py-3 px-6 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
          >
            Transform Path
          </button>

          {/* Error message display */}
          {errorMessage && (
            <div className="text-red-400 bg-red-900 bg-opacity-50 p-4 rounded-md mt-4 border border-red-800">
              {errorMessage}
            </div>
          )}

          {/* Transformed output section */}
          {transformedPath && (
            <div className="space-y-2">
              <label
                htmlFor="transformed-path"
                className="block text-lg font-medium text-slate-200"
              >
                New `d` attribute
              </label>
              <textarea
                id="transformed-path"
                readOnly
                value={transformedPath}
                className="w-full h-24 p-4 text-slate-100 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
          )}
        </main>

        {/* Visual preview section */}
        <section className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 text-slate-200">
            Visual Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-xl p-4 border-2 border-slate-700">
              <h3 className="text-xl font-semibold mb-2 text-center text-slate-300">
                Original Path
              </h3>
              <div className="w-full aspect-square border border-dashed border-slate-600 rounded-lg overflow-hidden">
                <svg viewBox="0 0 150 150" className="w-full h-full">
                  <path
                    d={pathData}
                    fill="#4f46e5"
                    stroke="#818cf8"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border-2 border-slate-700">
              <h3 className="text-xl font-semibold mb-2 text-center text-slate-300">
                Transformed Path
              </h3>
              <div className="w-full aspect-square border border-dashed border-slate-600 rounded-lg overflow-hidden">
                <svg viewBox="0 0 150 150" className="w-full h-full">
                  <path
                    d={transformedPath || pathData}
                    fill="#10b981"
                    stroke="#34d399"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Unit tests section */}
        <section className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 text-slate-200">Unit Tests</h2>
          <p className="text-slate-400 mb-4">
            These tests check the transformation logic with various path data
            examples.
          </p>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.passed
                    ? "bg-emerald-900/50 border-emerald-500"
                    : "bg-red-900/50 border-red-500"
                }`}
              >
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  {result.passed ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-red-400">✗</span>
                  )}
                  {result.name}
                </h4>
                <div className="ml-6 space-y-2 text-sm">
                  <p className="text-slate-300">
                    <strong>Input:</strong>
                  </p>
                  <pre className="p-2 overflow-x-auto text-slate-50 bg-slate-900 rounded-md">
                    <code>{result.input}</code>
                  </pre>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-300">
                      <strong>Transformed:</strong>
                    </p>
                    {!result.passed && (
                      <button
                        onClick={() => copyToClipboard(result.transformed)}
                        className="py-1 px-3 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Copy Error
                      </button>
                    )}
                  </div>
                  <pre className="p-2 overflow-x-auto text-slate-50 bg-slate-900 rounded-md">
                    <code>{result.transformed}</code>
                  </pre>
                  <p className="text-slate-300">
                    <strong>Expected:</strong>
                  </p>
                  <pre className="p-2 overflow-x-auto text-slate-50 bg-slate-900 rounded-md">
                    <code>{result.expected}</code>
                  </pre>
                  {!result.passed && (
                    <p className="text-red-400 mt-2">
                      <strong>Error:</strong> Expected output does not match the
                      transformed output.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
