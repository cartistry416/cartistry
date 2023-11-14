import "../static/css/navBar.css";

function redirect(){
  window.location.href = '/';
}

function NavBar() {
  return (
    <div id="navBarWrapper">
      <h1 id="logotype" onClick={redirect}>Cartistry</h1>
      <div class="profileIcon material-icons">account_circle</div>
    </div>
  );
}

export default NavBar;
