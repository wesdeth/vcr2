export default function Footer() {
  return (
    <footer className="flex justify-center items-center py-8 px-6">
      <div className="flex gap-6 text-sm text-gray-400">
        <a 
          href="/privacy-policy" 
          className="hover:text-white transition-colors duration-200"
        >
          Privacy Policy
        </a>
        <a 
          href="/terms-of-service" 
          className="hover:text-white transition-colors duration-200"
        >
          Terms of Service
        </a>
        <a 
          href="/pitch-examples" 
          className="hover:text-white transition-colors duration-200"
        >
          Pitch Examples
        </a>
        <a 
          href="/help" 
          className="hover:text-white transition-colors duration-200"
        >
          Help
        </a>
      </div>
    </footer>
  )
}