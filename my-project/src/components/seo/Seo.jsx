import { Helmet } from "react-helmet-async";

// Site-wide defaults. Change SITE_URL once you have the real domain —
// everything below reads from this, nothing else needs editing.
const SITE_NAME = "Mmemme Abia";
const SITE_URL = "https://www.mmemme.com.ng";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

/**
 * Drop this at the top of any page to give it its own title, description
 * and social-share preview instead of inheriting the generic one from
 * index.html. For a dynamic page (an event, a restaurant), pass that
 * item's own title/description/image so a shared link shows the right
 * preview and Google indexes the right content for that URL.
 *
 * <Seo
 *   title="South East Migration Dialogue 26"
 *   description="Join the South East Migration Dialogue in Umuahia..."
 *   image={event.image}
 *   path={`/events/${event.id}`}
 * />
 */
const Seo = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  path = "",
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  // Relative image paths (e.g. "/event5.jpg" from event data) still need
  // a full URL for Open Graph/Twitter to fetch them correctly.
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
};

export default Seo;
