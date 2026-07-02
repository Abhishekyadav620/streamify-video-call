import { useEffect, useState } from "react";
import { getFallbackAvatarUrl } from "../lib/avatar";

const ProfileAvatar = ({ src, name, alt, className = "w-full h-full object-cover" }) => {
  const fallbackSrc = getFallbackAvatarUrl(name);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return <img src={currentSrc} alt={alt || name || "Avatar"} className={className} onError={handleError} />;
};

export default ProfileAvatar;