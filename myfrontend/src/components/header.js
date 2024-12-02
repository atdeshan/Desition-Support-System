
const Header = () => {
    
  return (
    <header style={headerStyle}>
      <h2 style={{ paddingLeft: "20px" }}>Report Maker</h2>

      <nav>
        <a href="/" style={linkStyle}>
          Home
        </a>
        <a href="/sales-graph" style={linkStyle}>
          Report
        </a>
       
        <a
          href="/logout"
          style={linkStyle}
        >
          Logout
        </a>
      </nav>
    </header>
  );
};
const headerStyle = {
  background: "rgba(106, 102, 157,.1)",
  color: "#fff",
  padding: "15px 25px",

  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
};

const linkStyle = {
  display: "inline-block",
  color: "#fff",
  width: "4em",
  textAlign: "center",
  justifyContent: "center",
  height: "25px",

  marginRight: "50px",
  fontSize: "20px",
  fontWeight: "bold",
  backgroundColor: "rgba(106, 102, 157,.3)",
  padding: "15px 25px",
  borderRadius: "50px",
};

export default Header;
