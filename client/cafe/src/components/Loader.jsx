/**
 * Loader component for loading states
 */
function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-3 text-lg font-medium text-gray-700">Loading...</span>
    </div>
  );
}

export default Loader;