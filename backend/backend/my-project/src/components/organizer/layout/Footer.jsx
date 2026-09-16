export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-about">
          <img src="/logo.png" alt="Mmemme Abia" />
          <p>Mmemme Abia is your go-to platform for discovering, booking and enjoying the best events across Abia State.</p>
          <div className="footer-socials"><span>f</span><span>◎</span><span>◉</span><span>♪</span><span>▶</span></div>
        </div>
        <div><strong>Quick Links</strong><a>Explore Events</a><a>Categories</a><a>Venues</a><a>Calendar</a><a>Blog</a><a>Contact Us</a></div>
        <div><strong>Account</strong><a>My Tickets</a><a>Saved Events</a><a>Profile</a><a>Settings</a><a>Help Center</a><a>Log in/ Sign Up</a></div>
        <div><strong>Organizer</strong><a>Become an Organizer</a><a>Organizer Dashboard</a><a>Create Event</a><a>Pricing</a><a>Resources</a></div>
        <div><strong>Support</strong><a>FAQs</a><a>Contact Support</a><a>Terms &amp; Conditions</a><a>Privacy Policy</a></div>
        <div>
          <strong>Download App</strong>
          <p>Get the Mmemme Abia app for better experience.</p>
          <img className="store-badge" src="/google.png" onError={(e) => { e.currentTarget.style.display = "none"; }} alt="" />
          <img className="store-badge" src="/apple.png" alt="" />
        </div>
      </div>
      <div className="footer-bottom">© 2026 Mmemme Abia. All rights reserved.</div>
    </footer>
  );
}
