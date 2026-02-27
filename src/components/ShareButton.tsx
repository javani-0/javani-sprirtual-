import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  /** relative path, e.g. /products/abc123 */
  url: string;
  className?: string;
}

const ShareButton = ({ title, text, url, className = "" }: ShareButtonProps) => {
  const fullUrl = `${window.location.origin}${url}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${text}\n\n${fullUrl}`, url: fullUrl });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = fullUrl;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      alert(`Link copied!\n${fullUrl}`);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-gold flex-shrink-0 flex items-center justify-center ${className}`}
      aria-label="Share"
      title="Share"
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
};

export default ShareButton;
