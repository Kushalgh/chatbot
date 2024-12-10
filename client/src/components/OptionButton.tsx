import React from "react";

interface OptionButtonProps {
  text: string;
  onClick: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
    >
      {text}
    </button>
  );
};

export default OptionButton;
