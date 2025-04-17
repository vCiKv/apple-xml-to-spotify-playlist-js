import { MusicItem, MusicLog } from './music-ui';
import { Toaster } from './portals';
import { Dispatch, useState, StateUpdater, useEffect } from 'preact/hooks';
import { getSpotifyUserId, delay, createSpotifyPlaylist, addToSpotifyPlaylist, getSpotifyTrackId, handleJsonDownload } from '../lib';

const PLAYLIST_LIMIT = 7900

export default function MusicBox(props: {
  musicData: {
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
  }[],
  setMusicData: Dispatch<StateUpdater<{
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
  }[]>>
}) {
  const { musicData, setMusicData } = props
  const [isLoading, setIsLoading] = useState(false)
  const [currentMusicPage, setCurrentPage] = useState(1)
  const [musicPerPage, setMusicPerPage] = useState(50)
  const [hasCheckedSpotify, setHasCheckedSpotify] = useState(false)

  const [spotifyTrackUris, setSpotifyTrackUris] = useState<string[]>([])
  const [musicLog, setMusicLog] = useState({
    artist: "",
    year: 0,
    album: "",
    track: ""
  })
  // const updateMusicFromSpotify = (index: number, isFound: boolean, rating: number) => {
  //   const copyMusicData = { ...musicData }
  //   if (musicData[index]) {
  //     copyMusicData[index] = { ...musicData[index], isFound, rating }
  //     setMusicData(copyMusicData)
  //   }
  // }
  const spotifyTracksUriLocal: string[] = []
  const copyMusicData = { ...musicData }
  // let hasCheckedSpotify = false
  useEffect(() => {
    console.log("state")
    // setMusicData(() => copyMusicData)
    setSpotifyTrackUris(() => spotifyTracksUriLocal)
    setIsLoading(false)
    setMusicLog({
      artist: "",
      year: 0,
      album: "",
      track: ""
    })
  }, [hasCheckedSpotify])
  const addToPlaylist = async (uris: string[]) => {
    setIsLoading(true)
    try {
      const playlistId = await createSpotifyPlaylist("apple_music")
      if (playlistId) {
        await addToSpotifyPlaylist(playlistId, uris).then(res => {
          if (res) {
            console.log("playlist is lit🔥")
            setIsLoading(false)
            return
          } else {
            console.error("unable to complete")
            setIsLoading(false)
            return
          }
        })
      } else {
        console.error("failed to create playlist")
        setIsLoading(false)
        return
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      return
    }
  }
  const addAlbumToSpotify = async () => {
    if (isLoading) {
      console.log("running")
      return
    }
    setIsLoading(true)
    // const foundAlbums: string[] = []
    // const spotifyTrackUrisLocal: string[] = []
    // const spotifyTracksUriLocal: string[] = []
    // const copyMusicData = { ...musicData }
    let currentIndex = 0
    // let playlistSize = 0

    const spotifyUserId = await getSpotifyUserId()
    if (!spotifyUserId) {
      console.error("addAlbum: no id found please login in")
      setIsLoading(false)
      return
    }
    for (const music of musicData) {
      console.group("track info")
      setMusicLog({
        artist: music.Artist,
        year: music.Year,
        album: music.Album,
        track: music.Name
      })
      try {
        await delay(700)
        await getSpotifyTrackId(music.Name, music.Artist, music.Year).then((spotifyMusicId) => {
          console.log("tracks info", spotifyMusicId)
          if (spotifyMusicId.id && spotifyMusicId) {
            spotifyTracksUriLocal.push(spotifyMusicId.id)
            if (musicData[currentIndex]) {
              copyMusicData[currentIndex] = { ...musicData[currentIndex], isFound: true, rating: spotifyMusicId.rating ?? 1 }
            }
          } else {
            if (musicData[currentIndex]) {
              copyMusicData[currentIndex] = { ...musicData[currentIndex], isFound: false, rating: -1 }
            }

          }
        })
        await delay(500)

      } catch (error) {
        console.error("error getting album", error)
      }
      // if (playlistSize > PLAYLIST_LIMIT) {
      //   await
      //   playlistSize = 0
      // }
      currentIndex++
      // playlistSize++
      console.groupEnd()
    }
    setHasCheckedSpotify(true)
    // setMusicData(() => copyMusicData)
    // setSpotifyTrackUris(() => spotifyTracksUriLocal)
    // setIsLoading(() => false)
    // setMusicLog(() => {
    //   return {
    //     artist: "",
    //     year: 0,
    //     album: "",
    //     track: ""
    //   }
    // })
    console.log("music", musicData)
    console.log("ids state", spotifyTrackUris)
    console.log("ids local", spotifyTracksUriLocal)
  }
  return (
    <div className={"music-box"}>
      <Toaster active={musicLog.album !== "" ? true : false}>
        <MusicLog {...musicLog} />
      </Toaster>
      {(musicData.length > 0) &&
        <>
          <div className={"button-group apart"}>
            <button onClick={() => handleJsonDownload(musicData, "itunes-library")}>
              Download as JSON
            </button>
            <button onClick={addAlbumToSpotify} className={"green"}>
              Check on Spotify
            </button>
            <button className={"destructive"} onClick={() => { setMusicData([]); window.location.reload(); }}>
              Clear List
            </button>
          </div>
          <PageController currentMusicPage={currentMusicPage} musicPerPage={musicPerPage} totalPages={musicData.length} setCurrentPage={setCurrentPage} />
        </>
      }
      {
        (spotifyTrackUris.length > 0) ?
          <div className={"button-group"}>
            <button onClick={() => addToPlaylist(spotifyTrackUris)} className={"green"}>Add To Spotify Playlist</button>
          </div>
          :
          <></>
      }
      <div className={"box"}>
        {
          musicData
            .slice((0 + (musicPerPage * (currentMusicPage - 1))), (musicPerPage * currentMusicPage))
            .map((item, index) =>
              <MusicItem {...item} key={"music-item-" + index} />
            )
        }
      </div>
    </div>
  )
}

function PageController(props: {
  totalPages: number,
  currentMusicPage: number,
  musicPerPage: number
  setCurrentPage: Dispatch<StateUpdater<number>>
}) {
  const { totalPages, currentMusicPage, setCurrentPage, musicPerPage } = props
  // const [currentMusicPage, setCurrentPage] = useState(1)
  // const [musicPerPage, setMusicPerPage] = useState(50)
  const maxPages = Math.floor(totalPages / musicPerPage)
  const nextPage = () => {
    if (currentMusicPage >= maxPages) {
      setCurrentPage(maxPages)
    } else {
      setCurrentPage(val => val + 1)
    }
  }
  const prevPage = () => {
    if (currentMusicPage <= 1) {
      setCurrentPage(1)
    } else {
      setCurrentPage(val => val - 1)
    }
  }
  return (
    <div className={"button-group apart"}>
      <button onClick={prevPage}>prev</button>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <span>
          {currentMusicPage} of {maxPages + 1}
        </span>
        {/* <div>
                  <select name="music-per-page-selector">
                    <option>items per page</option>
                    <option onClick={() => setMusicPerPage(50)}>50</option>
                    <option onClick={() => setMusicPerPage(100)}>100</option>
                    <option onClick={() => setMusicPerPage(150)}>150</option>
                    <option onClick={() => setMusicPerPage(200)}>200</option>
                  </select>
                </div>
                {musicPerPage} */}
      </div>
      <button onClick={nextPage}>next</button>
    </div>
  )
}