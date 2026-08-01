import SocialMediaLinks from "../../components/SocialMediaLinks";
import { OutlinedBadge } from "../../../../shared/ui/badges/OutlinedBadge";
import { GiHelmet } from "react-icons/gi";
import { TbHelmet } from "react-icons/tb";
import { FaHelmetSafety } from "react-icons/fa6";

export default function UnderDevelopment() {
  return (
    <>
      <div className={"flex justify-center"}>
        <OutlinedBadge>
          <GiHelmet />
          تحت التطوير
        </OutlinedBadge>
      </div>
      <div className="px-12 py-8 h-full">
        {/* Heading */}
        <div className="mb-4 flex flex-col items-center gap-4">
          <p className="text-xl font-bold text-center leading-10">
            للأسف لسه الميزة دي تحت التطوير،
            <br />
            هنضيفها قريب جداً
          </p>
          <FaHelmetSafety size={32} />
        </div>
        {/* Link Text */}
      </div>
    </>
  );
}
