type AvatarColorType = {
  backgroundColor: string;
  color: string;
};

function generateAvatarColors(input: string): AvatarColorType {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 60;

  const lightnessBg = 65;
  const lightnessText = 35;

  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightnessBg}%)`,
    color: `hsl(${hue}, ${saturation}%, ${lightnessText}%)`,
  };
}

export default generateAvatarColors;