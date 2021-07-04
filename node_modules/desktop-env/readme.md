# desktop-env [![Build Status Travis](https://travis-ci.org/t1st3/desktop-env.svg?branch=master)](https://travis-ci.org/t1st3/desktop-env)

> Detect which [desktop environment](https://en.wikipedia.org/wiki/Desktop_environment) is run in the current session 


## Install

```
$ npm install --save desktop-env
```


## Usage

```js
const desktopEnv = require('desktop-env');

desktopEnv().then(data => {
  console.log(data);
  //=> Cinnamon, Gnome, KDE, LXDE, Mate, Sugar, Unity, XFCE
});
```


## API

### desktopEnv()


Is a promise.


## Related

* [is-cinnamon](https://github.com/t1st3/is-cinnamon) | Check if the current session runs [Cinnamon desktop](https://github.com/linuxmint/Cinnamon).
* [is-gnome](https://github.com/t1st3/is-gnome) | Check if the current session runs [Gnome desktop](https://www.gnome.org/).
* [is-kde](https://github.com/t1st3/is-kde) | Check if the current session runs [KDE desktop](https://www.kde.org/).
* [is-lxde](https://github.com/t1st3/is-lxde) | Check if the current session runs [LXDEdesktop](http://lxde.org/).
* [is-mate](https://github.com/t1st3/is-mate) | Check if the current session runs [Mate desktop](http://mate-desktop.com/).
* [is-sugar](https://github.com/t1st3/is-sugar) | Check if the current session runs [Sugar desktop](https://www.sugarlabs.org/).
* [is-unity](https://github.com/t1st3/is-unity) | Check if the current session runs [Unity desktop](https://unity.ubuntu.com/).
* [is-xfce](https://github.com/t1st3/is-xfce) | Check if the current session runs [XFCE desktop](https://www.xfce.org/).


## License

MIT © [t1st3](http://tiste.org)
