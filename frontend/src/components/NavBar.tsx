import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav className={"bg-amber-400 h-10"}>
      <div className={"flex items-center h-full"}>
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
}
