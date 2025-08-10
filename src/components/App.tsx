import { useState } from "react";

import { transformPath } from "~/lib/transformPath";

const App = () => {
  const [pathData, setPathData] = useState("M10 10 H90 V90 H10 Z");
  const [transformedPath, setTransformedPath] = useState("");

  const [xOffset, setXOffset] = useState(10);
  const [yOffset, setYOffset] = useState(10);

  const [errorMessage, setErrorMessage] = useState("");

  const handleTransform = () => {
    setErrorMessage("");
    try {
      if (!pathData.trim()) {
        setErrorMessage("Please enter a valid SVG path data string.");
        return;
      }
      const newPathData = transformPath(pathData, xOffset, yOffset);
      setTransformedPath(newPathData);
    } catch (error) {
      setErrorMessage(
        "An error occurred during transformation. Please check your input."
      );
      console.error(error);
    }
  };

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
      </div>
    </div>
  );
};

export default App;
