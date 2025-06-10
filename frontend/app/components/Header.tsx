import Logo from "./Logo";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Logo />
      </div>
    </header>
  );
}
