# gophers OBS overlay

a gopher game overlay for OBS, for [rosco](https://www.twitch.tv/roscomcc)

<img src="gopher.png" alt="A gopher" width="100px" />

## using in OBS

there's two ways, using the online link or downloading. downloading the files will be more reliable as you won't need to download anything on the fly and if the website goes down it will 100% work. the downside to downloading is you'll need to download each time if there's updates. you could have both and keep the local version as a backup.

both options use the `Browser` source with the following settings:

|Option|Value|
|-|-|
|FPS|60|
|Width|1280|
|Height|720|
|✅|Shutdown source when not visible|
|✅|Refresh browser when not visible|

## Online hosted version

|Option|Value|
|-|-|
|URL|https://zaccolley.github.io/gophers/|

## More reliable download version

1. [Download the website code from here](https://github.com/zaccolley/gophers/archive/main.zip)
2. Unzip and stick somewhere familiar
3. Use the `Local file` option instead of `URL` and point it at the `index.html` file in the folder for example:
  
  |Option|Value|
  |-|-|
  |Local file|/Users/zac/Documents/gophers-main/index.html|
