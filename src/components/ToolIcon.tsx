import { useCallback, useState } from "react";

export function ToolIcon(props: { name: string; icon: string }) {
  const [copied, setCopied] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const onClick = useCallback(
    async function (event: any) {
      console.log("A");
      try {
        await navigator.clipboard.writeText(props.name);
        setCopied(true);
        const { clientX, clientY } = event;
        setPopupPosition({ x: clientX, y: clientY });

        setTimeout(() => setCopied(false), 400); // Hide popup after 2 seconds
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    },
    [setCopied],
  );

  return (
    <div style={{ display: "block", textAlign: "center" }}>
      <i className={`${props.icon} tool-icon`} onClick={onClick}></i>
      {copied && (
        <div
          className="tool-icon-copied-popup"
          style={{
            left: `${popupPosition.x+10}px`,
            top: `${popupPosition.y}px`,
            transform: "translate(-50%, -100%)", // Center the popup above the click point
          }}
        >
          Copied!
        </div>
      )}
    </div>
  );
}
