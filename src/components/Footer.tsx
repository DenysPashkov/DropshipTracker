// Footer.tsx
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-300 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Made with 💙 by Denys & Gio</p>
        </div>
        <div className="flex justify-center space-x-12">
          {/* Developer 1 */}
          <div className="flex flex-col items-center">
            <span className="text-sm mb-1">Denys</span>
            <div className="flex space-x-3">
              <a
                href="https://github.com/DenysPashkov"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/denyspashkov/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Developer 2 */}
          <div className="flex flex-col items-center">
            <span className="text-sm mb-1">Gio</span>
            <div className="flex space-x-3">
              <a
                href="https://github.com/haruka1727"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/giovanna-di-mauro-1ba6a4243/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
