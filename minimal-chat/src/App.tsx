
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';

function App() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-gray-50">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !user) {
    // This happens if an unauthorized user tried to log in
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-black text-white py-3 rounded-xl mt-4 hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return user ? <ChatPage /> : <LoginPage />;
}

export default App;
