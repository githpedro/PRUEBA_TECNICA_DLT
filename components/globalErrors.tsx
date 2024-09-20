import React, { ReactNode } from 'react';

interface GlobalErrorsProps {
  errorMessage?: string;
  successMessage?: string; 
  children: ReactNode;
}

const GlobalErrors: React.FC<GlobalErrorsProps> = ({ errorMessage, successMessage, children }) => {
  return (
    <div>
      {errorMessage && (
        <div className="error-message">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          <strong>Éxito:</strong> {successMessage}
        </div>
      )}
      {children} {}
    </div>
  );
};

export default GlobalErrors;
