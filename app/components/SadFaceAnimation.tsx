export default function SadFaceAnimation() {
  return (
    <video width="10%" autoPlay loop muted playsInline>
      <source src="/sadface.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}
