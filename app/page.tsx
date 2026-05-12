export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Trace Engine</h1>
        <p className="text-xl text-gray-600 mb-8">
          Commerce reconciliation and attribution analysis
        </p>
        <a
          href="/api/analyze"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Analysis Results
        </a>
      </div>
    </main>
  );
}
