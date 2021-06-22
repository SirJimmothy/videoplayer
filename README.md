# Lightweight Video Wrapper
Lightweight video wrapper with customisable and reorderable controls

## Basic usage:

Simply include the JavaScript file as follows:

```html
<script src="https://sirjimmothy.github.io/videoplayer/embeds.js" />
<script src="https://sirjimmothy.github.io/videoplayer/videoplayer.js" />
```
and wrap video elements (all arguments removed)  as follows:

```html
<div class="videoplayer"><video><source src="video1.mp4" type="video/mp4" /></video></div>
```

All inages and icons are encoded within the **embeds.js** file; if this is not included, then the local files **icons.png** and **inconsolata-regular.ttf** should be downloaded and stored in the same directory.

The following data attributes may also be added for additional functionality:

Argument | Description
-------- | --------
data-title="Video Title" | Title of the video. Appears at the top of the player
data-bgcolor="#000000" | The background colour of the wrapper. Defaults to transparent
data-opts="10000" | Player options - format shown below:

### Player options:
The player options are a series of flags, either 1 or 0, relating to each option:

Pos | Description
-------- | --------
1 | Whether to automatically focus the video, allowing keyboard shortcuts to be used immediately
2 | Whether to automatically play the video upon page load. If the site is not trusted for autoplay, the video is muted and a second autoplay request sent
3 | Whether to automatically loop the video upon ending
4 | Whether to display a help icon on the video to assist with keyboard controls
5 | Whether to have all keypress events display the video overlay

For example, to automatically focus the video and display the help icon, the following options would be used:

```html
data-opts="10010"
```

## Video tag options:
The following HTML video tag arguments apply and are not overridden by the wrapper:

Arguments | Description
----------| -----------
preload | How much of the video to preload<br />Values: *auto* / *metadata* / *none*
poster | Image URL to display over the video prior to load or initial playback. Ideally matches video dimensions

## Customisation:

If you've made your own copy of the JavaScript files, you can modify the config object at the top, with the following options available:

Object | Description
------ | ------
class | The class name to monitor to select videos to wrap
controls | The entries in this array may be reordered to customise the wrappers to your requirements
cookie | The script will remember the previous volume set for the domain, held in a cooke with the prefix defined here
hide | How long before the overlay should be auto-hidden after no mouse movement when unpaused
interval | How often the script timers should poll to detect mouse movement and update timers

## Video scaling and wrapper styling:

The wrapper div used, specified above, may be styled however you choose, although borders should be approached with care, as without the ***box-sizing: border-box;*** CSS rule, borders will impinge on the space available for the video.

By default, the video will be displayed at its native size, however to scale a video to a desired size depends on whether the video is landscape or portrait:

- If the video is landscape, specify only the wrapper's width
- If the video is portrait, specify only the wrapper's height
- If the video is square, either may be specified

Depending on which dimension attribute is set, the script will automatically scale the other attribute of the video in proportion.

*Note: regardless of all calculations, the wrapper div has a minimum width of 350px, which is needed to display all controls.*

