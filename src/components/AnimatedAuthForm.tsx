import { ReactNode } from 'react';

interface AnimatedAuthFormProps {
  children: ReactNode;
  className?: string;
}

const AnimatedAuthForm = ({ children, className = '' }: AnimatedAuthFormProps) => {
  return (
    <div className={`auth-form-container ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedAuthForm;
