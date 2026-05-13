export default function ConfigError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl font-bold">!</div>
          <h1 className="text-lg font-bold text-gray-800">Missing Configuration</h1>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Supabase environment variables are not set. Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in the project root:
        </p>
        <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs mb-4 overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
        <p className="text-xs text-gray-400">
          Get these values from your Supabase project → Settings → API.
          Then restart the dev server with <code className="bg-gray-100 px-1 rounded">npm run dev</code>.
        </p>
      </div>
    </div>
  )
}
