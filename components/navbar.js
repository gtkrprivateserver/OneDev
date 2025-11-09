import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text