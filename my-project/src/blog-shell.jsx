import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { Router, createPath } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/ThemeContext';
import { NotificationsProvider } from './components/context/NotificationsContext';
import './index.css';
import './theme.css';

// The article stays in Django's HTML. Only the shared site chrome mounts React.
// Header/footer navigation must load the destination document rather than change
// the location of this small React root and leave the old article on screen.
const href = to => typeof to === 'string' ? to : createPath(to);
const navigator = {
  createHref: href,
  go: delta => window.history.go(delta),
  push: to => window.location.assign(href(to)),
  replace: to => window.location.replace(href(to)),
};
const header = document.getElementById('blog-site-header');
const footer = document.getElementById('blog-site-footer');
if (header && footer) {
  header.replaceChildren();
  footer.replaceChildren();
  const root = document.createElement('div');
  root.id = 'blog-site-shell';
  document.body.appendChild(root);
  createRoot(root).render(
    <ThemeProvider>
      <Router location={window.location} navigator={navigator}>
        <AuthProvider>
          <NotificationsProvider>
            {createPortal(<Header />, header)}
            {createPortal(<Footer />, footer)}
          </NotificationsProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>,
  );
}
