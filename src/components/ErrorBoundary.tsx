import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const ErrorBoundary = () => {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-cuba-red" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {error?.message || "An unexpected error occurred"}
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => window.location.reload()}
            className="bg-cuba-red hover:bg-cuba-red/90"
          >
            Refresh Page
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
