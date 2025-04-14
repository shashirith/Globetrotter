export default function SadFaceAnimation() {
  return (
    <video className="sad-face-video" autoPlay loop muted playsInline>
      <source src="/sadface.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}
