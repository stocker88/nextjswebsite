import {useSiteAccount} from './SiteAccount';
import {DESKTOP_ACCESS_PATH,desktopActionLabel,rememberDesktopThread} from '../lib/desktop-access';
import {accountLoginUrl} from '../lib/site-auth';
import {isDesktopDevice} from '../lib/device-access';
import AppDownloadModal from './AppDownloadModal';
import { useEffect, useState } from 'react';
import { trackAppStoreClick } from '../lib/analytics';

type Props = {
  from: string;
  label?: string;
  secondary?: boolean;
  popup?: boolean;
};

const iosAppStoreUrl =
  'https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320';

const androidPlayStoreUrl =
  'https://play.google.com/store/apps/details?id=com.newcompany.stocker';

function NewsletterSignUp({
  from,
  label = 'Get the App →',
  secondary = false,
  popup = false,
}: Props) {
  const {user,desktop}=useSiteAccount();
  const [showPrompt,setShowPrompt]=useState(false);
  const [storeUrl, setStoreUrl] = useState(iosAppStoreUrl);

  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) {
      setStoreUrl(androidPlayStoreUrl);
    }
  }, []);

  const trackDownload = () => {
    trackAppStoreClick({
      store: storeUrl === androidPlayStoreUrl ? 'google' : 'apple',
      placement: from,
      linkUrl: storeUrl,
    });
  };

  return (
    <>
    <a
      className={`nav-cta app-download-cta${secondary ? ' app-download-cta--secondary' : ''}`}
      href={desktop?(user?DESKTOP_ACCESS_PATH:accountLoginUrl(DESKTOP_ACCESS_PATH)):storeUrl}
      target={desktop?undefined:"_blank"}
      rel="noopener noreferrer"
      aria-haspopup={popup&&!desktop?"dialog":undefined}
      onClick={e=>{if(isDesktopDevice(navigator)){rememberDesktopThread();return;}if(popup){e.preventDefault();setShowPrompt(true)}else trackDownload()}}
    >
      {desktop?desktopActionLabel(label,!!user):label}
    </a>
    {showPrompt&&<AppDownloadModal placement={from} onClose={()=>setShowPrompt(false)}/>}
    </>
  );
}

export default NewsletterSignUp;
