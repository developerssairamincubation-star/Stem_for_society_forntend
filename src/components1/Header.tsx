import { Navbar } from "@/sfs/components/Navbar";

/**
 * The platform header is now the redesigned SFS navigation bar.
 * The bar floats (position: fixed), so the spacer keeps the old pages' content from sliding underneath it.
 */
const Header = () => (
  <div className="sfs-ui">
    <Navbar />
    <div aria-hidden="true" className="h-24" />
  </div>
);

export default Header;
