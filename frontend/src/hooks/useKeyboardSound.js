const keyStrokeSound = [
  new Audio("/sounds/key-stroke1.mp3"),
  new Audio("/sounds/key-stroke2.mp3"),
  new Audio("/sounds/key-stroke3.mp3"),
  new Audio("/sounds/key-stroke4.mp3"),
];
function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    const randomSound =
      keyStrokeSound[Math.floor(Math.random() * keyStrokeSound.length)];
    randomSound.currentTime = 0; // this is to reset the sound to the start for better experience
    randomSound
      .play()
      .catch((error) => console.log("Audio play failed:", error));
  };
  return { playRandomKeyStrokeSound };
}
export default useKeyboardSound;
