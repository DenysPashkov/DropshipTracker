import { Settings } from "lucide-react";

export default function SettingHeaderSection({ onClick }: { onClick: () => void }) {
  return (
    <button className="p-2 hover:bg-blue-200 rounded" onClick={onClick}>
      <Settings className="w-5 h-5" />
    </button>
  );
}
