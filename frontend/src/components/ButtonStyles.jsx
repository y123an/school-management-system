// Tailwind CSS classes for buttons

const buttonStyles = {
  red: "bg-red-500 text-white ml-1 hover:bg-red-300 hover:border-red-400 hover:shadow-none",
  black:
    "bg-black text-white ml-1 hover:bg-gray-800 hover:border-gray-800 hover:shadow-none",
  darkRed:
    "bg-red-800 text-white hover:bg-red-300 hover:border-red-400 hover:shadow-none",
  blue: "bg-blue-900 text-white hover:bg-blue-700",
  purple: "bg-purple-900 text-white hover:bg-purple-700",
  lightPurple: "bg-purple-500 text-white hover:bg-purple-400",
  green: "bg-green-900 text-white hover:bg-green-600",
  brown:
    "bg-brown-800 text-white hover:bg-brown-600 hover:border-brown-600 hover:shadow-none",
  indigo:
    "bg-indigo-800 text-white hover:bg-indigo-600 hover:border-indigo-700 hover:shadow-none",
};

// Usage example
export const RedButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.red}`} {...props}>
    {children}
  </button>
);

export const BlackButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.black}`} {...props}>
    {children}
  </button>
);

export const DarkRedButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.darkRed}`} {...props}>
    {children}
  </button>
);

export const BlueButton = ({ children, ...props }) => (
  <button className={`btn bg-blue-900 text-white hover:bg-blue-700`} {...props}>
    {children}
  </button>
);

export const PurpleButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.purple}`} {...props}>
    {children}
  </button>
);

export const LightPurpleButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.lightPurple}`} {...props}>
    {children}
  </button>
);

export const GreenButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.green}`} {...props}>
    {children}
  </button>
);

export const BrownButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.brown}`} {...props}>
    {children}
  </button>
);

export const IndigoButton = ({ children, ...props }) => (
  <button className={`btn ${buttonStyles.indigo}`} {...props}>
    {children}
  </button>
);
