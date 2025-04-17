import React, { createPortal } from "preact/compat";

export function Toaster(props: { children: React.ReactElement, active?: boolean }) {
  if (!props.active) {
    return <></>
  }
  return createPortal(
    <>
      <div style={{
        position: "fixed",
        right: 30,
        bottom: 60,
        width: "410px",
        background: "rgba(6,2,3)",
        padding: 5,
        border: "1px solid",
        borderRadius: 8
      }}>
        {props.children}
      </div>
    </>,
    document.body
  )
}
export function Modal(props: { children: React.ReactElement, isOpen: boolean, close: () => void }) {
  return createPortal(
    <>
      <div style={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.5)",
        top: 0,
        left: 0,
      }}>
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
        }}>
          {props.children}
        </div>
      </div>
    </>,
    document.body
  )


}
