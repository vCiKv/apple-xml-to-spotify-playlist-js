import Loading from "./loading";
import { ChangeEvent } from "preact/compat";
import { useState } from "preact/hooks";
import { xmlToSpotifyJSON } from "../lib";

export default function LibraryInputForm(props: { setState: (val: any) => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [advanceInfo, setAdvanceInfo] = useState(false)

  // const loadXMLData = async () => {
  //   if (isLoading) {
  //     return
  //   }
  //   setIsLoading(true)
  //   await delay(1000)
  //   try {
  //     const xmlData = await loadXML("./Library.xml")
  //     const xmlResult = await xmlToSpotifyJSON(xmlData)
  //     const newData = []
  //     for (const music of xmlResult) {
  //       newData.push({ ...music, isFound: false, rating: 0 })
  //     }
  //     newData.sort((a, b) => (a.Year >= b.Year) ? 1 : -1)
  //     props.setState(newData)
  //   } catch (e) {
  //     console.error("Conversion Error", e)
  //   }    setIsLoading(false)
  // }
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const target = event.target as HTMLInputElement;
    const file: File | null | undefined = target?.files?.[0];
    if (file) {
      let contentToJson = null
      if (file.type === 'application/json' || file.type === "json") {
        contentToJson = JSON.parse(await file.text())
      } else if (file.type === 'application/xml' || file.type === 'text/xml' || file.type === "xml") {
        contentToJson = await xmlToSpotifyJSON(await file.text())
      } else {
        alert('Invalid file type. Please select a JSON or XML file.');
      }
      if (contentToJson) {
        props.setState(contentToJson)
      }
    } else {
      console.log("unable to load file")
    }
    setIsLoading(false)

  }
  if (isLoading) {
    return <Loading />
  }
  return (
    <div style={{
      padding: "20px 0"
    }}>
      <h1>Convert iTunes Library to Spotify Playlist</h1>
      <div>
        {/* <div className={"input"}>
          <label htmlFor={"xml-string"}>Input XML</label>
          <textarea
            name="xml-string"
            rows={4}
            value={xmlString}
            onChange={(e) => setXmlString(e.currentTarget.value)}
          />
        </div> */}
        <div style={{
          background: "#666",
          padding: "12px",
          border: "1px solid",
          borderRadius: 8
        }}
          className={"input"}
        >
          <label htmlFor={"file-upload"} >upload XML/JSON library file</label><br />
          <input
            name="file-upload"
            type={"file"}
            accept=".json, .xml, application/json, application/xml, text/xml"
            onChange={handleFileChange}
          />
        </div>
        <span style={{ textDecoration: "underline", padding: "8px 0", cursor: "pointer", display: "block" }} onClick={() => setAdvanceInfo(p => !p)}>click to see/hide json shape</span>
        {advanceInfo && <div>
          <h6>JSON format</h6>
          <pre>
            <p>Playlist Only : string</p>
            <p>Apple Music : string</p>
            <p>Track Type : string</p>
            <p>Persistent ID : string</p>
            <p>Sort Name : string</p>
            <p>Sort Artist : string</p>
            <p>Sort Album : string</p>
            <p>Artwork Count : number</p>
            <p>Compilation : string</p>
            <p>Release Date : string</p>
            <p>Sample Rate : number</p>
            <p>Bit Rate : number</p>
            <p>Year : number</p>
            <p>Track Count : number</p>
            <p>Track Number : number</p>
            <p>Disc Count : number</p>
            <p>Disc Number : number</p>
            <p>Total Time : number</p>
            <p>Size : number</p>
            <p>Kind : string</p>
            <p>Genre : string</p>
            <p>Album : string</p>
            <p>Composer : string</p>
            <p>Album Artist : string</p>
            <p>Artist : string</p>
            <p>Name : string</p>
            <p>Track ID : number</p>
            <p>isFound : boolean</p>
            <p>rating : number</p>
          </pre>
        </div>
        }
      </div>
    </div>

  )
}