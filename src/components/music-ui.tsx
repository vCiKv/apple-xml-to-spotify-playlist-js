function MusicLog(props: { artist?: string | null, album?: string | null, year?: string | null | number }) {
  const { artist, album, year } = props
  return (
    <div>
      <p>
        Looking for: <b>{album}</b> <br />by, <i>{artist}</i><br /> year: <b>{year}</b>
      </p>
    </div>
  )
}
function MusicItem(props: {
  isFound: boolean;
  rating: number;
  TrackID: number;
  Name: string;
  Artist: string;
  AlbumArtist: string;
  ArtistName: string;
  Album: string;
  Year: number;
  Genre: string;
}) {
  const getConfidence = (val: number, isFound?: boolean) => {
    if (!isFound) {
      return <span>not checked</span>
    }
    if (val < 3) {
      return <span style={{ color: "red" }}>not confident</span>
    } else if (val < 5) {
      return <span style={{ color: "yellow" }}>average</span>
    } else {
      return <span style={{ color: "green" }}>very confident</span>
    }

  }
  return (
    <div
      style={{

      }}
      className={"album"}
    >
      <ul>
        {/* <li>id:{props.TrackID}</li> */}
        <li style={{ fontSize: "21px", fontWeight: 700 }}>{props.Name}</li>
        <li style={{ fontSize: "18px" }}>
          <i>
            {props.Artist}
          </i>
        </li>
        <li>
          <div style={{ display: "flex", gap: "8xp", flexWrap: "nowrap", justifyContent: "space-between" }}>
            <div>
              {props.Album} [<b>{props.Year ?? "year not specified"}</b>]
            </div>
            <div style={{ display: "flex", direction: "column", gap: "2px" }}>
              <div>{props.Genre}</div>
            </div>
          </div>
        </li>
      </ul>
      <div style={{ paddingTop: "10px" }}>Confidence {getConfidence(props.rating, props.isFound)}</div>
    </div>
  )
}

export { MusicItem, MusicLog }