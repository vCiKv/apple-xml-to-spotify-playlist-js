export default function Loading(props: { isMini?: boolean }) {
  const { isMini } = props
  return (<div style={{
    position: "relative",
    height: isMini ? "auto" : "100px",
    width: isMini ? "auto" : "100%",
    padding: "10px 0"
  }}>
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      translate: "-50% -50%",
      height: "100%",
      width: "100%",
    }}>

      <div className="loader" style={{
        scale: isMini ? 0.4 : 1
      }}>
      </div>

    </div>
  </div>)
}