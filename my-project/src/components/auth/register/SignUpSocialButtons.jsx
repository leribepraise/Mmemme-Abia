import SocialAuthButtons from '../SocialAuthButtons';

export default function SignUpSocialButtons({ flow = 'organizer', termsAccepted = false }) {
  return <SocialAuthButtons flow={flow} signup termsAccepted={termsAccepted} />;
}
