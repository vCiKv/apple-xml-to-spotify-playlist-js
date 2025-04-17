import { useState } from 'preact/hooks';
import MusicBox from './music-box';
import LibraryInputForm from './library-input';

export default function AppController() {
  const [musicData, setMusicData] = useState<{
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
  }[]>([])
  // const [musicLog, setMusicLog] = useState({
  //   artist: "",
  //   year: 0,
  //   album: "",
  //   track: ""
  // })

  // const updateMusicFromSpotify = (index: number, isFound: boolean, rating: number) => {
  //   const copyMusicData = { ...musicData }
  //   if (musicData[index]) {
  //     copyMusicData[index] = { ...musicData[index], isFound, rating }
  //     setMusicData(copyMusicData)
  //   }
  // }

  // const [spotifyAlbumIds, setSpotifyAlbumIds] = useState<string[]>([])
  // const addToPlaylist = async (uris: string[]) => {
  //   setIsLoading(true)
  //   try {
  //     const playlistId = await createSpotifyPlaylist("apple_music")
  //     if (playlistId) {
  //       await addToSpotifyPlaylist(playlistId, uris).then(res => {
  //         if (res) {
  //           console.log("playlist is lit🔥")
  //           setIsLoading(false)
  //           return
  //         } else {
  //           console.error("unable to complete")
  //           setIsLoading(false)
  //           return
  //         }
  //       })
  //     } else {
  //       console.error("failed to create playlist")
  //       setIsLoading(false)
  //       return
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     setIsLoading(false)
  //     return
  //   }
  // }
  // const addAlbumToSpotify = async () => {
  //   if (isLoading) {
  //     console.log("running")
  //     return
  //   }
  //   setIsLoading(true)
  //   // const foundAlbums: string[] = []
  //   // const spotifyAlbumIdsLocal: string[] = []
  //   const spotifyTracksUriLocal: string[] = []
  //   let currentIndex = 0
  //   let playlistSize = 0
  //   const copyMusicData = { ...musicData }

  //   const spotifyUserId = await getSpotifyUserId()
  //   if (!spotifyUserId) {
  //     console.error("addAlbum: no id found please login in")
  //     setIsLoading(false)
  //     return
  //   }
  //   for (const music of musicData) {
  //     console.group("track info")
  //     setMusicLog({
  //       artist: music.Artist,
  //       year: music.Year,
  //       album: music.Album,
  //       track: music.Name
  //     })
  //     // if (foundAlbums.includes(music.Album)) {
  //     //   // updateMusicFromSpotify(currentIndex, true, lastRating)
  //     //   if (musicData[currentIndex]) {
  //     //     copyMusicData[currentIndex] = { ...musicData[currentIndex], isFound: true, rating: lastRating }
  //     //     // setMusicData(copyMusicData)
  //     //   }
  //     // } else {
  //     try {
  //       await delay(2000)
  //       await getSpotifyTrackId(music.Name, music.Artist, music.Year).then((spotifyMusicId) => {
  //         console.log("return getAlbum", spotifyMusicId)
  //         if (spotifyMusicId.id && spotifyMusicId) {
  //           spotifyTracksUriLocal.push(spotifyMusicId.id)
  //           // lastRating = spotifyMusicId.rating
  //           // updateMusicFromSpotify(currentIndex, true, spotifyMusicId.rating ?? 1)
  //           if (musicData[currentIndex]) {
  //             copyMusicData[currentIndex] = { ...musicData[currentIndex], isFound: true, rating: spotifyMusicId.rating ?? 1 }
  //             // setMusicData(copyMusicData)
  //           }
  //           // foundAlbums.push(music.Name)
  //         } else {
  //           // updateMusicFromSpotify(currentIndex, false, -1)
  //           if (musicData[currentIndex]) {
  //             copyMusicData[currentIndex] = { ...musicData[currentIndex], isFound: false, rating: -1 }
  //             // setMusicData(copyMusicData)
  //           }

  //         }
  //       })
  //       await delay(2000)

  //     } catch (error) {
  //       console.error("error getting album", error)
  //     }
  //     if (playlistSize > playlistLimit) {
  //       await addToPlaylist(spotifyTracksUriLocal)
  //       playlistSize = 0
  //     }
  //     // }
  //     currentIndex++
  //     playlistSize++
  //     console.groupEnd()
  //   }
  //   setMusicData(copyMusicData)
  //   setSpotifyAlbumIds(spotifyTracksUriLocal)
  //   setIsLoading(false)
  //   setMusicLog({
  //     artist: "",
  //     year: 0,
  //     album: "",
  //     track: ""
  //   })
  //   console.log("music", musicData)
  //   console.log("ids", spotifyAlbumIds)
  //   console.log("ids local", spotifyTracksUriLocal)
  // }
  if (musicData.length < 1) {
    return <LibraryInputForm setState={setMusicData} />
  } else {
    return (
      <MusicBox
        musicData={musicData}
        setMusicData={setMusicData}

      />
    )
  }
}




