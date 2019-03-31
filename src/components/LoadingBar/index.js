import LoadingBar from './LoadingBar';


let loadingBarInstance = null;
let loadingBarTimer = null;
let loadingBarSuccessColor = 'primary';
let loadingBarFailedColor = 'error';
let loadingBarHeight = 2;


/**
 * @return {LoadingBar}
 */
function getLoadingBarInstance() {
  if (loadingBarInstance === null) {
    // Passing parameters through props
    loadingBarInstance = LoadingBar.newInstance({
      percent: 0,
      height: loadingBarHeight,
      color: loadingBarSuccessColor,
      failedColor: loadingBarFailedColor,
    });
  }

  return loadingBarInstance;
}

/**
 * @param {Object} options
 */
function updateLoadingBar(options) {
  getLoadingBarInstance().setData(options);
}

/**
 * hide loading bar
 */
function hiddenLoadingBar() {
  setTimeout(() => {
    // hidden `LoadingBar`
    updateLoadingBar({
      show: false,
    });

    // change percent to 100 on `LoadingBar` hidden
    setTimeout(() => {
      updateLoadingBar({
        percent: 0,
      });
    }, 250); // because `css::transition-time` is 0.2s
  }, 650);
}

/**
 * destroy timer
 */
function cleanLoadingBarTimer() {
  if (loadingBarTimer !== null && loadingBarTimer !== true) {
    clearInterval(loadingBarTimer);
  }
  loadingBarTimer = null;
}


export default {
  /**
   * @param {boolean} autoIncrementPercent
   */
  start(autoIncrementPercent = true) {
    if (loadingBarTimer === null) {
      let percent = 0;
      updateLoadingBar({
        percent,
        status: 'success',
        show: true,
      });

      // each 200ms to add random percent mendaciously when needed
      if (autoIncrementPercent) {
        loadingBarTimer = setInterval(() => {
          percent += Math.floor((Math.random() * 2) + 1);
          if (percent > 95) {
            cleanLoadingBarTimer();
          }

          updateLoadingBar({
            percent,
          });
        }, 200);
      } else {
        loadingBarTimer = true;
      }
    }
  },
  /**
   * @param {object} options
   */
  config(options) {
    if ('color' in options) {
      loadingBarSuccessColor = options.color;
    }
    if ('failedColor' in options) {
      loadingBarFailedColor = options.failedColor;
    }
    if ('height' in options) {
      loadingBarHeight = parseInt(options.height, 10);
    }
  },
  /**
   * @param {number} percent
   * @param {boolean} autoFinish
   */
  update(percent, autoFinish = true) {
    cleanLoadingBarTimer();
    updateLoadingBar({
      percent,
    });

    if (autoFinish && percent >= 100) {
      hiddenLoadingBar();
    }
  },
  finish() {
    cleanLoadingBarTimer();
    updateLoadingBar({
      percent: 100,
      status: 'success',
      show: true,
    });
    hiddenLoadingBar();
  },
  error() {
    cleanLoadingBarTimer();
    updateLoadingBar({
      percent: 100,
      status: 'error',
      show: true,
    });
    hiddenLoadingBar();
  },
  destroy() {
    cleanLoadingBarTimer();
    const instance = getLoadingBarInstance();
    loadingBarInstance = null;
    instance.destroy();
  },
};
