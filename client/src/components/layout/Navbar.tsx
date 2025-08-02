import { Link } from 'wouter';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#6bc016]">
              TravelVerse
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-[#6bc016]">Home</Link>
            <Link href="/explore" className="hover:text-[#6bc016]">Explore</Link>
            <Link href="/photo-guides" className="hover:text-[#6bc016]">Photo Guides</Link>
            <Link href="/analytics" className="hover:text-[#6bc016]">Analytics</Link>
            <Link href="/demo" className="hover:text-[#6bc016]">AI Demo</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;