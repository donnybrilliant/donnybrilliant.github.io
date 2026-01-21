import Avatar from "@vierweb/avataaars";
import { useTheme } from "@/hooks/useTheme";

export const MyAvatar = () => {
  const { primaryColor } = useTheme();

  return (
    <div className="w-full h-full">
      <Avatar
        avatarStyle="Circle"
        topType="LongHairMiaWallace"
        accessoriesType="Prescription01"
        hairColor="BrownDark"
        facialHairType="MoustacheMagnum"
        facialHairColor="BrownDark"
        clotheType="ShirtCrewNeck"
        clotheColor="PastelRed"
        skinColor="Pale"
        backgroundColor="#65C9FF"
        hoverScale={1.2}
        hoverSequence={[
          { mouthType: "Disbelief", eyeType: "Surprised", eyebrowType: "UpDown" },
          { mouthType: "ScreamOpen", eyeType: "Dizzy", eyebrowType: "Angry" },
          { mouthType: "Vomit", eyeType: "Close", eyebrowType: "SadConcerned" },
          {
            mouthType: "Grimace",
            eyeType: "EyeRoll",
            eyebrowType: "UnibrowNatural",
          },
        ]}
        hoverAnimationSpeed={400}
        animationSpeed={1400}
        maskBackgroundColor={primaryColor}
      />
    </div>
  );
};
