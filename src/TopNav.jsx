import { Link } from 'react-router';

const TopNav = () => {
  return <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
    <Link to="/">SheetJs</Link>
    <Link to="/univer" style={{ marginLeft: '10px' }}>Univer</Link>
    <Link to="/editor" style={{ marginLeft: '10px' }}>Excel Editor</Link>
  </div>;
};

export default TopNav;
