
export function Button({ children,  ...props }: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button className="bg-blue-600 w-32 p-2 text-white rounded" {...props}>
      {children}
    </button>
  );
}

export function SmallButton({ children }: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button className="bg-blue-600 p-2 text-white rounded">
      {children}
    </button>
  );
}