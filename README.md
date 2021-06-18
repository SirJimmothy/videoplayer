# Lightweight Video Wrapper
Lightweight video wrapper with customisable and reorderable controls

## Basic usage:

Simply include the JavaScript file as follows:

```html
<script src="https://sirjimmothy.github.io/videoplayer/videoplayer.js" />
```
and wrap video elements (all arguments removed)  as follows:

```html
<div class="videoplayer"><video><source src="video1.mp4" type="video/mp4" /></video></div>
```

All inages and icons are encoded within the JavaScript CSS definitions to remove the need for additional dependencies.

The following data attributes may also be added for additional functionality:

Argument | Description
-------- | --------
data-title="Video Title" | Title of the video. Appears at the top of the player
data-autofocus="true" | Whether to automatically focus the video, allowing keyboard shortcuts to be used immediately
data-autoplay="true" | Whether to automatically play the video upon page load. If the site is not trusted for autoplay, the video is muted and a second autoplay request sent
data-autoloop="true" | Whether to automatically loop the video upon ending
data-help="true" | Whether to display a help icon on the video to assist with keyboard controls
data-bgcolor="#000000" | The background colour of the wrapper. Defaults to transparent

## Customisation:

If you've made your own copy of the videoplayer.js file, you can modify the config object at the top, with the following options available:

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

